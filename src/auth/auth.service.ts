import {Injectable} from "@nestjs/common"
import {JwtService} from "@nestjs/jwt"
import {ApiRes, ResponseCode} from "@/type/res"
import {UserService} from "@/user/user.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    /** 生成 JWT token */
    async generateToken(payload: { id: number; username: string }): Promise<string> {
        return await this.jwtService.signAsync(payload)
    }

    /** 验证用户凭证，成功返回 cookie 和 用户账号 **/
    async login(username: string, password: string) {
        const user = await this.userService.findOneUserOrFailed({where: {username}}).catch(() => {
            throw ApiRes.throw("账号或密码错误", ResponseCode.UNAUTHORIZED);
        })
        if (password !== user.password){
            throw ApiRes.throw("账号或密码错误", ResponseCode.UNAUTHORIZED);
        }
        const access_token = await this.generateToken({id: user.id, username: user.username})
        return {access_token, user};
    }
}