export let errors = {
    moduleExportNull(name: string) {
        let msg = `Module '${name}' export is null.`;
        return new Error(msg);
    },
    moduleExportNotFunction(name: string) {
        let msg = `Module '${name}' export is not a function.`;
        return new Error(msg);
    }
}