import { Callback1 } from "./callback";
export interface ServiceConstructor<T> {
    new (): T;
}
export declare type AjaxOptions = {
    data?: any;
    headers?: {
        [key: string]: string;
    };
    method?: string;
};
export interface IService {
    error: Callback1<Service, Error>;
}
export declare class Service implements IService {
    error: Callback1<Service, Error>;
    static settings: {
        ajaxTimeout: number;
    };
    static headers: AjaxOptions["headers"];
    constructor(handleError?: (error: Error, sender: Service) => void);
    ajax<T>(url: string, options?: AjaxOptions): Promise<T | null>;
    /**
     * 创建服务
     * @param type 服务类型
     */
    createService<T extends Service>(type?: ServiceConstructor<T>): T;
    getByJson<T>(url: string, data?: any): Promise<T>;
    putByJson<T>(url: string, data?: any): Promise<T>;
    postByJson<T>(url: string, data?: any): Promise<T>;
    deleteByJson<T>(url: string, data: any): Promise<T>;
    private isEncoded;
    get<T>(url: string, data?: any): Promise<T>;
    put<T>(url: string, data?: any): Promise<T>;
    post<T>(url: string, data?: any): Promise<T>;
    delete<T>(url: string, data: any): Promise<T>;
}
export declare function formatData(data: any): any;
