import { Entity, Column } from "typeorm"
import { BaseModel } from "@/global.entity"

@Entity()
export class User extends BaseModel {
    @Column()
    username: string

    @Column()
    password: string

    @Column({length: 10})
    nickname: string

}