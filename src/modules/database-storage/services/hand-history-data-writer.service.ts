import { Injectable } from '@nestjs/common';
import { RoomTypes } from '../../../common/constants/common.constants';
import { HandHistoryDataWriterInterface } from 'src/modules/data-stream-api/interfaces/hand-history-data-writer.interface';
import { HandHistoryRepository } from './hand-history-strategy.service';
import { UserHandFrequencyRepository } from './user-hand-frequency.service';

import { PokerHistoryDto } from '../dtos/history.dto';

@Injectable()
export class HandHistoryDataWriterService implements HandHistoryDataWriterInterface {
  constructor(
    private constants: RoomTypes,
    private readonly handHistoryRepository: HandHistoryRepository,
    private readonly userHandFrequencyRepository: UserHandFrequencyRepository,
  ) { }

  async userHandStore(currentStatus: any) {
    this.userHandFrequencyRepository.userHandStore(currentStatus)
  }

  async saveHistory(data: any[], roomType: string, userId: string): Promise<any> {

    if (roomType === this.constants.poker888) {
      return this.savePokerHandHistory(data, userId);
    } else if (roomType === this.constants.ggPoker) {
      return this.saveGGPokerHistory(data, userId);
    } else if (roomType === this.constants.pokerStars) {
      return this.savePokerStarHistory(data, userId);
    } else if (roomType === this.constants.chico) {
      return this.saveChicoHistory(data, userId);
    } else if (roomType === this.constants.ignitionPoker) {
      return this.saveIgnitionHistory(data, userId);
    } else if (roomType === this.constants.iPoker) {
      return this.saveIPokerHistory(data, userId);
    } else if (roomType === this.constants.partyPoker) {
      return this.savePartyPokerHistory(data, userId);
    } else if (roomType === this.constants.winamaxPoker) {
      return this.saveWinamaxPokerHistory(data, userId);
    } else if (roomType === this.constants.wpn) {
      return this.saveWpnHistory(data, userId);
    }
  }

  async savePokerHandHistory(handHistories: PokerHistoryDto[], userId: string) {
    return await this.handHistoryRepository.createHandHistory(handHistories, userId);
  }

  async saveGGPokerHistory(handHistories: PokerHistoryDto[], userId: string) {
    return await this.handHistoryRepository.createHandHistory(handHistories, userId);
  }

  async savePokerStarHistory(pokerStarHistories: PokerHistoryDto[], userId: string) {
    return await this.handHistoryRepository.createHandHistory(
      pokerStarHistories, userId
    );
  }

  async saveChicoHistory(PokerHistories: PokerHistoryDto[], userId: string) {
    return await this.handHistoryRepository.createHandHistory(PokerHistories, userId);
  }

  async saveIgnitionHistory(PokerHistories: PokerHistoryDto[], userId: string) {
    return await this.handHistoryRepository.createHandHistory(PokerHistories, userId);
  }

  async saveIPokerHistory(PokerHistories: PokerHistoryDto[], userId: string) {
    return await this.handHistoryRepository.createHandHistory(PokerHistories, userId);
  }

  async savePartyPokerHistory(PokerHistories: PokerHistoryDto[], userId: string) {
    return await this.handHistoryRepository.createHandHistory(PokerHistories, userId);
  }

  async saveWinamaxPokerHistory(PokerHistories: PokerHistoryDto[], userId: string) {
    return await this.handHistoryRepository.createHandHistory(PokerHistories, userId);
  }

  async saveWpnHistory(PokerHistories: PokerHistoryDto[], userId: string) {
    return await this.handHistoryRepository.createHandHistory(PokerHistories, userId);
  }

}
