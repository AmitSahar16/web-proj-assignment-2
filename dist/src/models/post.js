"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    message: {
        type: String,
        required: false,
    },
    user: {
        type: String,
        required: true,
        ref: 'User',
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model('Post', postSchema, 'posts');
//# sourceMappingURL=post.js.map