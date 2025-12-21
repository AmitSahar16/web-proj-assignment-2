"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const express_1 = __importDefault(require("express"));
const express_2 = require("./config/express");
const mongo_1 = require("./config/mongo");
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const port = Number(process.env.PORT) || 3000;
    const app = (0, express_1.default)();
    (0, express_2.configExpress)(app, port);
    yield (0, mongo_1.configMongo)();
    return { app, port };
});
exports.startServer = startServer;
//# sourceMappingURL=server.js.map