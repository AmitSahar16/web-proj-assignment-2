"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./auth_route"));
const users_route_1 = __importDefault(require("./users_route"));
const posts_route_1 = __importDefault(require("./posts_route"));
const comments_route_1 = __importDefault(require("./comments_route"));
const router = express_1.default.Router();
router.use('/auth', auth_route_1.default);
router.use('/users', users_route_1.default);
router.use('/posts', posts_route_1.default);
router.use('/comments', comments_route_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map