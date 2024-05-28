import { ParsedReturnData } from '../interfaces/parser.interface';
import { BaseParser } from './base';
const {
  parseStringInt,
  parseStringFloat,
} = require('../../../common/utility/stringUtils');

class IPokerStrategyService extends BaseParser {
  private currentStreet: string;

  constructor() {
    super();
  }

  async parse(sections: string[]): Promise<ParsedReturnData> {

    let data: ParsedReturnData = {
      data: [],
      parsedNumber: 0,
      rejectedNumber: 0,
      rejectedTournamentPlo: 0,
      rejectedCashNlh: 0,
      rejectedCashPlo: 0,
      rejectedCashOther: 0,
      rejectedTournamentOther: 0,
      rejectedOther: 0,
    };

    for (const section of sections) {

      this.initHandData();

      const lines = section.split('\n');

      let heroString = lines.filter((item: any) => item.includes("Dealt to")).length > 0 && lines.filter((item: any) => item.includes("Dealt to"))[0].split(" ")[2]


      let lineData = this.iPokerSectionParser(section, heroString);

      if (lineData) {
        data.data.push(lineData);
        data.parsedNumber++;
      } else {
        if (!lines[0].match(/.+/)) break;
        data.rejectedNumber++;
      }
    }

    return data;
  }

  parsePokerHand(line: string) {
    const handIdRegex = /GAME #([0-9]+)/;
    const tournamentIdRegex = /Texas Hold'em NL  Tournament/;
    const dateTimeRegex = /(\d{4}\-\d{2}\-\d{2})\s(\d+:\d+:\d+)\/(\w+)/;
    const levelRegex = /level: (\d+)/;
    const blindRegex = /\((\d+)\/(\d+)\/(\d+)\)/;
    const gamePattern = /Texas (Hold'em) (NL)  Tournament/;
    const regionalRegex =
      /\[(\d{4}\-\d{2}\-\d{2}) (\d{2}:\d{2}:\d{2})\/(\w+)\]/;

    // Extract hand number
    const handId = handIdRegex.exec(line);
    if (handId) {
      this.handData.handId = handId[1];
    }

    // tournament ID
    const tournamentId = tournamentIdRegex.exec(line);
    if (tournamentId) {
      this.handData.gameFormat = 'Tournament';
      this.handData.pokerRoomId = 'IPoker';
    }

    // date regex
    const dateTime = dateTimeRegex.exec(line);
    if (dateTime) {
      this.handData.handDate = dateTime[1] + " " + dateTime[2];
      this.handData.handTime = dateTime[2];
      this.handData.handTimezone = dateTime[3];
    }

    const regionalMatch = line.match(regionalRegex);
    if (regionalMatch) {
      this.handData.regionalHandDate = regionalMatch[1];
      this.handData.regionalHandTime = regionalMatch[2];
      this.handData.regionalHandTimezone = regionalMatch[3];
    }

    //  Blind Level
    const blindLevel = levelRegex.exec(line);
    if (blindLevel) {
      this.handData.blindLevel = `Level ${blindLevel[1]}`;
    }

    //  Small & Big Blind
    const blindMatch = blindRegex.exec(line);
    if (blindMatch) {
      this.handData.ante = parseInt(blindMatch[1]);
      this.handData.smallBlind = parseInt(blindMatch[2]);
      this.handData.bigBlind = parseInt(blindMatch[3]);
    }

    // Poker Form and Type
    const gameMatch = line.match(gamePattern);
    if (gameMatch) {
      this.handData.pokerForm = gameMatch[1];
      this.handData.pokerType = gameMatch[2];
    }
  }

  parseTable(line: string): void {
    const match = line.match(
      /^Table\s+\S[\d,]+\sGTD\s\-\sRebuy,\s(\d+),\s(\d+)/,
    );
    const feePattern = /Buy-In:\s(\S)([\d,|\d.]+)\s\+\s\S([\d,|\d.]+)/;

    //  Tournament BuyIn & Fee
    const feeMatch = line.match(feePattern);
    if (feeMatch) {
      this.handData.wagerType = feeMatch[1];
      this.handData.currency = null;
      this.handData.tournamentBuyIn = parseFloat(feeMatch[2]);
      this.handData.tournamentFee = parseFloat(feeMatch[3]);
    }

    if (match) {
      const [_, tournamentId, tableNumber] = match;
      this.handData = {
        ...this.handData,
        tournamentId: parseStringInt(tournamentId),
        tournamentTableNumber: parseStringInt(tableNumber),
      };
    }
  }

  parseAction(line: string, actionFlag: string, heroString: string) {
    // action array data
    if (actionFlag.includes('Post')) {
      // action array data
      const actionRegexMap = new Map<string, RegExp>([
        [this.actionTypes.postAnte, /^(.+): Post Ante \S([\d,|\d.]+)/],
        [this.actionTypes.postSmallBlind, /^(.+): Post SB \S([\d,|\d.]+)/],
        [this.actionTypes.postBigBlind, /^(.+): Post BB \S([\d,|\d.]+)/],
        // [this.actionTypes.show, /^(\w+): shows (\[\w+\s+\w+\])/],
        // Add more action types and patterns as needed
      ]);

      for (const [actionType, regex] of actionRegexMap.entries()) {
        const match = line.match(regex);
        if (match) {
          if (actionType === this.actionTypes.postAnte && !this.handData.ante) {
            this.handData = {
              ...this.handData,
              ante: parseStringFloat(match[2]),
            };
          } else if (actionType === this.actionTypes.postSmallBlind) {
            this.handData = {
              ...this.handData,
              smallBlindSeat: match[1]
                ? this.findPlayerSeatNumber(match[1] === heroString ? "Hero" : match[1])
                : null,
              smallBlind: parseStringFloat(match[2]),
            };
          } else if (actionType === this.actionTypes.postBigBlind) {
            this.handData = {
              ...this.handData,
              bigBlindSeat: match[1]
                ? this.findPlayerSeatNumber(match[1] === heroString ? "Hero" : match[1])
                : null,
              bigBlind: parseStringFloat(match[2]),
            };
          }
        }
      }
    } else if (line.includes('wins')) {
      const winnerRegex = /^(.+): wins \S?([\d,.]+)$/;
      const match = line.trim().match(winnerRegex);
      if (match) {
        this.handData.summary.collected.push({
          amount: parseStringFloat(match[2]),
          playerName: this.findPlayer(match[1] === heroString ? "Hero" : match[1]),
        });
      }
    } else {
      const summaryActionRegexMap = new Map<string, RegExp>([
        [this.actionTypes.fold, /^([^:]+): Fold/],
        [this.actionTypes.raise, /^([^:]+): Raise \(NF\) \S?([\d,.]+)/],
        [this.actionTypes.check, /^([^:]+): Check/],
        [this.actionTypes.bet, /^([^:]+): Bet \S?([\d,.]+)/],
        [this.actionTypes.call, /^([^:]+): Call \S?([\d,.]+)/],
        [this.actionTypes.allIn, /^([^:]+): Allin \S?([\d,.]+)/],
        [this.actionTypes.show, /^([^:]+): Shows \[(.+)\]/],
        // Add more action types and patterns as needed
      ]);

      for (const [actionType, regex] of summaryActionRegexMap.entries()) {
        const match = line.trim().match(regex);
        if (match) {
          let actionAmount = null;
          let __actionType = actionType;
          if (
            actionType === this.actionTypes.fold ||
            actionType === this.actionTypes.check ||
            actionType === this.actionTypes.show
          ) {
            actionAmount = null;
          } else {
            actionAmount = parseStringFloat(match[2]);
          }

          if (line.includes('all-in')) {
            if (match[0].includes('call')) {
              __actionType = this.actionTypes.allInWithCall;
            } else if (match[0].includes('raise')) {
              __actionType = this.actionTypes.allInWithRaise;
            } else if (match[0].includes('bet')) {
              __actionType = this.actionTypes.allInWithBet;
            }
          }

          if (actionType === this.actionTypes.show) {
            this.handData.summary.shows.push({
              playerName: match[1] === heroString ? "Hero" : match[1],
              cards: this.getCardsDetailIPoker(match[2].split(' ')),
            });
          } else {
            this.handData.actions.push({
              playerName: this.findPlayer(match[1] === heroString ? "Hero" : match[1]),
              action: __actionType,
              actionAmount: actionAmount,
              street: this.currentStreet,
            });
          }
        }
      }
    }
  }

  handleStreet(line: string): void {
    const streetMappings: { [key: string]: string } = {
      '*** HOLE CARDS ***': this.street.preFlop,
      '*** FLOP ***': this.street.flop,
      '*** TURN ***': this.street.turn,
      '*** RIVER ***': this.street.river,
      // '*** SHOWDOWN ***': this.street.showdown,
      // '*** SUMMARY ***': this.street.summary
    };

    const startingString = Object.keys(streetMappings).find((start) =>
      line.startsWith(start),
    );

    if (startingString) {
      this.currentStreet = streetMappings[startingString];
    }

    const streetRegex: RegExp[] = [
      /\*\*\* FLOP \*\*\*\s+\[(.+)\]/,
      /\*\*\* TURN \*\*\*\s+\[(.+)\]/,
      /\*\*\* RIVER \*\*\*\s+\[(.+)\]/,
    ];

    for (const street of streetRegex) {
      const streetMatch = street.exec(line);
      if (streetMatch) {
        this.handData.communityCards.push(
          ...this.getCardsDetailIPoker(streetMatch[1].trim().split(' ')),
        );
      }
    }
  }

  parseHoleCards(line: string) {
    const match = line.match(/Dealt to ([^\[]+) \[([^\]]+)\]/);

    if (match)
      this.handData.holeCards.push({
        playerName: match[1].trim(),
        cards: this.getCardsDetailIPoker(match[2].trim().split(' ')),
      });
  }

  getCardsDetailIPoker(cards: any): any[] {
    let result = [];
    cards.forEach((card: string) => {
      result.push({
        rank: card.slice(1),
        suit: card.charAt(0),
      });
    });
    return result;
  }

  parseTableSeat(line: string, heroString: string) {
    const buttonSeatInfo = line
      .trim()
      .match(/Seat (\d+): (.+) \(\S([\d,.]+)\sin chips\) DEALER/);
    if (buttonSeatInfo) {
      const seatNumber = this.findPlayerSeatNumber(buttonSeatInfo[1] === heroString ? "Hero" : buttonSeatInfo[1]);
      let __seatMax = this.handData.players.length;
      this.handData = {
        ...this.handData,
        buttonSeat: seatNumber,
        maxTableSeats: Number(__seatMax),
      };
    }
  }

  checkSbCaseChip(line: string): number {
    if (line.includes('SB')) {

      const numberPattern = /(\d+(?:,\d+)*(?:\.\d+)?)/;
      const match = line.match(numberPattern);
      const number = match ? match[1].replace(/,/g, '') : 0;
      return Number(number);

    } else return 0
  }

  checkHeroChip(line: string): number {

    const numberPattern = /(\d+(?:,\d+)*(?:\.\d+)?)/;
    const match = line.match(numberPattern);
    const number = match ? match[1].replace(/,/g, '') : 0;

    return Number(number);
  }

  checkReturnedChip(line: string): number {
    const numberPattern = /(\d+(?:,\d+)*(?:\.\d+)?)/;
    const match = line.match(numberPattern);
    const number = match ? match[1].replace(/,/g, '') : 0;
    return Number(number);
  }


  iPokerSectionParser(data: any, heroString: string) {

    let heroChipBeforeHole = 0
    let returnedChip = 0
    let sbCaseChip = 0

    const chunks = data.split('\n');

    this.currentStreet = this.street.preFlop;
    const playerRegex = /Seat (\d+): (.+) \(\S([\d,.]+)\sin chips\)/;
    const holeCardsRegex = /Dealt to (.+) \[(.+)\]/;
    const boardRegex = /Board: \[(.+)\]/;

    const emptyRegex =
      /GAME #[0-9]+ Version:[\d.]+ Uncalled:[YN] Texas Hold'em NL  Tournament/;
    const emptyLine = emptyRegex.exec(chunks[0]);
    const headLine = chunks[0].toLowerCase();

    if (
      !emptyLine ||
      !headLine.includes('tournament') ||
      !headLine.includes('hold') ||
      !headLine.includes('nl')
    ) {
      return null;
    }

    for (let line of chunks) {

      if (line.includes('Post') && line.includes(heroString)) {
        heroChipBeforeHole += this.checkHeroChip(line)
        sbCaseChip = this.checkSbCaseChip(line)
      }

      if (line.includes('wins') && line.includes(heroString)) {
        returnedChip += this.checkReturnedChip(line)
      }

      if (line.includes('GAME')) {
        this.parsePokerHand(line);
      }

      if (line.includes('Table')) {
        this.parseTable(line);
      }

      //  Extract players
      const players = line.match(new RegExp(playerRegex, 'g'));
      if (players) {
        players.forEach((player: any) => {
          const [, seatNumber, playerName, chipCount]: any =
            playerRegex.exec(player);
          if (!line.includes('out of hand')) {
            this.handData.players.push({
              seatNumber: parseStringInt(seatNumber),
              playerName: playerName === heroString ? "Hero" : playerName,
              chipCount: parseStringFloat(chipCount),
            });
          }
        });
      }

      // Extract Hole cards
      const holeCards = holeCardsRegex.exec(line);
      if (holeCards) {
        this.handData.holeCards.push({
          playerName: holeCards[1] === heroString ? "Hero" : holeCards[1],
          cards: this.getCardsDetailIPoker(holeCards[2].split(' ')),
        });
      }

      // Extract Community Cards
      const board = boardRegex.exec(line.trim());
      if (board) {
        let cards = this.getCardsDetailIPoker(board[1].split(' '));
        cards.forEach((card: any) => {
          this.handData.communityCards.push(card);
        });
      }

      this.handleStreet(line);
      this.parseTableSeat(line, heroString);

      const actionNames: string[] = [
        'Fold',
        'Check',
        'Call',
        'Bet',
        'Raise',
        'Allin',
        'Shows',
        'Post Ante',
        'Post SB',
        'Post BB',
        'wins',
      ];

      const actionLineFlag = actionNames.find((action: string) =>
        line.includes(action),
      );
      if (actionLineFlag) {
        this.parseAction(line, actionLineFlag, heroString);
      }
    }

    this.handData.rawData = data
    this.handData.heroChipBeforeHole = heroChipBeforeHole
    this.handData.returnedChip = returnedChip
    this.handData.sbCaseChip = sbCaseChip


    return this.handData;
  }
}

export { IPokerStrategyService };
