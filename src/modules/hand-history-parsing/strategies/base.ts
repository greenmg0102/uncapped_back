import { Inject } from '@nestjs/common';
import {
  ActionType,
  RoomTypes,
  Street,
} from '../../../common/constants/common.constants';
import {
  Card,
  ParsedHandHistory,
  Player,
} from '../interfaces/parsed-hand-history.interface';
const {
  safeTrim,
  safeFirstUpper,
} = require('../../../common/utility/stringUtils');

export class BaseParser {
  @Inject(RoomTypes) private readonly constants: RoomTypes;
  @Inject(Street) street: Street;
  @Inject(ActionType) actionTypes: ActionType;

  handData: ParsedHandHistory;

  actionNames: string[] = [
    'folds',
    'checks',
    'calls',
    'bets',
    'raises',
    'all-in',
    'shows',
    'posts',
    'posts small blind',
    'posts big blind',
    'collected',
  ];

  findPlayer(nickname: string): string {
    return this.handData.players.find(
      (player) => player.playerName === nickname,
    )?.playerName;
  }

  findPlayerSeatNumber(nickname: string): number {
    return this.handData.players.find(
      (player) => player.playerName === nickname,
    )?.seatNumber;
  }

  findPlayerCards(nickname: string): any {
    let __playerName = this.handData.players.find(
      (player) => player.playerName === nickname,
    )?.playerName;

    return this.handData.holeCards.find(
      (card) => card.playerName === __playerName,
    ).cards;
  }

  initHandData() {
    this.handData = {
      players: [],
      actions: [],
      holeCards: [],
      communityCards: [],
      summary: {
        shows: [],
        mucks: [],
        collected: [],
      },
      handId: null,
      tournamentId: null,
      gameFormat: null,
      pokerRoomId: null,
      pokerForm: null,
      pokerType: null,
      handDate: null,
      handTime: null,
      handTimezone: null,
      regionalHandDate: null,
      regionalHandTime: null,
      regionalHandTimezone: null,
      blindLevel: null,
      currency: null,
      tournamentBuyIn: null,
      tournamentFee: null,
      wagerType: null,
      tournamentSpeed: null,
      tournamentTableNumber: null,
      maxTableSeats: null,
      buttonSeat: null,
      smallBlind: null,
      smallBlindSeat: null,
      bigBlind: null,
      bigBlindSeat: null,
      ante: null,
    } as ParsedHandHistory;
  }

  showAction(match, type, line, lineno) {
    const action = {
      player: safeTrim(match[1]),
      type: type,
      card1: safeFirstUpper(safeTrim(match[2])),
      card2: safeFirstUpper(safeTrim(match[3])),
      metadata: {
        lineno: lineno,
        raw: line,
      },
      desc: undefined,
    };
    if (match[4] != null) action.desc = match[4];
    return action;
  }

  actionType(s) {
    s = s.replace(/(ed|s)$/, '').toLowerCase();
    // convert 'fold(timeout)' to 'fold' (Ignition)
    if (/^fold/.test(s)) return 'fold';
    // convert  'All-in(raise)' to 'raise' (Ignition)
    if (/all-in\(raise\)/.test(s)) return 'raise';
    if (/all-in\(bet\)/.test(s)) return 'bet';
    if (/all-in/i.test(s)) return 'call';
    return s;
  }

  getCardsDetail(cards: any): Card[] {
    let result = [];
    cards.forEach((card: string) => {
      result.push({
        rank: card.slice(0, -1),
        suit: card.slice(-1),
      });
    });
    return result;
  }
}
