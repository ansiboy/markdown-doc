
let defaultConfig: Config = {
    menuPage: `index.md`,
    hideMenuPages: ["index"]
}

let config: Config = window["config"] = window["config"] || {};
Object.assign(config, defaultConfig);

if (config.requirejs)
    requirejs.config(config.requirejs);

requirejs(["../dist/application"], function (mod) {
    mod.app.run();
})


