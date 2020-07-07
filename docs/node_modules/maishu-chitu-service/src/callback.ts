export class Callback {
    private funcs = new Array<(...args: Array<any>) => void>();

    constructor() {
    }

    add(func: (...args: Array<any>) => any) {
        this.funcs.push(func);
    }
    remove(func: (...args: Array<any>) => any) {
        this.funcs = this.funcs.filter(o => o != func);
    }
    fire(...args: Array<any>) {
        this.funcs.forEach(o => o(...args));
    }
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



export function Callbacks<S, A, A1>(): Callback2<S, A, A1>
export function Callbacks<S, A>(): Callback1<S, A>
export function Callbacks<A>(): Callback0<A>
export function Callbacks(): Callback {
    return new Callback();
}