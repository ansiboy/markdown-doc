import { Application, Page } from "maishu-chitu";
import * as marked from "marked";
import "../js/highlight/highlight.pack";
import "../js/marked";
import { pathContact } from "maishu-toolkit/out/path";
import "../js/highlight/styles/rainbow.css";
import "../css/bootstrap.css";
import "../css/site.css";
import { errors } from "./errors";

class MyApplication extends Application {

    private static async loadMarkdown(path: string) {
        let r = await fetch(path);
        let text = await r.text();
        marked.use({
            renderer: {
                html(html) {
                    if (html.startsWith("<code")) {
                        return `<pre>${html}`;
                    }
                    else if (html.startsWith("</code>")) {
                        return `${html}</pre>`
                    }
                    return html;
                }
            }
        })
        let html = marked(text);
        return { html };
    }

    async loadjs(path: string) {
        let url = `${path}.md`;
        let superLoadjs = super.loadjs;
        return {
            default: (page: Page) => {
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
                        samplePath = pathContact("/", directoryPath, samplePath);
                        superLoadjs.apply(app, [samplePath]).then(mod => {
                            let func = mod.default || mod;
                            if (func == null)
                                throw errors.moduleExportNull(samplePath);

                            if (typeof func == null)
                                throw errors.moduleExportNotFunction(samplePath);

                            func(s);
                        })

                    })

                    container.querySelectorAll("code").forEach(c => {
                        let name = c.getAttribute("path");
                        if (name) {
                            let arr = path.split("/");
                            arr.pop();
                            let directoryPath = arr.join("/");
                            let codePath = pathContact("/", directoryPath, name);
                            fetch(codePath).then(r => {
                                return r.text();
                            }).then(text => {
                                c.textContent = text;
                                hljs.highlightBlock(c);
                            }).catch(err => {
                                console.error(err);
                            })
                        }
                        else {
                            hljs.highlightBlock(c);
                        }

                    })

                }).catch(err => {
                    console.error(err);
                    container.innerHTML = JSON.stringify(err);
                })
            }
        }
    }
}

export let app = new MyApplication();
