import React = require("react");
import ReactDOM = require("react-dom");
import * as chitu from 'maishu-chitu'
import { ServiceConstructor, IService, PageNodeParser, PageNode, Action, PageMaster } from "maishu-chitu";
import { Errors } from "./errors";

type LoadJS = (path: string) => Promise<{ default: any }>;

export interface PageProps {
    app: Application,
    data: chitu.Page["data"],
    source: Page,
    createService: chitu.Page["createService"],
    events: {
        showing: chitu.Page["showing"],
        shown: chitu.Page["shown"],
        hiding: chitu.Page["hiding"],
        hidden: chitu.Page["hidden"],

    }
}

export class Page extends chitu.Page {
    component: React.Component | null = null;
    app: Application
}

// export let PageContext = React.createContext<{ page: Page | null }>({ page: null })

class DefaultPageNodeParser implements PageNodeParser {
    private nodes: { [key: string]: PageNode } = {}
    private modulesPath: string;

    app: Application;
    loadjs: (path: string) => Promise<any>;

    constructor(modulesPath: string) {
        this.modulesPath = modulesPath.endsWith("/") ? modulesPath.substr(0, modulesPath.length - 1) : modulesPath;
    }


    parse(pageName: string) {
        let node = this.nodes[pageName];
        if (node == null) {
            let path = `${pageName}`.split('_').join('/');
            if (this.modulesPath) {
                path = `${this.modulesPath}/${path}`;
            }
            node = { action: this.createDefaultAction(path, (path) => this.loadjs(path)), name: pageName };
            this.nodes[pageName] = node;
        }
        return node;
    }

    private createDefaultAction(url: string, loadjs: (path: string) => Promise<any>): chitu.Action {
        return async (page, app) => {
            let actionExports = await (loadjs as LoadJS)(url);
            if (!actionExports)
                throw Errors.exportsCanntNull(url);

            let action = actionExports['default']
            if (action == null) {
                throw Errors.canntFindAction(page.name);
            }

            if (isClassComponent(action)) {
                console.assert(this.app != null);
                let app = this.app;
                let props: PageProps = {
                    app,
                    data: page.data as { [key: string]: any },
                    events: {
                        shown: page.shown,
                        showing: page.showing,
                        hidden: page.hidden,
                        hiding: page.hiding,
                    },
                    source: page as Page,
                    createService<T extends IService>(type?: ServiceConstructor<T>) {
                        return page.createService<T>(type)
                    }
                }

                // let element = React.createElement(PageContext.Provider, { value: { page: page as Page } },
                let element = React.createElement(action, props);
                // )

                let component = ReactDOM.render(element, page.element) as any as React.Component
                (page as Page).component = component
            }
            else {
                action(page);
            }
        }
    }
}

export class Application extends chitu.Application {

    constructor(args?: {
        parser?: chitu.PageNodeParser;
        /** 页面容器 */
        container?: HTMLElement | { [name: string]: HTMLElement };
        /** 模块路径 */
        modulesPath?: string,
    }) {

        args = args || {}
        if (args.modulesPath === undefined) {
            args.modulesPath = "modules";
        }

        if (!args.parser)
            args.parser = Application.createPageNodeParser(args.modulesPath);

        super(args);

        (args.parser as DefaultPageNodeParser).app = this;
        (args.parser as DefaultPageNodeParser).loadjs = (path) => this.loadjs(path);

        // this.pageCreated.add((sender, page) => {
        //     page.element.className = "page"
        // })

        this.pageType = Page;
    }

    static createPageNodeParser(modulesPath: string) {
        let p = new DefaultPageNodeParser(modulesPath);
        return p;
    }
}

function isClassComponent(component: any) {
    return (
        typeof component === 'function' &&
        !!component.prototype.isReactComponent
    ) ? true : false
}

// function isFunctionComponent(component: any) {
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





