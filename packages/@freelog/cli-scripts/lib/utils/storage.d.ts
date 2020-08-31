interface IKeyValue {
    [key: string]: any;
}
export declare function setStorage(keyValue?: IKeyValue): void;
export declare function getStorage(): IKeyValue;
export {};
