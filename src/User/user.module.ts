import {AppService} from "@/app.service";
import {AppController} from "@/app.controller";
import {User} from "@/User/user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [AppController],
    providers: [AppService],
    exports: [AppService],
})

export class UserModule {}