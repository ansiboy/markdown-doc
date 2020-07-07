define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Errors {
        static canntFindAction(pageName) {
            let msg = `Cannt find action in page '${pageName}', is the exports has default field?`;
            return new Error(msg);
        }
        static exportsCanntNull(pageName) {
            let msg = `Exports of page '${pageName}' is null.`;
            return new Error(msg);
        }
    }
    exports.Errors = Errors;
});
