import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import * as dotenv from "dotenv"
import cookieParser = require("cookie-parser");

dotenv.config()

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    await app.listen(process.env.PORT ?? 3000)

    app.use(cookieParser())
    console.log("Application is running on: http://localhost:" + (process.env.PORT ?? 3000))
}
bootstrap()