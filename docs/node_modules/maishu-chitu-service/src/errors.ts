// import { Errors } from "maishu-toolkit";
// export { Errors } from "maishu-toolkit";

export class Errors {
    unexpectedNullValue(name: string) {
        let msg = `variable ${name} is unexpected null value.`
        return new Error(msg)
    }
    parseJSONFail(text: string) {
        let msg = `Parse json string fail:\r\n${text}`;
        return new Error(msg);
    }
}

export let errors = new Errors();

