"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.password = exports.objectId = void 0;
const objectId = (value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        return helpers.message({
            custom: '"{{#label}}" must be a valid mongo id',
        });
    }
    return value;
};
exports.objectId = objectId;
const password = (value, helpers) => {
    if (value.length < 8) {
        return helpers.message({
            custom: "password must be at lease 8 characters",
        });
    }
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        return helpers.message({
            custom: "password must contain at least 1 letter and 1 number",
        });
    }
    return value;
};
exports.password = password;
// export const phone = (value: string, helpers: CustomHelpers) => {};
