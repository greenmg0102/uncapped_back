import { Inject } from '@nestjs/common';
import { RoomTypes } from '../../../common/constants/common.constants';
import { BaseParser } from './base';
import { ParsedReturnData } from '../interfaces/parser.interface';
const { parseStringInt } = require('../../../common/utility/stringUtils');

export class EightStarStrategyService extends BaseParser {
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

    // check for each hands
    for (const section of sections) {
      this.initHandData();
      const lines = section.split('\n');
      let lineData = this.eightPokerSectionParser(lines);
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

  eightPokerSectionParser(chunks: string[]) {
    let street = null;
    let players = [];

    const emptyRegex = /(\w+)/;
    const parseRegex = /^(\*{5} 888poker)(?=.+)/;
    const emptyLine = emptyRegex.exec(chunks[0]);
    const parseMatch = chunks[1] ? parseRegex.exec(chunks[1]) : null;
    if (!emptyLine || !parseMatch) {
      return null;
    }

    for (let line of chunks) {
      // Identify game Basic Info
      const gameBasicregex = /Blinds\s(No Limit|Limit)\s(.*?)\s-\s/;
      const gameBasicmatch = line.match(gameBasicregex);
      if (gameBasicmatch) {
        this.handData.pokerType = gameBasicmatch[1];
        this.handData.pokerForm = gameBasicmatch[2];
      }

      // Identify game Id
      const handIDRegex = /Game (\d+)/;
      const handIDMatch = line.match(handIDRegex);
      if (handIDMatch) {
        this.handData.handId = handIDMatch[1];
      }

      // Tournament ID and Buy-in
      const tournamentRegex = /Tournament #(\d+)/;
      const tournamentMatch = line.match(tournamentRegex);
      if (tournamentMatch) {
        this.handData.tournamentId = parseInt(tournamentMatch[1]);
        this.handData.pokerRoomId = '888Poker';
        this.handData.gameFormat = 'Tournament';
        // this.handData.tournamentFormat = true;
      }

      const tournamentBuyRegex = /Tournament #(\d+) \$([\d.]+) \+ \$([\d.]+)/;
      const tournamentBuyMatch = line.match(tournamentBuyRegex);
      if (tournamentBuyMatch) {
        this.handData.tournamentBuyIn = isNaN(parseFloat(tournamentBuyMatch[2]))
          ? 0
          : parseFloat(tournamentBuyMatch[2]);
        this.handData.tournamentFee = isNaN(parseFloat(tournamentBuyMatch[3]))
          ? 0
          : parseFloat(tournamentBuyMatch[3]);
      }

      const wagerTypeRegex = /Table.*?(\(.*?\))/;
      const wagerTypeMatch = line.match(wagerTypeRegex);
      if (wagerTypeMatch) {
        this.handData.wagerType = wagerTypeMatch[1];
      }

      // Hand Date and Time
      const dateTimeRegex = /\*\*\* (\d{2} \d{2} \d{4}) (\d{2}:\d{2}:\d{2})/;
      const dateTimematch = line.match(dateTimeRegex);
      if (dateTimematch) {
        this.handData.handDate = dateTimematch[1].replace(
          /(\d{2}) (\d{2}) (\d{4})/,
          '$3/$2/$1',
        );
        this.handData.handTime = dateTimematch[2];
      }
      // Table Number, Max Players, and Real Money
      const tableRegex = /Table #(\d+) (\d+) Max \((\w+)/;
      const tableMatch = line.match(tableRegex);
      if (tableMatch) {
        this.handData.tournamentTableNumber = parseInt(tableMatch[1]);
        this.handData.maxTableSeats = parseInt(tableMatch[2]);
      }

      const otherTableRegex = /Table\s\w+\s(\d+)\sMax/;
      const otherTableMatch = line.match(otherTableRegex);

      if (otherTableMatch) {
        this.handData.maxTableSeats = parseInt(otherTableMatch[1]);
      }

      const seatRegex = /(\d+) is the button/;
      const currentSeatNumber = line.match(seatRegex) ?? null;
      const currentSeat = currentSeatNumber
        ? parseInt(currentSeatNumber[1])
        : null;
      if (currentSeat) {
        this.handData.buttonSeat = currentSeat;
      }

      const playerInfoRegex = /Seat (\d+): (.+?) \(\s*([\d,]+)\s*\)/;
      const match = line.match(playerInfoRegex);
      if (match) {
        const seatNumber = match[1];
        const playerName = match[2];
        const chipCount = match[3].replace(/,/g, '');

        const player = {
          seatNumber: parseInt(seatNumber),
          playerName: playerName,
          chipCount: parseInt(chipCount),
        };
        this.handData.players.push(player);
        players.push({ ...player });
      }

      // Antes, Small Blind, and Big Blind
      const anteRegex = /(.+?) posts ante \[([\d,]+)\]/;
      const smallBlindRegex = /(.+?) posts small blind \[([\d,]+)\]/;
      const bigBlindRegex = /(.+?) posts big blind \[([\d,]+)\]/;
      const anteMatch = line.match(anteRegex);
      const smallBlindMatch = line.match(smallBlindRegex);
      const bigBlindMatch = line.match(bigBlindRegex);
      if (anteMatch) {
        this.handData.ante = parseInt(anteMatch[2]);
        players.map((item) => {
          if (item.playerName == anteMatch[1] && anteMatch[2]) {
            item.chipCount =
              item.chipCount - parseInt(anteMatch[2].replace(/,/g, ''));
          }
          return item;
        });
      }
      if (smallBlindMatch) {
        const playerSeat = this.handData.players.find(
          (item) => item.playerName == smallBlindMatch[1],
        );
        players.map((item) => {
          if (item.playerName == smallBlindMatch[1] && smallBlindMatch[2]) {
            item.chipCount =
              item.chipCount - parseInt(smallBlindMatch[2].replace(/,/g, ''));
          }
          return item;
        });
        this.handData.smallBlindSeat = playerSeat.seatNumber;
        this.handData.smallBlind = parseInt(
          smallBlindMatch[2].replace(/,/g, ''),
        );
      }
      if (bigBlindMatch) {
        const playerSeat = this.handData.players.find(
          (item) => item.playerName == bigBlindMatch[1],
        );
        players.map((item) => {
          if (item.playerName == bigBlindMatch[1] && bigBlindMatch[2]) {
            item.chipCount =
              item.chipCount - parseInt(bigBlindMatch[2].replace(/,/g, ''));
          }
          return item;
        });
        this.handData.bigBlindSeat = playerSeat.seatNumber;
        this.handData.bigBlind = parseInt(bigBlindMatch[2].replace(/,/g, ''));
      }

      const cardsRegex =
        /Dealt to (.+?) \[\s*([2-9TJQKA][csdhepto]),\s*([2-9TJQKA][csdhepto])\s*\]/;
      const handMatch = line.match(cardsRegex);
      if (handMatch) {
        const card1: any = handMatch[2].match(/([2-9TJQKA])([csdhepto])/);
        const card2: any = handMatch[3].match(/([2-9TJQKA])([csdhepto])/);

        this.handData.holeCards.push({
          playerName: handMatch[1],
          cards: [
            { rank: card1[1], suit: card1[2] },
            { rank: card2[1], suit: card2[2] },
          ],
        });
      }

      // Community cards
      const communityCardsRegex =
        /\*\* Dealing (flop|turn|river) \*\* \[ ([2-9TJQKAecsdhpto]+)(?:, ([2-9TJQKAecsdhpto]+))?(?:, ([2-9TJQKAecsdhpto]+))?(?: \])?/;
      const matchcard = line.match(communityCardsRegex);
      if (matchcard) {
        for (var i = 2; i < matchcard.length; i++) {
          if (matchcard[i]) {
            const card: any = matchcard[i].match(/([2-9TJQKA])([csdhepto])/);
            if (card) {
              this.handData.communityCards.push({
                rank: card[1],
                suit: card[2],
              });
            }
          }
        }
      }

      const streetRegex = /(?<=Dealing )(down|flop|turn|river)/g;
      const streetStatus = line.match(streetRegex);
      if (streetStatus) {
        const phrase = streetStatus[0];
        const capitalizedPhrase =
          phrase.charAt(0).toUpperCase() + phrase.slice(1);
        street = capitalizedPhrase == 'Down' ? 'preFlop' : capitalizedPhrase;
      }

      // Actions
      const actionRegex =
        /(.+?) (calls|checks|folds|raises|bets)(?: \[([\d,]+)\])?/g;
      let actionMatch;
      while ((actionMatch = actionRegex.exec(line)) !== null) {
        let checkValue = false;
        players.map((item) => {
          if (item.playerName == actionMatch[1] && actionMatch[3]) {
            item.chipCount =
              item.chipCount - parseInt(actionMatch[3].replace(/,/g, ''));
            if (item.chipCount == 0) {
              checkValue = true;
            }
          }
          return item;
        });
        this.handData.actions.push({
          playerName: actionMatch[1],
          action: checkValue ? `${actionMatch[2]} all-in` : actionMatch[2],
          actionAmount: actionMatch[3]
            ? parseInt(actionMatch[3].replace(/,/g, ''))
            : null,
          street: street,
        });
      }

      // check for shows in summary
      const showRegex =
        /(.+) shows \[ ([2-9TJQKA][cdhsepto]), ([2-9TJQKA][cdhsepto]) \]/;
      const matchShow = line.match(showRegex);
      if (matchShow) {
        const player = matchShow[1];
        const rank1 = matchShow[2][0];
        const suit1 = matchShow[2][1];
        const rank2 = matchShow[3][0];
        const suit2 = matchShow[3][1];

        this.handData.summary.shows.push({
          playerName: player,
          cards: [
            { rank: rank1, suit: suit1 },
            { rank: rank2, suit: suit2 },
          ],
        });
      }

      // check for mucks in summary
      const muckRegex =
        /(.+) mucks \[ ([2-9TJQKA][cdhsepto]), ([2-9TJQKA][cdhsepto]) \]/;
      const matchMuck = line.match(muckRegex);
      if (matchMuck) {
        const player = matchMuck[1];
        const rank1 = matchMuck[2][0];
        const suit1 = matchMuck[2][1];
        const rank2 = matchMuck[3][0];
        const suit2 = matchMuck[3][1];

        this.handData.summary.mucks.push({
          playerName: player,
          cards: [
            { rank: rank1, suit: suit1 },
            { rank: rank2, suit: suit2 },
          ],
        });
      }

      // collected
      const collectRegex = /(\w+)\scollected\s\[\s([\d,]+)\s\]/;
      const matchCollect = line.match(collectRegex);

      if (matchCollect) {
        const player = matchCollect[1];
        const amount = matchCollect[2].replace(/,/g, '');
        this.handData.summary.collected.push({
          playerName: player,
          amount: parseStringInt(amount),
        });
      }
    }

    return this.handData;
  }
}
