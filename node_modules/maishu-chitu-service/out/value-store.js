/**
 * 实现数据的存储，以及数据修改的通知
 */
export class ValueStore {
    constructor(value) {
        this.items = new Array();
        this._value = value;
    }
    attach(func, sender) {
        if (this.value !== undefined) {
            func(this.value, sender);
        }
        return this.add(func, sender);
    }
    add(func, sender) {
        this.items.push({ func, sender });
        return func;
    }
    remove(func) {
        this.items = this.items.filter(o => o.func != func);
    }
    fire(value) {
        this.items.forEach(o => o.func(value, o.sender));
    }
    get value() {
        if (this._value === undefined)
            return null;
        return this._value;
    }
    set value(value) {
        this._value = value;
        this.fire(value);
    }
}
export class LocalValueStore extends ValueStore {
    constructor(storageName) {
        super(LocalValueStore.loadValue(storageName));
        this.storageName = storageName;
    }
    get value() {
        return super.value;
    }
    set value(value) {
        super.value = value;
        LocalValueStore.saveValue(this.storageName, value);
    }
    static loadValue(storageName) {
        let text = localStorage.getItem(storageName);
        if (text == null)
            return null;
        return JSON.parse(text);
    }
    static saveValue(storageName, value) {
        if (value == null) {
            localStorage.removeItem(storageName);
            return;
        }
        localStorage.setItem(storageName, JSON.stringify(value));
    }
}
export class CookieValueStore extends ValueStore {
    constructor(storageName) {
        super(CookieValueStore.loadValue(storageName));
        this.storageName = storageName;
    }
    get value() {
        return super.value;
    }
    set value(value) {
        super.value = value;
        CookieValueStore.saveValue(this.storageName, value);
    }
    static loadValue(storageName) {
        let text = CookieValueStore.getCookie(storageName);
        if (text == null)
            return null;
        return JSON.parse(text);
    }
    static saveValue(storageName, value) {
        if (value == null) {
            CookieValueStore.removeCookie(storageName);
            return;
        }
        // localStorage.setItem(this.storageName, JSON.stringify(value));
        CookieValueStore.setCookie(storageName, JSON.stringify(value));
    }
    static setCookie(name, value, days) {
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
    static getCookie(name) {
        if (typeof document == 'undefined')
            return null;
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0)
                return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    static removeCookie(name) {
        // document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        this.setCookie(name, '');
    }
}
//# sourceMappingURL=value-store.js.map