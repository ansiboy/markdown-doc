# 配置

```ts
interface Config {
    /** Requirejs 配置 */
    requirejs?: object,
    /** 菜单所在的页面 */
    menuPage?: string,
    /** 隐藏菜单的页面 */
    hideMenuPages?: string[],
    /** 母版页面元素 */
    masterPageElement?: HTMLElement,
}
```

配置字段如下

名称              | 类型       | 含义
------------------|------------|---------------------
requirejs         | object     | Requirejs 配置, 具体配置参考 requirejs
menuPage          | string     | 菜单所在的页面，默认为 index.md
hideMenuPages     | string[]   | 不显示菜单的页面名称，默认为 ["index"]
masterPageElement | HTMLElment | 母版页面元素

## 示例

```js

let masterPageElement = document.createElement("div");
masterPageElement.innerHTML = `<div class="main">
    <menu>
        <a id="home-url" href="#index">首页</a>
    </menu>
    <article>
    </article>
</div>
<footer>
Power By <a href="https://ansiboy.github.io/markdown-doc">markdown-doc</a>
</footer>`;

window["config"] = {
    masterPageElement
}

```


