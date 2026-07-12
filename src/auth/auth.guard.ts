import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { JwtService } from "@nestjs/jwt"
import { Request } from "express"
import { ApiRes, ResponseCode } from "@/type/res"
import { IS_PUBLIC_KEY } from "@/auth/constants"

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        )
        if (isPublic) {
            return true
        }

        const request = context.switchToHttp().getRequest<Request>()
        const token = this.extractTokenFromCookie(request)

        if (!token) {
            throw ApiRes.throw("未登录或登录过期", ResponseCode.UNAUTHORIZED)
        }

        try {
            const payload = await this.jwtService.verifyAsync(token)
            // 将解析后的用户信息挂载到 request 上，方便后续使用
            ;(request as any).user = payload
        } catch {
            throw ApiRes.throw("未登录", ResponseCode.UNAUTHORIZED)
        }

        return true
    }

    /** 从 cookie 中提取 token */
    private extractTokenFromCookie(request: Request): string | undefined {
        return request.cookies?.token
    }
}
