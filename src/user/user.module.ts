import { forwardRef, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "@/user/user.entity"
import { UserController } from "@/user/user.controller"
import { UserService } from "@/user/user.service"
import { AuthModule } from "@/auth/auth.module"

@Module({
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}