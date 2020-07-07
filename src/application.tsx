import { Application } from "maishu-chitu-react";
import * as marked from "marked";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "js/highlight/highlight.pack";
import "js/marked";

class MyApplication extends Application {

    private async loadMarkdown(path: string) {
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
        let app = this;
        let superLoadjs = super.loadjs;
        return {
            default: class extends React.Component {
                render() {
                    return <div className="container" ref={async e => {
                        if (!e) return;

                        let { html } = await app.loadMarkdown(url);
                        e.innerHTML = html;

                        e.querySelectorAll('code').forEach(block => {
                            // hljs.highlightBlock(block);
                        })


                        e.querySelectorAll("sample").forEach(s => {
                            let name = s.getAttribute("name");
                            let arr = path.split("/");
                            arr.pop();
                            arr.push(name);
                            let samplePath = arr.join("/");
                            superLoadjs.apply(app, [samplePath]).then(mod => {
                                console.assert(mod.default != null);
                                ReactDOM.render(React.createElement(mod.default), s);
                            })

                        })

                        e.querySelectorAll("code").forEach(c => {
                            let name = c.getAttribute("name");
                            if (!name) return;
                            let arr = path.split("/");
                            arr.pop();
                            arr.push(name);
                            let codePath = arr.join("/");
                            fetch(codePath).then(async r => {
                                c.textContent = await r.text();
                                hljs.highlightBlock(c)
                            })
                        })

                    }
                    } />
                }
            }
        }
    }
}

export let app = new MyApplication();