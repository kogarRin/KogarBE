import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AppDataSource } from "./data-source"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import {UserModule} from "@/User/user.module";

@Module({
    imports: [
        TypeOrmModule.forRoot(AppDataSource.options),
        UserModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
