import { forwardRef, Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "@/user/user.entity"
import { AuthController } from "@/auth/auth.controller"
import { AuthService } from "@/auth/auth.service"
import { UserModule } from "@/user/user.module"

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => UserModule),
        JwtModule.register({
            secret: process.env.JWT_SECRET ?? "kogar-secret",
            signOptions: { expiresIn: "7d" },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}