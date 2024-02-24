import { IsNotEmpty, IsString } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

export class EgihtHandHistoryDto {
  @IsNotEmpty()
  players: {
    seatNumber: number,
    playerName: string,
    chipCount: number
  }[];

  @IsNotEmpty()
  actions: {
    playerName: string,
    action: string,
    actionAmount: number,
    street: string
  }[];

  summary: {
    shows: {
      player: string,
      cards: {
        rank: string,
        suit: string
      }[]
    }[],
    collected: {
      player: string,
      amount: string
    }[],
    winner: {
      playerName: string,
      wonAmount: number
    }[],
    mucks: string[],
    notShow: {
      player: string
    }[]
  };

  handId: number;

  pokerType: string;

  pokerForm: string;

  handDate: string;

  handTime: string;

  handTimezone: string;

  regionalHandDate: string;

  regionalHandTime: string;

  regionalHandTimezone: string;

  currency: string;

  tournamentId: number;

  tournamentName: string;

  tournamentBuyIn: number;

  tournamentFee: number;

  tournamentSpeed: string;

  tournamentTableNumber: number

  maxTableSeats: number;

  buttonSeat: number

  antes: number;

  blindLevel: string;

  smallBlind: number;

  smallBlindSeat: number;

  bigBlind: number;

  bigBlindSeat: number;

  wagerType: string;

  email: string;

  handCards: { rank: string, suit: string }[];

  communityCards: { rank: string, suit: string }[];

}