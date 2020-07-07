import { Callbacks, Callback1 } from "./callback";
import { errors } from "./errors";

export interface ServiceConstructor<T> {
    new(): T
}

export type AjaxOptions = { data?: any, headers?: { [key: string]: string }, method?: string };

export interface IService {
    error: Callback1<Service, Error>
}

export class Service implements IService {

    error = Callbacks<Service, Error>();

    static settings = {
        ajaxTimeout: 30,
    }

    static headers: AjaxOptions["headers"] = {};

    constructor(handleError?: (error: Error, sender: Service) => void) {
        if (handleError) {
            this.error.add((sender, err) => {
                handleError(err, this);
            })
        }
    }

    ajax<T>(url: string, options?: AjaxOptions): Promise<T | null> {
        if (options === undefined)
            options = {}

        let data = options.data;
        let method = options.method;
        let headers = Object.assign({}, options.headers || {}, Service.headers);
        let body: string | URLSearchParams

        if (data != null) {
            let is_json = ((headers['content-type'] || '') as string).indexOf('json') >= 0;
            if (is_json) {
                body = JSON.stringify(data);
            }
            else {
                body = new URLSearchParams();
                for (let key in data) {
                    body.append(key, data[key])
                }
            }
        }

        return new Promise<T>((reslove, reject) => {
            let options = { headers: headers, body, method }
            let timeId: number;
            if (options == null) throw errors.unexpectedNullValue('options')
            if (method == 'get') {
                timeId = setTimeout(() => {
                    console.warn(`timeout url: ${url}`);
                    let err = new Error(); //new AjaxError(options.method);
                    err.name = 'timeout';
                    err.message = '网络连接超时';
                    reject(err);
                    this.error.fire(this, err);
                    clearTimeout(timeId);

                }, Service.settings.ajaxTimeout * 1000)
            }

            ajax<T>(url, options)
                .then(data => {
                    reslove(data);
                    if (timeId)
                        clearTimeout(timeId);
                })
                .catch(err => {
                    reject(err);
                    this.error.fire(this, err);

                    if (timeId)
                        clearTimeout(timeId);
                });

        })
    }

    /**
     * 创建服务
     * @param type 服务类型
     */
    createService<T extends Service>(type?: ServiceConstructor<T>): T {
        type = type || Service as any as ServiceConstructor<T>
        let service = new type();
        service.error.add((sender, error) => {
            this.error.fire(service, error)
        })
        return service;
    }

    getByJson<T>(url: string, data?: any) {
        if (data && Object.getOwnPropertyNames(data).length > 0) {
            url = `${url}?${encodeURIComponent(JSON.stringify(data))}`;
        }

        let headers = { "content-type": 'application/json' };
        return this.ajax<T>(url, { headers, method: 'get' })
    }

    putByJson<T>(url: string, data?: any) {
        let headers = { "content-type": 'application/json' };
        return this.ajax<T>(url, { headers, data, method: 'put' });
    }

    postByJson<T>(url: string, data?: any) {
        let headers = { "content-type": 'application/json' };
        return this.ajax<T>(url, { headers, data, method: 'post' });
    }

    deleteByJson<T>(url: string, data: any) {
        let headers = { "content-type": 'application/json' };
        return this.ajax<T>(url, { headers, data, method: 'delete' });
    }

    private isEncoded(uri: string) {
        try {
            uri = uri || '';
            return uri !== decodeURIComponent(uri);
        }
        catch (e) {
            return false
        }
    }

    get<T>(url: string, data?: any) {
        data = data || {};
        let params = "";
        for (let key in data) {
            if (data[key] == null)
                continue

            let value = `${data[key]}`
            if (!this.isEncoded(value)) {
                value = encodeURIComponent(value)
            }
            params = params ? `${params}&${key}=${value}` : `${key}=${value}`;
        }

        if (params) {
            url = `${url}?${params}`;
        }

        return this.ajax<T>(url, { method: 'get' })
    }

    put<T>(url: string, data?: any) {
        let headers = { "content-type": 'application/x-www-form-urlencoded' };
        return this.ajax<T>(url, { headers, data, method: 'put' });
    }

    post<T>(url: string, data?: any) {
        let headers = { "content-type": 'application/x-www-form-urlencoded' };
        return this.ajax<T>(url, { headers, data, method: 'post', });
    }

    delete<T>(url: string, data: any) {
        let headers = { "content-type": 'application/x-www-form-urlencoded' };
        return this.ajax<T>(url, { headers, data, method: 'delete' });
    }
}

export function formatData(data: any) {

    if (typeof data == "object") {
        for (let key in data) {
            data[key] = formatData(data[key]);
        }

        return data;
    }

    let datePattern = /\d{4}-\d{1,2}-\d{1,2}T\d{1,2}:\d{1,2}:\d{1,2}/;
    if (typeof data == "string" && datePattern.test(data)) {
        return new Date(data);
    }

    return data;
}

async function ajax<T>(url: string, options: RequestInit): Promise<T> {
    let response: any
    if (typeof window === 'undefined') {
        // 使用 global['require'] 而不是 require ，避免 webpack 处理 node-fetch
        response = await eval('require')('node-fetch')(url, options);
    }
    else {
        response = await fetch(url, options)
    }

    let responseText = response.text();
    let p: Promise<string>;
    if (typeof responseText == 'string') {
        p = new Promise<string>((reslove, reject) => {
            reslove(responseText);
        })
    }
    else {
        p = responseText as Promise<string>;
    }

    let text = await responseText;
    let textObject;
    let isJSONContextType = (response.headers.get('content-type') || '').indexOf('json') >= 0;
    if (isJSONContextType) {
        try {
            textObject = text ? JSON.parse(text) : {};
        }
        catch  {
            let err = errors.parseJSONFail(text);
            console.error(err);
            textObject = text;
        }
    }
    else {
        textObject = text;
    }

    if (response.status >= 300) {
        let err: Error & { method?: string | undefined } = new Error();
        err.method = options.method;
        err.name = `${response.status}`;
        err.message = typeof textObject == "string" ? textObject : (textObject.Message || textObject.message || '');
        err.message = err.message || response.statusText;

        throw err
    }

    textObject = formatData(textObject);
    return textObject;
}