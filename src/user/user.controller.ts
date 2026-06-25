import {Body, ClassSerializerInterceptor, Controller, Post, Res, UseInterceptors} from "@nestjs/common"
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "@/user/user.entity";
import {Repository} from "typeorm";
import {UserService} from "@/user/user.service";
import {ApiRes, ResponseCode} from "@/type/res";
import {Response} from "express"
import {AuthService} from "@/auth/auth.service";

@Controller("user")
export class UserController {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {
    }

    @Post("register")
    async register(
        @Body("username") username: string,
        @Body("password") password: string,
        @Body("nickname") nickname: string,
    ) {
        if (username.length < 7 || password.length < 8) {
            return ApiRes.error("参数格式错误", ResponseCode.PARAMS_ERROR)
        }
        if (await this.userRepository.exists({where: {username}})) {
            return ApiRes.error("用户已存在", ResponseCode.DUPLICATED)
        }
        return await this.userService.create(username, password, nickname);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Post("login")
    async login(
        @Body("username") username: string,
        @Body("password") password: string,
        @Res({passthrough: true}) res: Response
    ) {
        if (username.length < 7 || password.length < 8) {
            throw ApiRes.throw("参数格式错误", ResponseCode.PARAMS_ERROR);
        }
        const {access_token, user} = await this.authService.login(username, password);
        res.cookie("token", access_token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        return ApiRes.succeed(user, "登录成功", ResponseCode.SUCCESS);
    }
}