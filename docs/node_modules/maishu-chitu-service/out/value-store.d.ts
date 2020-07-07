export declare type ValueChangedCallback<T> = (args: T, sender: any) => void;
/**
 * 实现数据的存储，以及数据修改的通知
 */
export declare class ValueStore<T> {
    private items;
    private _value;
    constructor(value?: T);
    attach(func: ValueChangedCallback<T | null>, sender?: any): ValueChangedCallback<T>;
    add(func: ValueChangedCallback<T | null>, sender?: any): ValueChangedCallback<T>;
    remove(func: ValueChangedCallback<T>): void;
    fire(value: T | null): void;
    get value(): T | null;
    set value(value: T | null);
}
export declare class LocalValueStore<T> extends ValueStore<T> {
    private storageName;
    constructor(storageName: string);
    get value(): T | null;
    set value(value: T | null);
    private static loadValue;
    private static saveValue;
}
export declare class CookieValueStore<T> extends ValueStore<T> {
    private storageName;
    constructor(storageName: string);
    get value(): T | null;
    set value(value: T | null);
    private static loadValue;
    private static saveValue;
    private static setCookie;
    private static getCookie;
    private static removeCookie;
}
