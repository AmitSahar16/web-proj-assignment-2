"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
exports.default = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
    testTimeout: 10000,
    testMatch: ["**/?(*.)+(spec|test).ts"]
};
//# sourceMappingURL=jest.config.js.map