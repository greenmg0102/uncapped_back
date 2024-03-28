import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose'
import { Card } from './card.schema';
import { Collected } from './collected.schema';
import { Shows } from './shows.schema';
import { User } from '../../users/schemas/user.schema'

export type HandHistoryDocument = HydratedDocument<HandHistory>;

@Schema()
export class HandHistory {

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Users' })
  userId: User

  @Prop({
    type: [{ seatNumber: Number, playerName: String, chipCount: Number }],
    _id: false,
  })
  players: {
    seatNumber: number;
    playerName: string;
    chipCount: number;
  }[];

  @Prop({
    type: [
      {
        playerName: String,
        action: String,
        actionAmount: Number,
        street: String,
      },
    ],
    _id: false,
  })
  actions: {
    playerName: string;
    action: string;
    actionAmount: number;
    street: string;
  }[];

  @Prop({
    type: [{ playerName: String, cards: Array<Card> }],
    _id: false,
  })
  holeCards: {
    playerName: string;
    cards: { rank: string; suit: string; }[];
  }[];

  @Prop({ type: [{ rank: String, suit: String }], _id: false })
  communityCards: {
    rank: string;
    suit: string;
  }[];

  @Prop({
    type: {
      shows: Array<Shows>,
      mucks: Array<Shows>,
      collected: Array<Collected>,
    },
    _id: false,
  })
  summary: {
    shows: {
      playerName: string;
      cards: {
        rank: string;
        suit: string;
      }[];
    }[];
    mucks: {
      playerName: string;
      cards: {
        rank: string;
        suit: string;
      }[];
    }[];
    collected: {
      playerName: string;
      amount: number;
    }[];
  };

  @Prop({
    type: {
      heroPosition: Number,
      stackDepth: Number,
      villain: [Number],
      action: [String],
      bettingAction: {
        fold: Number,
        raise: Number,
        check: Number,
        call: Number,
        allin: Number
      },
      _id: false
    },
  })
  reportContent: {
    heroPosition: number;
    stackDepth: number;
    villain: [];
    action: [];
    bettingAction: {
      fold: number;
      raise: number;
      check: number;
      call: number;
      allin: number;
    }
  };

  @Prop({
    type: {
      heroPosition: Number,
      stackDepth: Number,
      action: [{
        category: [String],
        villain: [],
        bettingAction: {
          fold: Number,
          raise: Number,
          check: Number,
          call: Number,
          allin: Number,
        },
        _id: false
      }],
    },
    _id: false
  })
  reportDetail: {
    heroPosition: number;
    stackDepth: number;
    action: {
      category: string[];
      villain: [];
      bettingAction: {
        fold: number;
        raise: number;
        check: number;
        call: number;
        allin: number;
      };
    }[];
  };


  @Prop({ required: false })
  handId: string;

  @Prop({ required: false })
  tournamentId: number;

  @Prop({ required: false })
  gameFormat: string;

  @Prop({ required: false })
  pokerRoomId: string;

  @Prop({ required: false })
  pokerForm: string;

  @Prop({ required: false })
  pokerType: string;

  @Prop({ required: false })
  handDate: string;

  @Prop({ required: false })
  handTime: string;

  @Prop({ required: false })
  handTimezone: string;

  @Prop({ required: false })
  regionalHandDate: string;

  @Prop({ required: false })
  regionalHandTime: string;

  @Prop({ required: false })
  regionalHandTimezone: string;

  @Prop({ required: false })
  blindLevel: string;

  @Prop({ required: false })
  currency: string;

  @Prop({ required: false })
  tournamentBuyIn: number;

  @Prop({ required: false })
  tournamentFee: number;

  @Prop({ required: false })
  wagerType: string;

  @Prop({ required: false })
  tournamentSpeed: string;

  @Prop({ required: false })
  tournamentTableNumber: string;

  @Prop({ required: false })
  maxTableSeats: number;

  @Prop({ required: false })
  buttonSeat: number;

  @Prop({ required: false })
  smallBlind: number;

  @Prop({ required: false })
  smallBlindSeat: number;

  @Prop({ required: false })
  bigBlind: number;

  @Prop({ required: false })
  bigBlindSeat: number;

  @Prop({ required: false })
  ante: number;

  @Prop({ required: false })
  rawData: string;

  @Prop({ required: false })
  heroChipBeforeHole: number;

  @Prop({ required: false })
  returnedChip: number;

  @Prop({ required: false })
  sbCaseChip: number;

  @Prop({ required: false, default: Date.now })
  date: Date;
}



export const HandHistorySchema = SchemaFactory.createForClass(HandHistory);
