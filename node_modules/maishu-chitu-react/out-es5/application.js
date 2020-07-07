"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

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

define(["require", "exports", "react", "react-dom", "maishu-chitu", "./errors"], function (require, exports, React, ReactDOM, chitu, errors_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var Page =
  /*#__PURE__*/
  function (_chitu$Page) {
    _inherits(Page, _chitu$Page);

    function Page() {
      var _this;

      _classCallCheck(this, Page);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Page).apply(this, arguments));
      _this.component = null;
      return _this;
    }

    return Page;
  }(chitu.Page);

  exports.Page = Page; // export let PageContext = React.createContext<{ page: Page | null }>({ page: null })

  var DefaultPageNodeParser =
  /*#__PURE__*/
  function () {
    function DefaultPageNodeParser(modulesPath) {
      _classCallCheck(this, DefaultPageNodeParser);

      this.nodes = {};
      this.modulesPath = modulesPath.endsWith("/") ? modulesPath.substr(0, modulesPath.length - 1) : modulesPath;
    }

    _createClass(DefaultPageNodeParser, [{
      key: "parse",
      value: function parse(pageName) {
        var _this2 = this;

        var node = this.nodes[pageName];

        if (node == null) {
          var path = "".concat(pageName).split('_').join('/');

          if (this.modulesPath) {
            path = "".concat(this.modulesPath, "/").concat(path);
          }

          node = {
            action: this.createDefaultAction(path, function (path) {
              return _this2.loadjs(path);
            }),
            name: pageName
          };
          this.nodes[pageName] = node;
        }

        return node;
      }
    }, {
      key: "createDefaultAction",
      value: function createDefaultAction(url, loadjs) {
        var _this3 = this;

        return function (page, app) {
          return __awaiter(_this3, void 0, void 0,
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee() {
            var actionExports, action, _app, props, element, component;

            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return loadjs(url);

                  case 2:
                    actionExports = _context.sent;

                    if (actionExports) {
                      _context.next = 5;
                      break;
                    }

                    throw errors_1.Errors.exportsCanntNull(url);

                  case 5:
                    action = actionExports['default'];

                    if (!(action == null)) {
                      _context.next = 8;
                      break;
                    }

                    throw errors_1.Errors.canntFindAction(page.name);

                  case 8:
                    if (isClassComponent(action)) {
                      console.assert(this.app != null);
                      _app = this.app;
                      props = {
                        app: _app,
                        data: page.data,
                        events: {
                          shown: page.shown,
                          showing: page.showing,
                          hidden: page.hidden,
                          hiding: page.hiding
                        },
                        source: page,
                        createService: function createService(type) {
                          return page.createService(type);
                        }
                      }; // let element = React.createElement(PageContext.Provider, { value: { page: page as Page } },

                      element = React.createElement(action, props); // )

                      component = ReactDOM.render(element, page.element);
                      page.component = component;
                    } else {
                      action(page);
                    }

                  case 9:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));
        };
      }
    }]);

    return DefaultPageNodeParser;
  }();

  var Application =
  /*#__PURE__*/
  function (_chitu$Application) {
    _inherits(Application, _chitu$Application);

    function Application(args) {
      var _this4;

      _classCallCheck(this, Application);

      args = args || {};

      if (args.modulesPath === undefined) {
        args.modulesPath = "modules";
      }

      if (!args.parser) args.parser = Application.createPageNodeParser(args.modulesPath);
      _this4 = _possibleConstructorReturn(this, _getPrototypeOf(Application).call(this, args));
      args.parser.app = _assertThisInitialized(_this4);

      args.parser.loadjs = function (path) {
        return _this4.loadjs(path);
      }; // this.pageCreated.add((sender, page) => {
      //     page.element.className = "page"
      // })


      _this4.pageType = Page;
      return _this4;
    }

    _createClass(Application, null, [{
      key: "createPageNodeParser",
      value: function createPageNodeParser(modulesPath) {
        var p = new DefaultPageNodeParser(modulesPath);
        return p;
      }
    }]);

    return Application;
  }(chitu.Application);

  exports.Application = Application;

  function isClassComponent(component) {
    return typeof component === 'function' && !!component.prototype.isReactComponent ? true : false;
  }
}); // function isFunctionComponent(component: any) {
//     return (
//         typeof component === 'function' &&
//         String(component).includes('return React.createElement')
//     ) ? true : false;
// }
// function isReactComponent(component: any) {
//     return (
//         isClassComponent(component) ||
//         isFunctionComponent(component)
//     ) ? true : false;
// }
//# sourceMappingURL=application.js.map
