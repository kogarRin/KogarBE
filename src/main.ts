import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import * as dotenv from "dotenv"
import cookieParser = require("cookie-parser")
import { NestExpressApplication } from "@nestjs/platform-express"
import { join } from "path"
import { existsSync, mkdirSync } from "fs"

dotenv.config()

async function bootstrap() {
    // 确保上传目录存在
    const avatarDir = join(__dirname, "..", "uploads", "avatars")
    if (!existsSync(avatarDir)) {
        mkdirSync(avatarDir, { recursive: true })
    }

    const app = await NestFactory.create<NestExpressApplication>(AppModule)
    app.use(cookieParser())
    app.useStaticAssets(join(__dirname, "..", "uploads"), {
        prefix: "/uploads/",
    })
    await app.listen(process.env.PORT ?? 3000)
    console.log("Application is running on: http://localhost:" + (process.env.PORT ?? 3000))
}
bootstrap()