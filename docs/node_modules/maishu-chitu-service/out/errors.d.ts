export declare class Errors {
    unexpectedNullValue(name: string): Error;
    parseJSONFail(text: string): Error;
}
export declare let errors: Errors;
