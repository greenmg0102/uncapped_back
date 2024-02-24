export interface ParsedHandHistory {
  players: Player[];
  actions: Action[];
  holeCards: HoleCard[];
  communityCards: Card[];
  summary: Summary;
  handId: string;
  tournamentId: number;
  tournamentName?: string;
  pokerRoomId?: string;
  pokerForm?: string;
  pokerType?: string;
  tournamentBuyIn?: number;
  tournamentFee?: number;
  blindLevel?: string;
  gameFormat: string;
  smallBlind: number;
  smallBlindSeat: number;
  bigBlind: number;
  bigBlindSeat: number;
  handDate: string;
  handTime: string;
  handTimezone: string | null;
  regionalHandDate: string | null;
  regionalHandTime: string | null;
  regionalHandTimezone: string | null;
  level: number;
  currency?: string;
  ante: number;
  tournamentSpeed?: string;
  wagerType?: string;
  tournamentTableNumber: number | string;
  maxTableSeats: number;
  buttonSeat: number;
  heroChipBeforeHole: number;
  returnedChip: number;
  sbCaseChip: number;
  rawData: string;
}

export interface Player {
  seatNumber: number;
  playerName: string;
  chipCount: number;
  holeCards?: string;
}

export interface HoleCard {
  playerName: string;
  cards: Card[];
}

export interface Card {
  rank: string;
  suit: string;
}

export interface Shows {
  playerName: string;
  cards: Card[];
}

export interface Action {
  playerName: string;
  action: string;
  actionAmount?: number;
  showCards?: string;
  street?: string;
}

export interface Collected {
  playerName: string;
  amount: number;
}

export interface Summary {
  totalPot: number;
  board?: string;
  rake?: number;
  jackpot?: number;
  bingo?: number;
  shows?: Shows[];
  mucks?: Shows[];
  actions: Action[];
  collected: Collected[];
}
