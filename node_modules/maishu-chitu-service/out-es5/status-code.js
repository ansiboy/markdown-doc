"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StatusCode = void 0;
var StatusCode;
exports.StatusCode = StatusCode;

(function (StatusCode) {
  //=============================================
  // 成功的状态码，必须大于 200
  StatusCode[StatusCode["Login"] = 282] = "Login";
  StatusCode[StatusCode["Logout"] = 283] = "Logout"; //=============================================

  StatusCode[StatusCode["NotFound"] = 404] = "NotFound";
  StatusCode[StatusCode["OK"] = 200] = "OK";
  StatusCode[StatusCode["Redirect"] = 301] = "Redirect";
  StatusCode[StatusCode["BadRequest"] = 400] = "BadRequest";
  StatusCode[StatusCode["Forbidden"] = 403] = "Forbidden"; //=============================================
  // 失败的状态码，必须小于或等于 700

  StatusCode[StatusCode["CustomError"] = 700] = "CustomError";
  StatusCode[StatusCode["ArgumentNull"] = 705] = "ArgumentNull";
  /** 字段为空 */

  StatusCode[StatusCode["FieldNull"] = 709] = "FieldNull";
  StatusCode[StatusCode["ArgumentTypeIncorrect"] = 710] = "ArgumentTypeIncorrect";
  /** 用户未登录 */

  StatusCode[StatusCode["UserNotLogin"] = 718] = "UserNotLogin";
  /** 没有权限 */

  StatusCode[StatusCode["NoPermission"] = 726] = "NoPermission";
  StatusCode[StatusCode["UserIdNull"] = 727] = "UserIdNull";
  /** 指定 ID 的对象不存在 */

  StatusCode[StatusCode["ObjectNotExistWithId"] = 728] = "ObjectNotExistWithId";
})(StatusCode || (exports.StatusCode = StatusCode = {}));
//# sourceMappingURL=status-code.js.map
