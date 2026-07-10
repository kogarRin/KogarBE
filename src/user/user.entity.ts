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

    /** 头像 URL */
    @Column({nullable: true, length: 200})
    avatar: string

    /** 个人简介 */
    @Column({nullable: true, length: 50})
    bio: string

    /** 邮箱 */
    @Column({nullable: true, unique: true, length: 50})
    email: string

    /** 所在地 */
    @Column({nullable: true, length: 50})
    location: string

    /** GitHub 主页 */
    @Column({nullable: true, length: 50})
    github: string

    constructor(partial: Partial<User>) {
        super();
        Object.assign(this, partial);
    }

}