---
layout: home
permalink: /
---

## 安装

```
npm install maishu-chitu-react
```

## 如何使用


1. 引用 require js

    ```html

    <script src="https://cdn.bootcss.com/require.js/2.3.6/require.js" data-main="index"></script>

    ```

1. 配置 require js

    在 index.js 文件配置 requirejs

    ```js
    require.config({
        paths: {
            'react': 'https://cdn.bootcss.com/react/16.6.0/umd/react.development',
            'react-dom': 'https://cdn.bootcss.com/react-dom/16.6.0/umd/react-dom.development',
            'maishu-chitu': 'node_modules/maishu-chitu/dist/chitu',
            'maishu-chitu-react': 'node_modules/maishu-chitu-react/out/index'
        }
    })

    require(['maishu-chitu-react'], function (chitu_react) {
        app = new chitu_react.Application();
        app.run()
    })
    ```

1. 如果使用 typescript，还需要配置路径，如：

    ```json
    {
        "compileOnSave": true,
        "compilerOptions": {
            "jsx": "react",
            "module": "amd",
            "baseUrl": "./",
            "paths": {
               "maishu-chitu": [
                    "node_modules/maishu-chitu/dist/chitu.d.ts"
                ],
                "maishu-chitu-react": [
                    "node_modules/maishu-chitu-react/out/index.d.ts"
                ] 
            }
        }
    }
    ```


