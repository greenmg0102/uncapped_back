import {
    Controller,
    Get,
    Param,
} from '@nestjs/common';

import { ProfileService } from '../services/profile.service'
import { PremiumOptionService } from '../services/premiumOption.service'

@Controller('profiles')
export class ProfileController {

    constructor(
        private profileService: ProfileService,
        private premiumOptionService: PremiumOptionService,
    ) { }

    // @UseGuards(AuthGuard('jwt'))
    @Get('/user-info/:id')
    async userInfo(@Param('id') id: string) {
        const summary = await this.profileService.getCountPerPokerNet(id);
        const proPlan = await this.premiumOptionService.getPremiumInfo(id);

        return {
            summary: summary,
            proPlan: proPlan
        };
    }
}
