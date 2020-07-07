"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errors = {
    moduleExportNull(name) {
        let msg = `Module '${name}' export is null.`;
        return new Error(msg);
    },
    moduleExportNotFunction(name) {
        let msg = `Module '${name}' export is not a function.`;
        return new Error(msg);
    }
};
