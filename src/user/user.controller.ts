import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Res,
    UploadedFile,
    UseInterceptors
} from "@nestjs/common"
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "@/user/user.entity";
import {Repository} from "typeorm";
import {UserService} from "@/user/user.service";
import {ApiRes, ResponseCode} from "@/type/res";
import {Response} from "express"
import {AuthService} from "@/auth/auth.service";
import {Public} from "@/auth/public.decorator";
import {FileInterceptor} from "@nestjs/platform-express"
import {diskStorage} from "multer"
import {extname, join} from "path"

@Controller("user")
export class UserController {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {
    }

    @Public()
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

    @Public()
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


    @Post("logout")
    async logout(@Res({passthrough: true}) res: Response) {
        res.clearCookie("token");
        return ApiRes.succeed(null, "已登出", ResponseCode.SUCCESS);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(":id")
    async getProfile(@Param("id") id: number) {
        return await this.userService.getProfile(id);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Put(":id/update")
    @UseInterceptors(FileInterceptor("file", {
        storage: diskStorage({
            destination: join(process.cwd(), "uploads", "avatars"),
            filename: (_req, file, cb) => {
                const name = Date.now() + "-" + Math.round(Math.random() * 1e9)
                cb(null, name + extname(file.originalname))
            },
        }),
        limits: {fileSize: 2 * 1024 * 1024},
    }))
    async updateProfile(
        @Param("id") id: number,
        @Body("nickname") nickname?: string,
        @Body("bio") bio?: string,
        @Body("email") email?: string,
        @Body("location") location?: string,
        @Body("github") github?: string,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        return await this.userService.updateProfile(id, {nickname, bio, email, location, github}, file);
    }
}