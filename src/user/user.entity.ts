import { Entity, Column } from "typeorm"
import { BaseModel } from "@/global.entity"
import { Exclude } from 'class-transformer';

@Entity()
export class User extends BaseModel {
    @Column()
    username: string

    @Column()
    @Exclude()
    password: string

    @Column({length: 10})
    nickname: string

    constructor(partial: Partial<User>) {
        super();
        Object.assign(this, partial);
    }

}