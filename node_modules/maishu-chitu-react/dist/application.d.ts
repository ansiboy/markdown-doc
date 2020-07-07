import React = require("react");
import * as chitu from 'maishu-chitu';
import { PageNodeParser } from "maishu-chitu";
export interface PageProps {
    app: Application;
    data: chitu.Page["data"];
    source: Page;
    createService: chitu.Page["createService"];
    events: {
        showing: chitu.Page["showing"];
        shown: chitu.Page["shown"];
        hiding: chitu.Page["hiding"];
        hidden: chitu.Page["hidden"];
    };
}
export declare class Page extends chitu.Page {
    component: React.Component | null;
    app: Application;
}
declare class DefaultPageNodeParser implements PageNodeParser {
    private nodes;
    private modulesPath;
    app: Application;
    loadjs: (path: string) => Promise<any>;
    constructor(modulesPath: string);
    parse(pageName: string): chitu.PageNode;
    private createDefaultAction;
}
export declare class Application extends chitu.Application {
    constructor(args?: {
        parser?: chitu.PageNodeParser;
        /** 页面容器 */
        container?: HTMLElement | {
            [name: string]: HTMLElement;
        };
        /** 模块路径 */
        modulesPath?: string;
    });
    static createPageNodeParser(modulesPath: string): DefaultPageNodeParser;
}
export {};
