"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configExpress = void 0;
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("../routes"));
const swagger_1 = require("./swagger");
const express_1 = __importDefault(require("express"));
const configExpress = (app, port) => {
    app.use((0, cors_1.default)());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.json());
    app.use('/', routes_1.default);
    (0, swagger_1.configSwagger)(app, port);
};
exports.configExpress = configExpress;
//# sourceMappingURL=express.js.map