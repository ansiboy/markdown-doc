"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _menuElement, _pageClassName;
Object.defineProperty(exports, "__esModule", { value: true });
const maishu_chitu_1 = require("maishu-chitu");
const marked = require("marked");
require("../js/highlight/highlight.pack");
require("../js/marked");
const path_1 = require("maishu-toolkit/out/path");
require("../js/highlight/styles/rainbow.css");
require("../css/bootstrap.css");
require("../css/site.css");
const errors_1 = require("./errors");
const html_1 = require("maishu-toolkit/out/html");
let config = window["config"];
if (config.masterPageElement == null) {
    config.masterPageElement = document.createElement("div");
    config.masterPageElement.innerHTML = `
        <div class="main">
            <menu>
            </menu>
            <article>
            </article>
        </div>
        <footer>
        Power By <a href="https://ansiboy.github.io/markdown-doc">markdown-doc</a>
        </footer>
    `;
}
let menuElement = config.masterPageElement.querySelector("menu");
if (menuElement != null) {
    document.body.onscroll = function (e) {
        menuElement.style.top = `${document.body.scrollTop}px`;
    };
}
config.masterPageElement.className = "master-page";
class MyApplication extends maishu_chitu_1.Application {
    constructor(...args) {
        super({ container: config.masterPageElement.querySelector("article") });
        _menuElement.set(this, void 0);
        _pageClassName.set(this, void 0);
        __classPrivateFieldSet(this, _menuElement, config.masterPageElement.querySelector("menu"));
        this.pageShowing.add((sender, page) => {
            if (__classPrivateFieldGet(this, _pageClassName)) {
                html_1.HTML.removeClassName(config.masterPageElement, __classPrivateFieldGet(this, _pageClassName));
            }
            __classPrivateFieldSet(this, _pageClassName, page.name);
            html_1.HTML.addClassName(config.masterPageElement, page.name);
        });
    }
    static loadMarkdown(path) {
        return __awaiter(this, void 0, void 0, function* () {
            let r = yield fetch(path);
            let text = yield r.text();
            marked.use({
                renderer: {
                    html(html) {
                        if (html.startsWith("<code")) {
                            return `<pre>${html}`;
                        }
                        else if (html.startsWith("</code>")) {
                            return `${html}</pre>`;
                        }
                        return html;
                    }
                }
            });
            let html = marked(text);
            return { html };
        });
    }
    static initMasterPage() {
        document.body.appendChild(config.masterPageElement);
        if (config.menuPage) {
            let path = path_1.pathContact("modules", config.menuPage);
            this.loadMarkdown(path).then(r => {
                let node = document.createElement("div");
                node.innerHTML = r.html;
                let menuNode = node.querySelector("menu");
                let targetMenuNode = config.masterPageElement.querySelector("menu");
                if (menuNode != null && targetMenuNode != null) {
                    // targetMenuNode.innerHTML = menuNode.innerHTML;
                    let element = document.createElement("div");
                    element.innerHTML = menuNode.innerHTML;
                    targetMenuNode.appendChild(element);
                }
            });
        }
    }
    loadjs(path) {
        const _super = Object.create(null, {
            loadjs: { get: () => super.loadjs }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let url = `${path}.md`;
            let superLoadjs = _super.loadjs;
            return {
                default: (page) => {
                    let container = document.createElement("div");
                    container.className = "container";
                    page.element.appendChild(container);
                    MyApplication.loadMarkdown(url).then(r => {
                        container.innerHTML = r.html;
                        container.querySelectorAll("[path]").forEach(s => {
                            if (s.tagName == "CODE")
                                return;
                            let samplePath = s.getAttribute("path");
                            let arr = path.split("/");
                            arr.pop();
                            let directoryPath = arr.join("/");
                            samplePath = path_1.pathContact(directoryPath, samplePath);
                            superLoadjs.apply(exports.app, [samplePath]).then(mod => {
                                let func = mod.default || mod;
                                if (func == null)
                                    throw errors_1.errors.moduleExportNull(samplePath);
                                if (typeof func == null)
                                    throw errors_1.errors.moduleExportNotFunction(samplePath);
                                func(s);
                            });
                        });
                        container.querySelectorAll("code").forEach(c => {
                            let name = c.getAttribute("path");
                            if (name) {
                                let arr = path.split("/");
                                arr.pop();
                                let directoryPath = arr.join("/");
                                let codePath = path_1.pathContact(directoryPath, name);
                                fetch(codePath).then(r => {
                                    return r.text();
                                }).then(text => {
                                    c.textContent = text;
                                    hljs.highlightBlock(c);
                                }).catch(err => {
                                    console.error(err);
                                });
                            }
                            else {
                                hljs.highlightBlock(c);
                            }
                        });
                    }).catch(err => {
                        console.error(err);
                        container.innerHTML = JSON.stringify(err);
                    });
                }
            };
        });
    }
}
_menuElement = new WeakMap(), _pageClassName = new WeakMap();
MyApplication.initMasterPage();
exports.app = new MyApplication();
