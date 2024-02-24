import { ParsedReturnData } from '../interfaces/parser.interface';
import { BaseParser } from './base';
const {
  parseStringInt,
  parseStringFloat,
} = require('../../../common/utility/stringUtils');

class PokerStarsStrategyService extends BaseParser {
  private currentStreet: string;

  constructor() {
    super();
  }

  parse(sections: string[]): ParsedReturnData {
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
      let lineData = this.pokerStarSectionParser(lines);
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
    const handIdRegex = /Hand #(\d+)/;
    const tournamentIdRegex = /Tournament #(\d+)/;
    const dateTimeRegex = /(\d{4}\/\d{2}\/\d{2})\s(\d+:\d+:\d+)\s(\w+)/;
    const levelRegex = /Level (\S+)/;
    const feePattern = /\$(\d+\.\d+)\+\$(\d+\.\d+)(?:\+\$(\d+\.\d+))?/;
    const blindRegex = /Level \w+ \((\d+)\/(\d+)\)/;
    const gamePattern = /(\w+)'em/;
    const regionalRegex = /\[(\d{4}\/\d{2}\/\d{2}) (\d{2}:\d{2}:\d{2}) (\w+)\]/;

    // Extract hand number
    const handId = handIdRegex.exec(line);
    if (handId) {
      this.handData.handId = handId[1];
    }

    // tournament ID
    const tournamentId = tournamentIdRegex.exec(line);
    if (tournamentId) {
      this.handData.tournamentId = parseStringInt(tournamentId[1]);
      this.handData.gameFormat = 'Tournament';
      this.handData.pokerRoomId = 'PokerStars';
    }

    // date regex
    const dateTime = dateTimeRegex.exec(line);
    if (dateTime) {
      this.handData.handDate = dateTime[1];
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
      this.handData.smallBlind = parseInt(blindMatch[1]);
      this.handData.bigBlind = parseInt(blindMatch[2]);
    }

    //  Tournament BuyIn & Fee
    const feeMatch = line.match(feePattern);
    if (feeMatch) {
      this.handData.wagerType = '$';
      this.handData.currency = 'USD';
      if (feeMatch[3]) {
        this.handData.tournamentBuyIn =
          Math.round(
            (parseFloat(feeMatch[1]) + parseFloat(feeMatch[2])) * 100,
          ) / 100;
        this.handData.tournamentFee = parseFloat(feeMatch[3]);
      } else {
        this.handData.tournamentBuyIn = parseFloat(feeMatch[1]);
        this.handData.tournamentFee = parseFloat(feeMatch[2]);
      }
    }

    // Poker Form and Type
    const gameMatch = line.match(gamePattern);
    if (gameMatch) {
      this.handData.pokerForm = gameMatch[0];
      this.handData.pokerType = 'No Limit';
    }
  }

  parseAction(line: string, actionFlag: string) {
    // action array data
    if (actionFlag.includes('posts')) {
      // action array data
      const actionRegexMap = new Map<string, RegExp>([
        [this.actionTypes.postAnte, /^([^:]+): posts the ante \$?([\d,|\d.]+)/],
        [
          this.actionTypes.postSmallBlind,
          /^([^:]+): posts small blind \$?([\d,|\d.]+)/,
        ],
        [
          this.actionTypes.postBigBlind,
          /^([^:]+): posts big blind \$?([\d,|\d.]+)/,
        ],
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
          }
        }
      }
    } else if (line.includes('collected') && line.includes('pot')) {
      const winnerRegex = /^(.+) collected \$?([\d,|\d.]+)(?: from(.+)pot)$/;
      const match = line.trim().match(winnerRegex);
      if (match) {
        this.handData.summary.collected.push({
          amount: parseStringFloat(match[2]),
          playerName: this.findPlayer(match[1]),
        });
      }
    } else {
      const summaryActionRegexMap = new Map<string, RegExp>([
        [this.actionTypes.fold, /^([^:]+): folds/],
        [
          this.actionTypes.raise,
          /^([^:]+): raises \$?(?:[\d,|\d.]+) to \$?([\d,|\d.]+)/,
        ],
        [this.actionTypes.check, /^([^:]+): checks/],
        [this.actionTypes.bet, /^([^:]+): bets \$?([\d,|\d.]+)/],
        [this.actionTypes.call, /^([^:]+): calls \$?([\d,|\d.]+)/],
        [
          this.actionTypes.allIn,
          /([^:]+): \w+ \$?(?:[\d,|\d.]+) to \$?([\d,|\d.]+) and is all-in$/,
        ],
        [this.actionTypes.show, /^([^:]+): shows \[(.+)\]/],
        // Add more action types and patterns as needed
      ]);

      for (const [actionType, regex] of summaryActionRegexMap.entries()) {
        const match = line.match(regex);
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
              playerName: match[1],
              cards: this.getCardsDetail(match[2].split(' ')),
            });
          } else {
            this.handData.actions.push({
              playerName: this.findPlayer(match[1]),
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
  }

  parseTable(line: string): void {
    const match = line.match(
      /Table\s+'(.+)'\s+(\d+)-max\s+Seat\s+#(\d+)\s+is the button/,
    );

    if (match) {
      const [_, tableNumber, seatMax, dealerPosition] = match;

      this.handData = {
        ...this.handData,
        tournamentTableNumber: parseStringInt(tableNumber.split(' ')[1]),
        maxTableSeats: Number(seatMax),
        buttonSeat: Number(dealerPosition),
      };
    }
  }

  parseHoleCards(line: string) {
    const match = line.match(/Dealt to ([^\[]+) \[([^\]]+)\]/);

    if (match)
      this.handData.holeCards.push({
        playerName: match[1].trim(),
        cards: this.getCardsDetail(match[2].trim().split(' ')),
      });
  }

  parseSummary(line: string) {
    if (line.startsWith('Seat ')) {
      const summaryMatch = line.match(
        /^Seat (\d+): (\w+)\s*(\(([^()]*)\))?\s*(\w+)/,
      );

      if (summaryMatch) {
        const [_, seatNum, name, btnInfo, btnContent, action] = summaryMatch;

        if (this.findPlayer(name)) {
          if (btnInfo && !btnInfo.includes('button')) {
            this.handData = {
              ...this.handData,
              smallBlindSeat: btnInfo.includes('small blind')
                ? parseStringInt(seatNum)
                : this.handData?.smallBlindSeat,
              bigBlindSeat: btnInfo.includes('big blind')
                ? parseStringInt(seatNum)
                : this.handData?.bigBlindSeat,
            };
          }
        }
      }
    }
  }

  pokerStarSectionParser(chunks: string[]) {
    this.currentStreet = this.street.preFlop;
    const playerRegex =
      /Seat (\d+): (.+) \(\$?([\d,|\d.]+) in chips(?:, \$?([\d,|\d.]+) bounty)?\)/;
    const holeCardsRegex = /Dealt to (.+) \[(.+)\]/;
    const boardRegex = /Board \[(.+)\]/;

    const emptyRegex = /(\w+) Hand/;
    const emptyLine = emptyRegex.exec(chunks[0]);
    const headLine = chunks[0].toLowerCase();

    if (
      !emptyLine ||
      !headLine.includes('tournament') ||
      !headLine.includes('hold') ||
      !headLine.includes('no limit') ||
      emptyLine[1] !== 'PokerStars'
    ) {
      return null;
    }

    for (let line of chunks) {
      if (line.includes('Hand')) {
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
              playerName,
              chipCount: parseStringFloat(chipCount),
            });
          }
        });
      }

      // Extract Hole cards
      const holeCards = holeCardsRegex.exec(line);
      if (holeCards) {
        this.handData.holeCards.push({
          playerName: holeCards[1],
          cards: this.getCardsDetail(holeCards[2].split(' ')),
        });
      }

      // Extract Community Cards
      const board = boardRegex.exec(line);
      if (board) {
        let cards = this.getCardsDetail(board[1].split(' '));
        cards.forEach((card: any) => {
          this.handData.communityCards.push(card);
        });
      }

      this.handleStreet(line);
      this.parseSummary(line);

      const actionLineFlag = this.actionNames.find((action: string) =>
        line.includes(action),
      );
      if (actionLineFlag) {
        this.parseAction(line, actionLineFlag);
      }
    }

    return this.handData;
  }
}

export { PokerStarsStrategyService };
