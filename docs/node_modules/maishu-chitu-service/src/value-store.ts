export type ValueChangedCallback<T> = (args: T, sender: any) => void;

/**
 * 实现数据的存储，以及数据修改的通知
 */
export class ValueStore<T> {
    private items = new Array<{ func: ValueChangedCallback<T | null>, sender: any }>();
    private _value: T | null;

    constructor(value?: T) {
        this._value = value;
    }
    attach(func: ValueChangedCallback<T | null>, sender?: any): ValueChangedCallback<T> {
        if (this.value !== undefined) {
            func(this.value, sender);
        }
        return this.add(func, sender);
    }
    add(func: ValueChangedCallback<T | null>, sender?: any): ValueChangedCallback<T> {
        this.items.push({ func, sender });
        return func;
    }
    remove(func: ValueChangedCallback<T>) {
        this.items = this.items.filter(o => o.func != func);
    }
    fire(value: T | null) {
        this.items.forEach(o => o.func(value, o.sender));
    }
    get value(): T | null {
        if (this._value === undefined)
            return null

        return this._value;
    }
    set value(value: T | null) {
        this._value = value;
        this.fire(value);
    }
}

export class LocalValueStore<T> extends ValueStore<T> {
    private storageName: string;
    constructor(storageName: string) {
        super(LocalValueStore.loadValue(storageName));
        this.storageName = storageName;
    }

    get value() {
        return super.value;
    }
    
    set value(value: T | null) {
        super.value = value;
        LocalValueStore.saveValue(this.storageName, value);
    }

    private static loadValue<T>(storageName): T | null {
        let text = localStorage.getItem(storageName);
        if (text == null)
            return null;

        return JSON.parse(text);
    }

    private static saveValue<T>(storageName: string, value: T | null) {
        if (value == null) {
            localStorage.removeItem(storageName);
            return;
        }
        localStorage.setItem(storageName, JSON.stringify(value));
    }
}

export class CookieValueStore<T> extends ValueStore<T> {
    private storageName: string;
    constructor(storageName: string) {
        super(CookieValueStore.loadValue(storageName));
        this.storageName = storageName;
    }

    get value() {
        return super.value;
    }

    set value(value: T | null) {
        super.value = value;
        CookieValueStore.saveValue(this.storageName, value);
    }

    private static loadValue<T>(storageName): T | null {
        let text = CookieValueStore.getCookie(storageName);
        if (text == null)
            return null;

        return JSON.parse(text);
    }

    private static saveValue<T>(storageName: string, value: T | null) {
        if (value == null) {
            CookieValueStore.removeCookie(storageName);
            return;
        }
        // localStorage.setItem(this.storageName, JSON.stringify(value));
        CookieValueStore.setCookie(storageName, JSON.stringify(value));
    }

    private static setCookie(name: string, value: string, days?: number) {
        // nodejs 没有 document
        if (typeof document == 'undefined')
            return;

        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
    private static getCookie(name: string) {
        if (typeof document == 'undefined')
            return null;

        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    private static removeCookie(name: string) {
        // document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        this.setCookie(name, '')
    }
}
