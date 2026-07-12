import { forwardRef, Module } from "@nestjs/common"
import { APP_GUARD } from "@nestjs/core"
import { JwtModule } from "@nestjs/jwt"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "@/user/user.entity"
import { AuthController } from "@/auth/auth.controller"
import { AuthService } from "@/auth/auth.service"
import { AuthGuard } from "@/auth/auth.guard"
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
    providers: [
        AuthService,
        AuthGuard,
        { provide: APP_GUARD, useClass: AuthGuard },
    ],
    exports: [AuthService, AuthGuard],
})
export class AuthModule {}