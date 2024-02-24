import { Injectable } from '@nestjs/common';
import { RoomTypes } from '../../../common/constants/common.constants';
import { PokerSite } from '../interfaces/poker-room.interface';

@Injectable()
export class DetectorService {
  constructor(private readonly constants: RoomTypes) { }

  pokerSites: PokerSite[] = [
    { name: this.constants.poker888, regex: /^(\*{5} 888poker)(?=.+)/ },
    { name: this.constants.chico, regex: /BetOnline Hand #(\d+)/ },
    {
      name: this.constants.ggPoker,
      regex: /Poker Hand #TM\d+: Tournament #\d+/,
    },
    { name: this.constants.ignitionPoker, regex: /Ignition Hand #\d+:/ },
    {
      name: this.constants.wpn,
      regex:
        /^Game Hand #[0-9]+ - Tournament #[0-9]+ - Holdem\(No Limit\) - Level [0-9]+ \([\d.]+\/[\d.]+\)- [\d/]+ [\d:]+ [A-Za-z]+/,
    },
    {
      name: this.constants.partyPoker,
      regex: /^\*\*\*\*\* Hand History For Game [A-Za-z0-9]+ \*\*\*\*\*/,
    },
    { name: this.constants.pokerStars, regex: /PokerStars Hand #\d+:/ },
    {
      name: this.constants.iPoker,
      regex:
        /^GAME #[0-9]+ Version:[\d.]+ Uncalled:[YN] Texas Hold'em NL  Tournament/,
    },
    {
      name: this.constants.winamaxPoker,
      regex: /^Winamax Poker - Tournament/,
    },
  ];

  identifyRoom(section: string): string {
    const headData = section.trim().split('\n').slice(0, 2);
    for (const roomRegex of this.pokerSites) {
      if (
        roomRegex.regex.test(headData[0]) ||
        roomRegex.regex.test(headData[1])
      ) {
        return roomRegex.name;
      }
    }
    return this.constants.noType;
  }
}
