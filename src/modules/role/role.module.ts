import { Module } from '@nestjs/common'
import { RoleController } from './role.controller'
import { RoleService } from './role.service'
import { RoleRepository } from './repositories/role.repository'
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schemas/role.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])],
    controllers: [RoleController],
    providers: [
        RoleService, RoleRepository
    ],
})
export class RoleModule { }
