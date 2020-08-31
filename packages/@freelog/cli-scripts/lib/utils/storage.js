"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStorage = exports.setStorage = void 0;
let storage = {};
function setStorage(keyValue = {}) {
    storage = Object.assign(Object.assign({}, storage), keyValue);
}
exports.setStorage = setStorage;
function getStorage() {
    return Object.assign({}, storage);
}
exports.getStorage = getStorage;
