"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatData = formatData;
exports.Service = void 0;

var _callback = require("./callback");

var _errors = require("./errors");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var Service =
/*#__PURE__*/
function () {
  function Service(handleError) {
    var _this = this;

    _classCallCheck(this, Service);

    this.error = (0, _callback.Callbacks)();

    if (handleError) {
      this.error.add(function (sender, err) {
        handleError(err, _this);
      });
    }
  }

  _createClass(Service, [{
    key: "ajax",
    value: function ajax(url, options) {
      var _this2 = this;

      if (options === undefined) options = {};
      var data = options.data;
      var method = options.method;
      var headers = Object.assign({}, options.headers || {}, Service.headers);
      var body;

      if (data != null) {
        var is_json = (headers['content-type'] || '').indexOf('json') >= 0;

        if (is_json) {
          body = JSON.stringify(data);
        } else {
          body = new URLSearchParams();

          for (var key in data) {
            body.append(key, data[key]);
          }
        }
      }

      return new Promise(function (reslove, reject) {
        var options = {
          headers: headers,
          body: body,
          method: method
        };
        var timeId;
        if (options == null) throw _errors.errors.unexpectedNullValue('options');

        if (method == 'get') {
          timeId = setTimeout(function () {
            console.warn("timeout url: ".concat(url));
            var err = new Error(); //new AjaxError(options.method);

            err.name = 'timeout';
            err.message = '网络连接超时';
            reject(err);

            _this2.error.fire(_this2, err);

            clearTimeout(timeId);
          }, Service.settings.ajaxTimeout * 1000);
        }

        _ajax(url, options).then(function (data) {
          reslove(data);
          if (timeId) clearTimeout(timeId);
        }).catch(function (err) {
          reject(err);

          _this2.error.fire(_this2, err);

          if (timeId) clearTimeout(timeId);
        });
      });
    }
    /**
     * 创建服务
     * @param type 服务类型
     */

  }, {
    key: "createService",
    value: function createService(type) {
      var _this3 = this;

      type = type || Service;
      var service = new type();
      service.error.add(function (sender, error) {
        _this3.error.fire(service, error);
      });
      return service;
    }
  }, {
    key: "getByJson",
    value: function getByJson(url, data) {
      if (data && Object.getOwnPropertyNames(data).length > 0) {
        url = "".concat(url, "?").concat(encodeURIComponent(JSON.stringify(data)));
      }

      var headers = {
        "content-type": 'application/json'
      };
      return this.ajax(url, {
        headers: headers,
        method: 'get'
      });
    }
  }, {
    key: "putByJson",
    value: function putByJson(url, data) {
      var headers = {
        "content-type": 'application/json'
      };
      return this.ajax(url, {
        headers: headers,
        data: data,
        method: 'put'
      });
    }
  }, {
    key: "postByJson",
    value: function postByJson(url, data) {
      var headers = {
        "content-type": 'application/json'
      };
      return this.ajax(url, {
        headers: headers,
        data: data,
        method: 'post'
      });
    }
  }, {
    key: "deleteByJson",
    value: function deleteByJson(url, data) {
      var headers = {
        "content-type": 'application/json'
      };
      return this.ajax(url, {
        headers: headers,
        data: data,
        method: 'delete'
      });
    }
  }, {
    key: "isEncoded",
    value: function isEncoded(uri) {
      try {
        uri = uri || '';
        return uri !== decodeURIComponent(uri);
      } catch (e) {
        return false;
      }
    }
  }, {
    key: "get",
    value: function get(url, data) {
      data = data || {};
      var params = "";

      for (var key in data) {
        if (data[key] == null) continue;
        var value = "".concat(data[key]);

        if (!this.isEncoded(value)) {
          value = encodeURIComponent(value);
        }

        params = params ? "".concat(params, "&").concat(key, "=").concat(value) : "".concat(key, "=").concat(value);
      }

      if (params) {
        url = "".concat(url, "?").concat(params);
      }

      return this.ajax(url, {
        method: 'get'
      });
    }
  }, {
    key: "put",
    value: function put(url, data) {
      var headers = {
        "content-type": 'application/x-www-form-urlencoded'
      };
      return this.ajax(url, {
        headers: headers,
        data: data,
        method: 'put'
      });
    }
  }, {
    key: "post",
    value: function post(url, data) {
      var headers = {
        "content-type": 'application/x-www-form-urlencoded'
      };
      return this.ajax(url, {
        headers: headers,
        data: data,
        method: 'post'
      });
    }
  }, {
    key: "delete",
    value: function _delete(url, data) {
      var headers = {
        "content-type": 'application/x-www-form-urlencoded'
      };
      return this.ajax(url, {
        headers: headers,
        data: data,
        method: 'delete'
      });
    }
  }]);

  return Service;
}();

exports.Service = Service;
Service.settings = {
  ajaxTimeout: 30
};
Service.headers = {};

function formatData(data) {
  if (_typeof(data) == "object") {
    for (var key in data) {
      data[key] = formatData(data[key]);
    }

    return data;
  }

  var datePattern = /\d{4}-\d{1,2}-\d{1,2}T\d{1,2}:\d{1,2}:\d{1,2}/;

  if (typeof data == "string" && datePattern.test(data)) {
    return new Date(data);
  }

  return data;
}

function _ajax(url, options) {
  return __awaiter(this, void 0, void 0,
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var response, responseText, p, text, textObject, isJSONContextType, err, _err;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(typeof window === 'undefined')) {
              _context.next = 6;
              break;
            }

            _context.next = 3;
            return eval('require')('node-fetch')(url, options);

          case 3:
            response = _context.sent;
            _context.next = 9;
            break;

          case 6:
            _context.next = 8;
            return fetch(url, options);

          case 8:
            response = _context.sent;

          case 9:
            responseText = response.text();

            if (typeof responseText == 'string') {
              p = new Promise(function (reslove, reject) {
                reslove(responseText);
              });
            } else {
              p = responseText;
            }

            _context.next = 13;
            return responseText;

          case 13:
            text = _context.sent;
            isJSONContextType = (response.headers.get('content-type') || '').indexOf('json') >= 0;

            if (isJSONContextType) {
              try {
                textObject = text ? JSON.parse(text) : {};
              } catch (_a) {
                err = _errors.errors.parseJSONFail(text);
                console.error(err);
                textObject = text;
              }
            } else {
              textObject = text;
            }

            if (!(response.status >= 300)) {
              _context.next = 23;
              break;
            }

            _err = new Error();
            _err.method = options.method;
            _err.name = "".concat(response.status);
            _err.message = typeof textObject == "string" ? textObject : textObject.Message || textObject.message || '';
            _err.message = _err.message || response.statusText;
            throw _err;

          case 23:
            textObject = formatData(textObject);
            return _context.abrupt("return", textObject);

          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
}
//# sourceMappingURL=service.js.map
