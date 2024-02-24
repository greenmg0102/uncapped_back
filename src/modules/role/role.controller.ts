
import { Controller, Body, Post, Get, Param } from '@nestjs/common'
import { RoleService } from './role.service'

@Controller('role')
export class RoleController {
    constructor(
        private readonly roleService: RoleService,
    ) { }

    @Post('regist')
    async regit(@Body() body: any) {
        const result = await this.roleService.roleRegist(body)
        return result
    }

    @Get('role-get')
    async roleGet() {
        const result = await this.roleService.roleGet()
        return result
    }

    @Post('role-update')
    async roleUpdate(@Body() body: any) {
        const result = await this.roleService.roleUpdate(body)
        return result
    }

    @Get('role-delete/:id')
    async roleDelete(@Param('id') id: string): Promise<any> {
        const result = await this.roleService.roleDelete(id)
        return result
    }



}