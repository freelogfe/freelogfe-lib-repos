interface IKeyValue {
  [key: string]: any;
}

let storage: IKeyValue = {};

export function setStorage(keyValue: IKeyValue = {}): void {
  storage = {
    ...storage,
    ...keyValue,
  };
}

export function getStorage(): IKeyValue {
  return {
    ...storage,
  };
}

