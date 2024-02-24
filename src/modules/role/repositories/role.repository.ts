import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Role } from '../schemas/role.schema'
import { CreateRoleDto } from '../dtos'

@Injectable()
export class RoleRepository {
    constructor(
        @InjectModel(Role.name)
        private readonly roleModel: Model<Role>,
    ) { }

    async roleRegist(body: CreateRoleDto): Promise<any> {

        const created = new this.roleModel(body);
        const result = await created
            .save()
            .then((result: any) => {
                return this.roleModel.find()
            })

        return result
    }

    async roleGet(): Promise<any> {
        return this.roleModel.find()
    }

    async roleUpdate(body: any): Promise<any> {

        let bufferAvailableRoleList = await this.roleModel.findById(body.mainRole._id).then((result: any) => result.admittingPageList)
        let realList = bufferAvailableRoleList.filter((item: any) => item === body.updatingRole).length > 0 ?
            bufferAvailableRoleList.filter((item: any) => body.updatingRole !== item) :
            [...bufferAvailableRoleList, body.updatingRole]

        const result = await this.roleModel
            .findByIdAndUpdate(body.mainRole._id, { admittingPageList: realList, roleName: body.updatingMajorRole ? body.updatingMajorRole : body.mainRole.roleName })
            .then(async (result: any) => await this.roleModel.find())
            .catch(async (error: any) => await this.roleModel.find())

        return result
    }
    async roleDelete(id: string): Promise<any> {

        const result = await this.roleModel
            .findByIdAndRemove(id)
            .then(async (result: any) => await this.roleModel.find())
            .catch(async (error: any) => await this.roleModel.find())

        return result
    }

}
