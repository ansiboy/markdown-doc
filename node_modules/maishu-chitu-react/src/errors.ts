export class Errors {
    public static canntFindAction(pageName: string): Error {
        let msg = `Cannt find action in page '${pageName}', is the exports has default field?`;
        return new Error(msg);
    }
    public static exportsCanntNull(pageName: string): Error {
        let msg = `Exports of page '${pageName}' is null.`;
        return new Error(msg);
    }
}