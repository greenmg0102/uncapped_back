import { Controller, Get, Post, Body, Param, HttpCode, Res, UseGuards, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport'
import { ReportGeneratorService } from '../services/report-generator.service';
import { GlobalOpportunityService } from '../services/global-opportunity.service';

@Controller('report')
export class ReportController {

    constructor(
        private reportGeneratorService: ReportGeneratorService,
        private globalOpportunityService: GlobalOpportunityService,
    ) { }

    @Post('/collections')
    @HttpCode(200)
    async collections(@Body() body: any, @Res() res: Response) {
        return await this.reportGeneratorService.collections(body, res)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/report-each-pair')
    @HttpCode(200)
    async reportEachPair(@Req() req: Request, @Body() body): Promise<any> {

        const user: any = req.user;
        const userId = user.sub._id;

        let bufferBody = body
        bufferBody.userId = userId

        return await this.reportGeneratorService.reportEachPair(body)
    }

    @Post('/condition-pair')
    @HttpCode(200)
    async conditionPair(@Body() body): Promise<any> {
        return await this.reportGeneratorService.conditionPair(body)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/report-integration')
    @HttpCode(200)
    async reportIntegration(@Req() req: Request, @Body() body): Promise<any> {

        const user: any = req.user;
        const userId = user.sub._id;

        let bufferBody = body
        bufferBody.userId = userId

        return await this.reportGeneratorService.reportIntegration(body)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/user-hand-info')
    @HttpCode(200)
    async userHandInfo(@Req() req: Request, @Body() body): Promise<any> {

        const user: any = req.user;
        const userId = user.sub._id;

        let bufferBody = {
            ...body,
            userId: userId
        }

        return await this.reportGeneratorService.userHandInfo(bufferBody)
    }

    @Get('/get-node-hand/:id')
    @HttpCode(200)
    async getNodeHand(@Param('id') id: string): Promise<any> {
        return await this.reportGeneratorService.getNodeHand(id)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/main-data-hand-info')
    @HttpCode(200)
    async mainDataHandInfo(@Body() body): Promise<any> {
        return await this.reportGeneratorService.mainDataHandInfo(body)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/detailed-table')
    @HttpCode(200)
    async detailedTable(@Req() req: Request, @Body() body): Promise<any> {

        const user: any = req.user;
        const userId = user.sub._id;

        let bufferBody = {
            ...body,
            userId: userId
        }
        return await this.reportGeneratorService.detailedTable(bufferBody)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/opportunity-global')
    @HttpCode(200)
    async opportunityGlobal(@Req() req: Request, @Body() body): Promise<any> {

        const user: any = req.user;
        const userId = user.sub._id;

        let bufferBody = {
            ...body,
            userId: userId
        }

        return await this.globalOpportunityService.eachActionPosition(bufferBody)
    }
}
