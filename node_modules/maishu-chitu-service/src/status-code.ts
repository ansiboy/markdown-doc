export enum StatusCode {

    //=============================================
    // 成功的状态码，必须大于 200
    Login = 282,
    Logout = 283,
    //=============================================

    NotFound = 404,
    OK = 200,
    Redirect = 301,
    BadRequest = 400,
    Forbidden = 403,

    //=============================================
    // 失败的状态码，必须小于或等于 700
    CustomError = 700,
    
    ArgumentNull = 705,

    /** 字段为空 */
    FieldNull = 709,

    ArgumentTypeIncorrect = 710,

    /** 用户未登录 */
    UserNotLogin = 718,

    /** 没有权限 */
    NoPermission = 726,
    UserIdNull = 727,

    /** 指定 ID 的对象不存在 */
    ObjectNotExistWithId = 728,
}


