import { ParsedReturnData } from '../interfaces/parser.interface';
import { BaseParser } from './base';
const {
  parseStringInt,
  parseStringFloat,
} = require('../../../common/utility/stringUtils');

class PartyPokerStrategyService extends BaseParser {
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
      let lineData = this.sectionParser(lines);
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

  parseHandId(line: string) {
    const handIdRegex =
      /^\*\*\*\*\* Hand History For Game ([A-Za-z0-9]+) \*\*\*\*\*/;
    // Extract hand number
    const handId = handIdRegex.exec(line);
    if (handId) {
      this.handData.handId = handId[1];
    }
  }

  parsePokerHand(line: string) {
    const tournamentIdRegex = /\(MTT Tournament #(\d+)\)/;
    const dateTimeRegex = /-\s(\w+)\s(\w+)\s(\d+)\s(\d+:\d+:\d+)\s(\w+)\s(\d+)/;
    const levelRegex = /Level (\S+)/;
    const feePattern = /\(Buyin \$([\d,|\d.]+) \+ \$([\d,|\d.]+)\)/;
    const blindRegex = /^(\d+)\/(\d+)/;
    const gamePattern = /Holdem/;
    const regionalRegex = /\[(\d{4}\/\d{2}\/\d{2}) (\d{2}:\d{2}:\d{2}) (\w+)\]/;

    // tournament ID
    const tournamentId = tournamentIdRegex.exec(line);
    if (tournamentId) {
      this.handData.tournamentId = parseStringInt(tournamentId[1]);
      this.handData.gameFormat = 'Tournament';
      this.handData.pokerRoomId = 'PartyPoker';
    }

    // date regex
    const dateTime = dateTimeRegex.exec(line);
    if (dateTime) {
      this.handData.handDate =
        dateTime[2] + ' ' + dateTime[3] + ' ' + dateTime[6];
      this.handData.handTime = dateTime[4];
      this.handData.handTimezone = dateTime[5];
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
      this.handData.currency = null;
      this.handData.tournamentBuyIn = parseFloat(feeMatch[1]);
      this.handData.tournamentFee = parseFloat(feeMatch[2]);
    }

    // Poker Form and Type
    const gameMatch = line.match(gamePattern);
    if (gameMatch) {
      this.handData.pokerForm = 'Holdem';
      this.handData.pokerType = 'NL';
    }
  }

  parseAction(line: string, actionFlag: string, beforeLine: string) {
    // action array data
    if (actionFlag.includes('posts')) {
      // action array data
      const actionRegexMap = new Map<string, RegExp>([
        [this.actionTypes.postAnte, /^(.+) posts ante \(\$?([\d,|\d.]+)\)/],
        [
          this.actionTypes.postSmallBlind,
          /^(.+) posts small blind \(\$?([\d,|\d.]+)\)/,
        ],
        [
          this.actionTypes.postBigBlind,
          /^(.+) posts big blind \(\$?([\d,|\d.]+)\)/,
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
          } else if (actionType === this.actionTypes.postSmallBlind) {
            this.handData = {
              ...this.handData,
              smallBlindSeat: match[1]
                ? this.findPlayerSeatNumber(match[1])
                : null,
            };
          } else if (actionType === this.actionTypes.postBigBlind) {
            this.handData = {
              ...this.handData,
              bigBlindSeat: match[1]
                ? this.findPlayerSeatNumber(match[1])
                : null,
            };
          }
        }
      }
    } else if (line.includes('collected')) {
      const winnerRegex = /^(.+) balance (?:.+) collected \$?([\d,|\d.]+)/;
      const match = line.trim().match(winnerRegex);
      if (match) {
        this.handData.summary.collected.push({
          amount: parseStringFloat(match[2]),
          playerName: this.findPlayer(match[1]),
        });
      }
    } else {
      const summaryActionRegexMap = new Map<string, RegExp>([
        [this.actionTypes.fold, /^(.+) folds/],
        [
          this.actionTypes.raise,
          /^(.+) raises \$?(?:[\d,|\d.]+) to \$?([\d,|\d.]+)/,
        ],
        [this.actionTypes.check, /^(.+) checks/],
        [this.actionTypes.bet, /^(.+) bets \(\$?([\d,|\d.]+)\)/],
        [this.actionTypes.call, /^(.+) calls \(\$?([\d,|\d.]+)\)/],
        [this.actionTypes.allIn, /^(.+) is all-In/],
        [this.actionTypes.show, /^(.+) shows \[(.+)\]/],
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
            actionType === this.actionTypes.show ||
            actionType === this.actionTypes.allIn
          ) {
            actionAmount = null;
          } else {
            actionAmount = parseStringFloat(match[2]);
          }

          if (line.includes('all-In')) {
            if (beforeLine.includes('call')) {
              __actionType = this.actionTypes.allInWithCall;
            } else if (beforeLine.includes('raise')) {
              __actionType = this.actionTypes.allInWithRaise;
            } else if (beforeLine.includes('bet')) {
              __actionType = this.actionTypes.allInWithBet;
            }
            this.handData.actions[this.handData.actions.length - 1] = {
              ...this.handData.actions[this.handData.actions.length - 1],
              action: __actionType,
            };
          } else {
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
  }

  handleStreet(line: string): void {
    const streetMappings: { [key: string]: string } = {
      '** Dealing down cards **': this.street.preFlop,
      '** Dealing Flop **': this.street.flop,
      '** Dealing Turn **': this.street.turn,
      '** Dealing River **': this.street.river,
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

  parseTableSeat(line: string) {
    const tableSeatRegex = /^Total number of players : (\d+)\/(\d+)/;

    const tableSeatMatch = tableSeatRegex.exec(line);
    if (tableSeatMatch) {
      const [_, currentTableSeat, maxTableSeat] = tableSeatMatch;
      this.handData = {
        ...this.handData,
        maxTableSeats: parseStringInt(maxTableSeat),
      };
    }
  }

  parseTable(line: string): void {
    const tableNumberRegex =
      /Table\s+\(\d+\)\s+Table\s+#(\d+)\s+\((.+)\)\s+--\s+Seat\s+(\d+)\s+is the button/;

    const tableNumberMatch = tableNumberRegex.exec(line);
    if (tableNumberMatch) {
      const [_, tableNumber, currency, dealerPosition] = tableNumberMatch;
      this.handData = {
        ...this.handData,
        tournamentTableNumber: parseStringInt(tableNumber),
        currency: currency,
        buttonSeat: Number(dealerPosition),
      };
    }
  }

  parseHoleCards(line: string) {
    const holeCardsRegex = /Dealt to (.+) \[(.+)\]/;

    // Extract Hole cards
    const holeCards = holeCardsRegex.exec(line);
    if (holeCards) {
      this.handData.holeCards.push({
        playerName: holeCards[1],
        cards: this.getCardsDetail(holeCards[2].replace(/\s/g, '').split(',')),
      });
    }
  }

  parseSummary(line: string) {
    if (line.startsWith('Seat ')) {
      const [_, seatNum, name, btnInfo, btnContent, action] = line.match(
        /^(.+) (\w+)\s*(\(([^()]*)\))?\s*(\w+)/,
      );

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

  sectionParser(chunks: string[]) {
    this.currentStreet = this.street.preFlop;
    const playerRegex = /Seat (\d+): (.+) \(\$?([\d,|\d.]+)\)/;
    const boardRegex = /Board: \[(.+)\]/;

    const emptyRegex =
      /^\*\*\*\*\* Hand History For Game [A-Za-z0-9]+ \*\*\*\*\*/;
    const emptyLine = emptyRegex.exec(chunks[0]);
    const headLine = chunks[1] ? chunks[1].toLowerCase() : '';

    if (
      !emptyLine ||
      !headLine.includes('tournament') ||
      !headLine.includes('hold') ||
      !headLine.includes('(nl)')
    ) {
      return null;
    }

    let __beforeLine = '';
    for (let line of chunks) {
      if (line.includes('History For Game')) {
        this.parseHandId(line);
      }
      if (line.includes('Tournament')) {
        this.parsePokerHand(line);
      }

      if (line.includes('Table')) {
        this.parseTable(line);
      }
      this.parseTableSeat(line);

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

      this.parseHoleCards(line);

      // Extract Community Cards
      const board = boardRegex.exec(line);
      if (board) {
        let cards = this.getCardsDetail(board[1].replace(/\s/g, '').split(','));
        cards.forEach((card: any) => {
          this.handData.communityCards.push(card);
        });
      }

      this.handleStreet(line);
      this.parseSummary(line);

      const actionNames: string[] = [
        'folds',
        'checks',
        'calls',
        'bets',
        'raises',
        'all-In',
        'shows',
        'posts ante',
        'posts small blind',
        'posts big blind',
        'collected',
      ];

      const actionLineFlag = actionNames.find((action: string) =>
        line.includes(action),
      );
      if (actionLineFlag) {
        this.parseAction(line, actionLineFlag, __beforeLine);
      }
      __beforeLine = line;
    }

    return this.handData;
  }
}

export { PartyPokerStrategyService };
