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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initApp = void 0;
const server_1 = require("./server");
const initApp = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { app, port } = yield (0, server_1.startServer)();
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
            console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
});
exports.initApp = initApp;
(0, exports.initApp)();
//# sourceMappingURL=app.js.map