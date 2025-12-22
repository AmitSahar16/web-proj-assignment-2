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
const post_1 = __importDefault(require("../models/post"));
const base_controller_1 = require("./base_controller");
class PostsController extends base_controller_1.BaseController {
    constructor() {
        super(post_1.default);
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
    updatePostById(req, res) {
        const _super = Object.create(null, {
            updateById: { get: () => super.updateById }
        });
        return __awaiter(this, void 0, void 0, function* () {
            req.body.user = req.user._id;
            yield _super.updateById.call(this, req, res);
        });
    }
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield this.model.findById(req.params.id).populate('user');
                res.send(post);
            }
            catch (err) {
                console.error('error while trying to get post by id');
                res.status(500).json({ message: err.message });
            }
        });
    }
    getPostsByMe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield this.model
                    .find({ user: req.user._id })
                    .sort({ createdAt: -1 })
                    .populate('user');
                res.send(posts);
            }
            catch (err) {
                console.error('error while trying to get posts by user id');
                res.status(500).json({ message: err.message });
            }
        });
    }
}
exports.default = new PostsController();
//# sourceMappingURL=posts_controller.js.map