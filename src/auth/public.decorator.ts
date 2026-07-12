import {SetMetadata} from "@nestjs/common"
import {IS_PUBLIC_KEY} from "@/auth/constants"

/** 标记接口为公开路由，跳过 JWT 鉴权 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
