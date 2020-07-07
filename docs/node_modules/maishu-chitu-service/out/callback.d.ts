export declare class Callback {
    private funcs;
    constructor();
    add(func: (...args: Array<any>) => any): void;
    remove(func: (...args: Array<any>) => any): void;
    fire(...args: Array<any>): void;
}
export interface Callback0<A> extends Callback {
    add(func: (arg: A) => any): void;
    remove(func: (arg: A) => any): void;
    fire(arg: A): void;
}
export interface Callback1<S, A> extends Callback {
    add(func: (sender: S, arg: A) => any): void;
    remove(func: (sender: S, arg: A) => any): void;
    fire(sender: S, arg: A): void;
}
export interface Callback2<S, A, A1> extends Callback {
    add(func: (sender: S, arg: A, arg1: A1) => any): void;
    remove(func: (sender: S, arg: A, arg1: A1) => any): void;
    fire(sender: S, arg: A, arg1: A1): void;
}
export declare function Callbacks<S, A, A1>(): Callback2<S, A, A1>;
export declare function Callbacks<S, A>(): Callback1<S, A>;
export declare function Callbacks<A>(): Callback0<A>;
