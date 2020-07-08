let defaultConfig = {
    menuPage: `index.md`,
    hideMenuPages: ["index"]
};
let config = window["config"] = window["config"] || {};
Object.assign(config, defaultConfig);
if (config.requirejs)
    requirejs.config(config.requirejs);
requirejs(["../dist/application"], function (mod) {
    mod.app.run();
});
