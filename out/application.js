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
Object.defineProperty(exports, "__esModule", { value: true });
const maishu_chitu_react_1 = require("maishu-chitu-react");
const marked = require("marked");
const React = require("react");
const ReactDOM = require("react-dom");
require("js/highlight/highlight.pack");
require("js/marked");
class MyApplication extends maishu_chitu_react_1.Application {
    loadMarkdown(path) {
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
    loadjs(path) {
        const _super = Object.create(null, {
            loadjs: { get: () => super.loadjs }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let url = `${path}.md`;
            let app = this;
            let superLoadjs = _super.loadjs;
            return {
                default: class extends React.Component {
                    render() {
                        return React.createElement("div", { className: "container", ref: (e) => __awaiter(this, void 0, void 0, function* () {
                                if (!e)
                                    return;
                                let { html } = yield app.loadMarkdown(url);
                                e.innerHTML = html;
                                e.querySelectorAll('code').forEach(block => {
                                    // hljs.highlightBlock(block);
                                });
                                e.querySelectorAll("sample").forEach(s => {
                                    let name = s.getAttribute("name");
                                    let arr = path.split("/");
                                    arr.pop();
                                    arr.push(name);
                                    let samplePath = arr.join("/");
                                    superLoadjs.apply(app, [samplePath]).then(mod => {
                                        console.assert(mod.default != null);
                                        ReactDOM.render(React.createElement(mod.default), s);
                                    });
                                });
                                e.querySelectorAll("code").forEach(c => {
                                    let name = c.getAttribute("name");
                                    if (!name)
                                        return;
                                    let arr = path.split("/");
                                    arr.pop();
                                    arr.push(name);
                                    let codePath = arr.join("/");
                                    fetch(codePath).then((r) => __awaiter(this, void 0, void 0, function* () {
                                        c.textContent = yield r.text();
                                        hljs.highlightBlock(c);
                                    }));
                                });
                            }) });
                    }
                }
            };
        });
    }
}
exports.app = new MyApplication();
