interface Config {
    /** Requirejs 配置 */
    requirejs?: {
        paths?: object
    },
    /** 菜单所在的页面 */
    menuPage?: string,
    /** 隐藏菜单的页面 */
    hideMenuPages?: string[],
    masterPageElement?: HTMLElement,
}