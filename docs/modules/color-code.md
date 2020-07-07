# 代码着色

MARKDOWN-DOC 集成了 [highlight.js](https://highlightjs.org/)。对于 JS 代码着色，有两种写法，内联和外部加载。

## JS 代码内联

例如，在 markdown 文件输入下面内容：

<pre>
```js
let a = 5;
let b = 6;
let c = a + b;
alert(`result is ${c}`)
```
</pre>

显示结果如下：

```js
let a = 5;
let b = 6;
let c = a + b;
alert(`result is ${c}`)
```

## JS 代码外部加载

Markdown 代码如下：

```
<code path="sample-1.js"></code>
```

页面显示结果：

<code path="sample-1.js"></code>