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
var _menuElement;
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
let config = window["config"];
let masterPage = document.createElement("div");
class MyApplication extends maishu_chitu_1.Application {
    constructor(...args) {
        super({ container: masterPage.querySelector("article") });
        _menuElement.set(this, void 0);
        __classPrivateFieldSet(this, _menuElement, masterPage.querySelector("menu"));
        this.pageShowing.add((sender, page) => {
            if (config.hideMenuPages != null && config.hideMenuPages.indexOf(page.name) >= 0 &&
                __classPrivateFieldGet(this, _menuElement) != null) {
                __classPrivateFieldGet(this, _menuElement).style.display = "none";
            }
            else {
                __classPrivateFieldGet(this, _menuElement).style.removeProperty("display");
            }
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
        masterPage.innerHTML = `
            <menu>
            </menu>
            <article>
            </article>
        `;
        document.body.appendChild(masterPage);
        if (config.menuPage) {
            let path = path_1.pathContact("modules", config.menuPage);
            this.loadMarkdown(path).then(r => {
                let node = document.createElement("div");
                node.innerHTML = r.html;
                let menuNode = node.querySelector("menu");
                let targetMenuNode = masterPage.querySelector("menu");
                if (menuNode != null && targetMenuNode != null) {
                    targetMenuNode.innerHTML = menuNode.innerHTML;
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
_menuElement = new WeakMap();
MyApplication.initMasterPage();
exports.app = new MyApplication();
