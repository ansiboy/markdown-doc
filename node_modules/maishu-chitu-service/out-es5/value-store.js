"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CookieValueStore = exports.LocalValueStore = exports.ValueStore = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function set(target, property, value, receiver) { if (typeof Reflect !== "undefined" && Reflect.set) { set = Reflect.set; } else { set = function set(target, property, value, receiver) { var base = _superPropBase(target, property); var desc; if (base) { desc = Object.getOwnPropertyDescriptor(base, property); if (desc.set) { desc.set.call(receiver, value); return true; } else if (!desc.writable) { return false; } } desc = Object.getOwnPropertyDescriptor(receiver, property); if (desc) { if (!desc.writable) { return false; } desc.value = value; Object.defineProperty(receiver, property, desc); } else { _defineProperty(receiver, property, value); } return true; }; } return set(target, property, value, receiver); }

function _set(target, property, value, receiver, isStrict) { var s = set(target, property, value, receiver || target); if (!s && isStrict) { throw new Error('failed to set property'); } return value; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * 实现数据的存储，以及数据修改的通知
 */
var ValueStore =
/*#__PURE__*/
function () {
  function ValueStore(value) {
    _classCallCheck(this, ValueStore);

    this.items = new Array();
    this._value = value;
  }

  _createClass(ValueStore, [{
    key: "attach",
    value: function attach(func, sender) {
      if (this.value !== undefined) {
        func(this.value, sender);
      }

      return this.add(func, sender);
    }
  }, {
    key: "add",
    value: function add(func, sender) {
      this.items.push({
        func: func,
        sender: sender
      });
      return func;
    }
  }, {
    key: "remove",
    value: function remove(func) {
      this.items = this.items.filter(function (o) {
        return o.func != func;
      });
    }
  }, {
    key: "fire",
    value: function fire(value) {
      this.items.forEach(function (o) {
        return o.func(value, o.sender);
      });
    }
  }, {
    key: "value",
    get: function get() {
      if (this._value === undefined) return null;
      return this._value;
    },
    set: function set(value) {
      this._value = value;
      this.fire(value);
    }
  }]);

  return ValueStore;
}();

exports.ValueStore = ValueStore;

var LocalValueStore =
/*#__PURE__*/
function (_ValueStore) {
  _inherits(LocalValueStore, _ValueStore);

  function LocalValueStore(storageName) {
    var _this;

    _classCallCheck(this, LocalValueStore);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LocalValueStore).call(this, LocalValueStore.loadValue(storageName)));
    _this.storageName = storageName;
    return _this;
  }

  _createClass(LocalValueStore, [{
    key: "value",
    get: function get() {
      return _get(_getPrototypeOf(LocalValueStore.prototype), "value", this);
    },
    set: function set(value) {
      _set(_getPrototypeOf(LocalValueStore.prototype), "value", value, this, true);

      LocalValueStore.saveValue(this.storageName, value);
    }
  }], [{
    key: "loadValue",
    value: function loadValue(storageName) {
      var text = localStorage.getItem(storageName);
      if (text == null) return null;
      return JSON.parse(text);
    }
  }, {
    key: "saveValue",
    value: function saveValue(storageName, value) {
      if (value == null) {
        localStorage.removeItem(storageName);
        return;
      }

      localStorage.setItem(storageName, JSON.stringify(value));
    }
  }]);

  return LocalValueStore;
}(ValueStore);

exports.LocalValueStore = LocalValueStore;

var CookieValueStore =
/*#__PURE__*/
function (_ValueStore2) {
  _inherits(CookieValueStore, _ValueStore2);

  function CookieValueStore(storageName) {
    var _this2;

    _classCallCheck(this, CookieValueStore);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(CookieValueStore).call(this, CookieValueStore.loadValue(storageName)));
    _this2.storageName = storageName;
    return _this2;
  }

  _createClass(CookieValueStore, [{
    key: "value",
    get: function get() {
      return _get(_getPrototypeOf(CookieValueStore.prototype), "value", this);
    },
    set: function set(value) {
      _set(_getPrototypeOf(CookieValueStore.prototype), "value", value, this, true);

      CookieValueStore.saveValue(this.storageName, value);
    }
  }], [{
    key: "loadValue",
    value: function loadValue(storageName) {
      var text = CookieValueStore.getCookie(storageName);
      if (text == null) return null;
      return JSON.parse(text);
    }
  }, {
    key: "saveValue",
    value: function saveValue(storageName, value) {
      if (value == null) {
        CookieValueStore.removeCookie(storageName);
        return;
      } // localStorage.setItem(this.storageName, JSON.stringify(value));


      CookieValueStore.setCookie(storageName, JSON.stringify(value));
    }
  }, {
    key: "setCookie",
    value: function setCookie(name, value, days) {
      // nodejs 没有 document
      if (typeof document == 'undefined') return;
      var expires = "";

      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
      }

      document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
  }, {
    key: "getCookie",
    value: function getCookie(name) {
      if (typeof document == 'undefined') return null;
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');

      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];

        while (c.charAt(0) == ' ') {
          c = c.substring(1, c.length);
        }

        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }

      return null;
    }
  }, {
    key: "removeCookie",
    value: function removeCookie(name) {
      // document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      this.setCookie(name, '');
    }
  }]);

  return CookieValueStore;
}(ValueStore);

exports.CookieValueStore = CookieValueStore;
//# sourceMappingURL=value-store.js.map
