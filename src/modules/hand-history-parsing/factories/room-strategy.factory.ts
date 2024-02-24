import { Injectable } from '@nestjs/common';
import { EightStarStrategyService } from '../../hand-history-parsing/strategies/eight-star-strategy.service';
import { GgPokerStrategyService } from '../strategies/gg-poker-strategy.service';
import { PokerStarsStrategyService } from '../../hand-history-parsing/strategies/poker-stars-strategy.service';
import { IgnitionPokerStrategyService } from '../strategies/ignition-poker-strategy.service';
import { RoomTypes } from '../../../common/constants/common.constants';
import { ChicoPokerStrategyService } from '../strategies/chico-poker-strategy.service';
import { PartyPokerStrategyService } from '../strategies/party-poker-strategy.services';
import { WinamaxPokerStrategyService } from '../strategies/winamax-poker-strategy.service';
import { WpnPokerStrategyService } from '../strategies/wpn-poker-strategy.service';
import { IPokerStrategyService } from '../strategies/ipoker-strategy.service';

@Injectable()
export class RoomStrategyFactory {
  constructor(
    private constants: RoomTypes,
    private readonly eightStarStrategyService: EightStarStrategyService,
    private readonly ggPokerStrategyService: GgPokerStrategyService,
    private readonly pokerStarStrategyService: PokerStarsStrategyService,
    private readonly ignitionPokerStrategyService: IgnitionPokerStrategyService,
    private readonly chicoPokerStrategyService: ChicoPokerStrategyService,
    private readonly partyPokerStrategyService: PartyPokerStrategyService,
    private readonly winamaxPokerStrategyService: WinamaxPokerStrategyService,
    private readonly wpnPokerStrategyService: WpnPokerStrategyService,
    private readonly iPokerStrategyService: IPokerStrategyService,
  ) {}

  createStrategy(roomType: string) {
    switch (roomType) {
      case this.constants.poker888:
        return this.eightStarStrategyService;
      case this.constants.pokerStars:
        return this.pokerStarStrategyService;
      case this.constants.ggPoker:
        return this.ggPokerStrategyService;
      case this.constants.ignitionPoker:
        return this.ignitionPokerStrategyService;
      case this.constants.chico:
        return this.chicoPokerStrategyService;
      case this.constants.partyPoker:
        return this.partyPokerStrategyService;
      case this.constants.winamaxPoker:
        return this.winamaxPokerStrategyService;
      case this.constants.wpn:
        return this.wpnPokerStrategyService;
      case this.constants.iPoker:
        return this.iPokerStrategyService;
      default:
        return null;
    }
  }
}
