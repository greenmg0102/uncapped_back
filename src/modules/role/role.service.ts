import { Injectable } from '@nestjs/common'
import { RoleRepository } from './repositories/role.repository'
import { RoleDocument } from './schemas/role.schema'
import { CreateRoleDto } from './dtos'

@Injectable()
export class RoleService {
    constructor(
        private readonly roleRepository: RoleRepository
    ) { }

    async roleRegist(body: CreateRoleDto): Promise<RoleDocument> {
        return await this.roleRepository.roleRegist(body)
    }

    async roleGet(): Promise<RoleDocument> {
        return await this.roleRepository.roleGet()
    }

    async roleUpdate(body: any): Promise<any> {
        return await this.roleRepository.roleUpdate(body)
    }
    async roleDelete(id: string): Promise<any> {
        return await this.roleRepository.roleDelete(id)
    }



}
