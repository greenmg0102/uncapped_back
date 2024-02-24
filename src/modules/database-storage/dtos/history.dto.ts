export class PokerHistoryDto {
  players: Player[];
  actions: Action[];
  holeCards: HoleCards[];
  communityCards: { rank: string; suit: string }[];
  summary: SummaryAction[];
  handId: string;
  tournamentId: number;
  tournamentBuyIn: number;
  tournamentFee: number;
  // tournamentName: string;
  tournamentTableNumber: number;
  maxTableSeats: number;
  buttonSeat: number;
  blindLevel: string;
  smallBlindSeat: number;
  bigBlindSeat: number;
  // email: string;
  currency: string;
  // level: number;
  smallBlind: number;
  bigBlind: number;
  handDate: string;
  handTime: string;
  handTimezone: string;
  regionalHandDate: string;
  regionalHandTime: string;
  regionalHandTimezone: string;
  gameFormat: string;
  pokerForm: string;
  pokerType: string;
  pokerRoomId: string | null;
  tournamentSpeed: string;
  wagerType: string;
  ante: number;
}

export class Player {
  seatNumber: number;
  playerName: string;
  chipCount: number;
}

export class Action {
  playerName: string;
  action: string;
  actionAmount: number;
  street: string;
}

export class HoleCards {
  playerName: string;
  cards: string[];
}

export class SummaryAction {
  shows: { playerName: string; cards: { rank: string; suit: string }[] }[];
  mucks: { playerName: string; cards: { rank: string; suit: string }[] }[];
  collected: { playerName: string; amount: string }[];
}
