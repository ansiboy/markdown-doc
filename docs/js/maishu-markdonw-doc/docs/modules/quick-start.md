# 快速入门


1. 创建文档文件夹例如 docs，docs 文件夹一般如下：

    <pre>
    docs
    |--modules
    |  |--index.md
    |  |--sample.js
    |--node_modules
    |--index.html
    |--package.json
    </pre>

1. 创建 index.html 文件，如下：

    <html>
    <head></head>

    <body>
        <script
        src="node_modules/requirejs/require.js"
        data-main="node_modules/maishu-markdonw-doc/out/index"
        ></script>
    </body>
    </html>

1. 创建 markdown 文件
    
    Markdown 文件需要放在名为 modules 的文件夹内。在该文件内创建明为 index.md 的文件夹，例如

    ```
    # Hello World
    ```

1. 运行

    安装 http-server，进入 docs 文件夹，如下命令 http-server，例如：

    <pre>
    D:\projects\markdown-doc\docs>http-server
    Starting up http-server, serving ./
    Available on:
    http://192.168.56.1:8082
    http://192.168.1.106:8082
    http://127.0.0.1:8082
    Hit CTRL-C to stop the server
    </pre>

    在浏览器输入 http://127.0.0.1:8082/#index 即可查看，其中 index 为 markdown 文件的路径，注：文件名为 index，可以不输入，即 http://127.0.0.1:8082


