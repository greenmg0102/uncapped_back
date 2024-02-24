import { BaseParser } from './base';
import {
  ParsedHandHistory,
  Player,
} from '../interfaces/parsed-hand-history.interface';
const {
  parseStringInt,
  parseStringFloat,
} = require('../../../common/utility/stringUtils');

class GgPokerService extends BaseParser {
  private currentStreet: string;

  constructor() {
    super();
  }

  parsePlayer(line: string): Player {
    const match = line.match(
      /Seat (\d+): ([^\(]+) \(\$?([\d,|\d.]+) in chips\)/,
    );
    return match
      ? {
          seatNumber: +match[1],
          playerName: match[2].trim(),
          chipCount: +match[3].replace(/,/g, ''),
        }
      : null;
  }

  parseHoleCards(line: string) {
    const match = line.match(/Dealt to ([^\[]+) \[([^\]]+)\]/);

    if (match)
      this.handData.holeCards.push({
        playerName: match[1].trim(),
        cards: this.getCardsDetail(match[2].trim().split(' ')),
      });
  }

  parseAction(line: string, actionFlag: string) {
    // action array data
    if (actionFlag.includes('posts')) {
      const actionRegexMap = new Map<string, RegExp>([
        [this.actionTypes.postAnte, /^(.+): posts the ante \$?([\d,|\d.]+)/],
        [
          this.actionTypes.postSmallBlind,
          /^(.+): posts small blind \$?([\d,|\d.]+)/,
        ],
        [
          this.actionTypes.postBigBlind,
          /^(.+): posts big blind \$?([\d,|\d.]+)/,
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
    } else if (line.includes('collected')) {
      const winnerRegex = /^(.+) collected \$?([\d,|\d.]+)(?: from pot)/;
      const match = line.trim().match(winnerRegex);
      if (match)
        this.handData.summary.collected.push({
          amount: parseStringFloat(match[2]),
          playerName: this.findPlayer(match[1]),
        });
    } else {
      const summaryActionRegexMap = new Map<string, RegExp>([
        [this.actionTypes.fold, /^(\w+): folds/],
        [
          this.actionTypes.raise,
          /^([^:]+): raises \$?(?:[\d,|\d.]+) to \$?([\d,|\d.]+)/,
        ],
        [
          this.actionTypes.allIn,
          /([^:]+): \w+ \$?(?:[\d,|\d.]+) to \$?([\d,|\d.]+) and is all-in$/,
        ],
        [this.actionTypes.check, /^([^:]+): checks/],
        [this.actionTypes.bet, /^([^:]+): bets \$?([\d,|\d.]+)/],
        [this.actionTypes.call, /^([^:]+): calls \$?([\d,|\d.]+)/],
        [this.actionTypes.show, /^([^:]+): shows \[(\w+\s+\w+)\]/],
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
              actionAmount: actionAmount, /////
              street: this.currentStreet,
              // showCards: match[2] && match[2].includes('[') ? match[2] : null
            });
          }
        }
      }
    }
  }

  parseSummary(line: string) {
    const totalPlotMatch = line.match(/Total pot ([\d,]+)/);
    const boardMatch = line.match(/Board \[([\w\s]+)\]/);

    if (line.startsWith('Seat ')) {
      const [_, seatNum, name, btnInfo, btnContent, action] = line.match(
        /^Seat (\d+): (\w+)\s*(\(([^()]*)\))?\s*(\w+)/,
      );

      if (btnInfo && !btnInfo.includes('button')) {
        this.handData = {
          ...this.handData,
          smallBlindSeat: btnInfo.includes('small blind')
            ? parseStringInt(seatNum)
            : this.handData.smallBlindSeat,
          bigBlindSeat: btnInfo.includes('big blind')
            ? parseStringInt(seatNum)
            : this.handData.bigBlindSeat,
        };
      }
    }
  }

  parsePokerHand(line: string): void {
    const feePattern =
      /Tournament #(?:\d+), (?:32-KO: |Daily Big |T\$ Builder )?\$([\d,|\d.]+)\s(?:[\+\s]\$)?([\d,|\d.]+)?/;
    const gamePattern = /(\w+)'em/;
    const handIdRegex = /Hand #(\w+\d+):\s/;
    const tournamentIdRegex = /Tournament #(\d+)/;
    const dateTimeRegex = /(\d{4}\/\d{2}\/\d{2})\s(\d{2}:\d{2}:\d{2})\s(\w+)/;
    const buttonSeatRegex = /Seat #(\d+)/;
    const levelRegex = /Level(\d+)/;
    const blindRegex = /\(\$?([\d,|\d.]+)\/\$?([\d,|\d.]+)\)/;
    const tableNumberRegex = /Table '(?:.+)?(?:[^\d]+)(\d+)'/;
    const maxTableSeatRegex = /(\d+)-max/;
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
      this.handData.pokerRoomId = 'GGPoker';
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
      this.handData.smallBlind = parseStringFloat(blindMatch[1]);
      this.handData.bigBlind = parseStringFloat(blindMatch[2]);
    }

    //  Tournament BuyIn & Fee
    const feeMatch = line.match(feePattern);
    if (feeMatch) {
      if (feeMatch[1])
        this.handData.tournamentBuyIn = parseStringFloat(feeMatch[1]);
      if (feeMatch[2])
        this.handData.tournamentFee = parseStringFloat(feeMatch[2]);
    }

    //  WagerType & Currency
    if (line.includes('$')) {
      this.handData.wagerType = '$';
      this.handData.currency = null;
    }

    // Poker Form and Type
    const gameMatch = line.match(gamePattern);
    if (gameMatch) {
      this.handData.pokerForm = gameMatch[0];
      this.handData.pokerType = 'No Limit';
    }

    const tableInfo = tableNumberRegex.exec(line);
    if (tableInfo) {
      let tableNumber = tableInfo[1];
      this.handData.tournamentTableNumber = parseInt(tableNumber);
    }

    const maxTableSeatsInfo = maxTableSeatRegex.exec(line);
    if (maxTableSeatsInfo) {
      this.handData.maxTableSeats = parseInt(maxTableSeatsInfo[1]);
    }

    // Extract button seat
    const buttonSeat = buttonSeatRegex.exec(line);
    if (buttonSeat) {
      this.handData.buttonSeat = parseInt(buttonSeat[1]);
    }
  }

  parseTable(line: string): void {
    const match = line.match(
      /Table\s+'(\d+)'\s+(\d+)-max\s+Seat\s+#(\d+)\s+is the button/,
    );

    if (match) {
      const [_, tableNumber, seatMax, dealerPosition] = match;

      this.handData = {
        ...this.handData,
        tournamentTableNumber: Number(tableNumber),
        maxTableSeats: Number(seatMax),
        buttonSeat: Number(dealerPosition),
      };
    }
  }

  parseCommunityCards(line: string) {
    const boardRegex = /Board \[(.+)\]/;

    // Extract Community Cards
    const board = boardRegex.exec(line);
    if (board) {
      let cards = this.getCardsDetail(board[1].split(' '));
      cards.forEach((card: any) => {
        this.handData.communityCards.push(card);
      });
    }
  }

  parsePlayerSeat(line: string): void {
    const player = this.parsePlayer(line);
    if (player) this.handData.players.push(player);
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

  parse(sections: string[]): string[] {
    const data = [];

    // parse for each section
    for (const section of sections) {
      this.initHandData();
      let sectionData: ParsedHandHistory = this.ggPokerSectionParser(section);
      if (sectionData) {
        data.push(sectionData);
      }
    }
    return data;
  }

  ggPokerSectionParser(data: string): ParsedHandHistory {
    this.currentStreet = this.street.preFlop;

    const lines = data.split('\n');

    const emptyRegex = /Poker Hand #TM(?:\d+)/;
    const emptyLine = emptyRegex.exec(lines[0]);
    const headLine = lines[0].toLowerCase();

    if (
      !emptyLine ||
      !headLine.includes('tournament') ||
      !headLine.includes('hold') ||
      !headLine.includes('no limit')
    ) {
      return null;
    }

    for (const line of lines) {
      if (line.includes('Hand')) {
        this.parsePokerHand(line);
      }
      if (line.includes('Table')) {
        this.parseTable(line);
      }
      this.parsePlayerSeat(line);
      this.parseCommunityCards(line);
      // this is to run action parse by checking action keywords.
      const actionLineFlag = this.actionNames.find((action: string) =>
        line.includes(action),
      );
      if (actionLineFlag) {
        this.parseAction(line, actionLineFlag);
      }
      this.parseHoleCards(line);
      this.handleStreet(line);
      this.parseSummary(line);
    }
    return this.handData;
  }
}

export { GgPokerService };
