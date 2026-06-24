import {Injectable} from "@nestjs/common";
import {FindOneOptions, Repository} from "typeorm";
import {User} from "@/user/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {ApiRes, ResponseCode} from "@/type/res";


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findOneUserOrFailed(ops: FindOneOptions<User>) {
        return await this.userRepository.findOneOrFail(ops).catch(() => {
            throw ApiRes.throw("用户不存在", ResponseCode.NOTFOUND);
        });
    }

    async create(username: string, password: string, nickname: string) {
        try {
            const user = this.userRepository.create({username, password, nickname})
            await this.userRepository.save(user);
            return ApiRes.succeed({username, nickname}, "创建成功", ResponseCode.SUCCESS);
        } catch (error) {
            throw ApiRes.throw("创建用户失败", ResponseCode.ERROR);
        }
    }
}