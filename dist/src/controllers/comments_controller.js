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
const comment_1 = __importDefault(require("../models/comment"));
const base_controller_1 = require("./base_controller");
class CommentsController extends base_controller_1.BaseController {
    constructor() {
        super(comment_1.default);
    }
    create(req, res) {
        const _super = Object.create(null, {
            post: { get: () => super.post }
        });
        return __awaiter(this, void 0, void 0, function* () {
            req.body.user = req.user._id;
            yield _super.post.call(this, req, res);
        });
    }
    createCommentForPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield this.model.create({
                    text: req.body.text,
                    post: req.params.postId,
                    user: req.user._id
                });
                const populatedComment = yield comment.populate('user', 'username email');
                res.status(201).send(populatedComment);
            }
            catch (err) {
                console.error('error while adding comment to a post');
                res.status(409).json({ message: err.message });
            }
        });
    }
    getCommentsByPostId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comments = yield this.model
                    .find({ post: req.params.postId })
                    .sort({ createdAt: -1 })
                    .populate('user', 'username email');
                res.send(comments);
            }
            catch (err) {
                console.error('error while trying to get comments by post id');
                res.status(500).json({ message: err.message });
            }
        });
    }
    updateCommentById(req, res) {
        const _super = Object.create(null, {
            updateById: { get: () => super.updateById }
        });
        return __awaiter(this, void 0, void 0, function* () {
            req.body.user = req.user._id;
            yield _super.updateById.call(this, req, res);
        });
    }
}
exports.default = new CommentsController();
//# sourceMappingURL=comments_controller.js.map