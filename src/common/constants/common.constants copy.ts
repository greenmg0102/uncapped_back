import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomTypes {
  readonly poker888 = '888 Poker';
  readonly chico = 'Bet Online Poker';
  readonly ggPoker = 'GG Poker';
  readonly ignitionPoker = 'Ignition Poker';
  readonly acr = 'ACR';
  readonly partyPoker = 'Party Poker';
  readonly pokerStars = 'Poker Stars';
  readonly iPoker = 'I Poker';
  readonly winamaxPoker = 'Winamax Poker';
  readonly wpn = 'WPN';
  readonly noType = 'Not Recognized';
}


@Injectable()
export class Street {
  readonly preFlop = 'preFlop';
  readonly flop = 'Flop';
  readonly turn = 'Turn';
  readonly river = 'River';
  readonly showdown = 'Showdown';
  readonly summary = 'Summary';
}

@Injectable()
export class ActionType {
  readonly postAnte = 'postAnte';
  readonly postSmallBlind = 'postSmallBlind';
  readonly postBigBlind = 'postBigBlind';
  readonly fold = 'fold';
  readonly raise = 'raise';
  readonly allIn = 'all in';
  readonly allInWithRaise = 'all in, raise';
  readonly allInWithCall = 'all in, call';
  readonly allInWithBet = 'all in, bet';
  readonly check = 'check';
  readonly bet = 'bet';
  readonly show = 'show';
  readonly call = 'call';
}
