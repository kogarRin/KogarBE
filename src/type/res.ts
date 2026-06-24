import { HttpException, HttpStatus } from "@nestjs/common"

/** 自定义业务状态码 */
export enum ResponseCode {
    /** 成功 */
    SUCCESS = 200,

    /** 通用错误 */
    ERROR = 700,
    /** 参数错误 */
    PARAMS_ERROR = 701,
    /** 数据重复 */
    DUPLICATED = 702,
    /** 数据不存在 */
    NOTFOUND = 704,

    /** 未登录或登录过期 */
    UNAUTHORIZED = 800,
}

/**
 * 统一 API 返回体
 *
 * 支持三种使用方式：
 * - `ApiRes.succeed(data)` — 成功
 * - `ApiRes.error(msg, code)` — 返回错误对象
 * - `ApiRes.throw(msg, code)` — 抛出异常，由 NestJS 全局异常过滤器自动处理
 */
export class ApiRes<T = any> {
    /** 描述信息 */
    msg: string = ""
    /** 业务状态码，用于描述请求处理的具体情况 */
    code: ResponseCode | HttpStatus | number
    /** 返回数据，错误时为 `null` */
    data: T

    constructor(
        data: T,
        msg?: string,
        code: ResponseCode | HttpStatus | number = ResponseCode.SUCCESS,
    ) {
        this.data = data
        this.msg = msg ?? ""
        this.code = code
    }

    /**
     * 成功返回体
     * @param data 返回数据
     * @param msg 描述信息
     * @param code 状态码，默认 `ResponseCode.SUCCESS`
     */
    static succeed<T = any>(
        data: T,
        msg?: string,
        code: ResponseCode | HttpStatus | number = ResponseCode.SUCCESS,
    ) {
        return new ApiRes<T>(data, msg, code)
    }

    /**
     * 抛出请求异常，可被 NestJS 自动捕获处理，不需要 try-catch
     * @param msg 描述信息
     * @param code 状态码，默认 `ResponseCode.ERROR`
     */
    static throw(
        msg?: string,
        code: ResponseCode | HttpStatus | number = ResponseCode.ERROR,
    ) {
        return new HttpException(
            {
                msg,
                code,
                data: null,
            },
            HttpStatus.OK,
        )
    }

    /**
     * 错误返回体，与 `succeed` 的区别是 `data` 固定为 `null`
     * @param msg 描述信息
     * @param code 状态码，默认 `ResponseCode.ERROR`
     */
    static error(
        msg?: string,
        code: ResponseCode | HttpStatus | number = ResponseCode.ERROR,
    ) {
        return new ApiRes<null>(null, msg, code)
    }
}