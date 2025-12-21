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
const user_1 = __importDefault(require("../models/user"));
const base_controller_1 = require("./base_controller");
class UsersController extends base_controller_1.BaseController {
    constructor() {
        super(user_1.default);
    }
    getUserById(req, res) {
        const _super = Object.create(null, {
            getById: { get: () => super.getById }
        });
        return __awaiter(this, void 0, void 0, function* () {
            req.params.id = req.user._id;
            yield _super.getById.call(this, req, res);
        });
    }
    updateUserById(req, res) {
        const _super = Object.create(null, {
            updateById: { get: () => super.updateById }
        });
        return __awaiter(this, void 0, void 0, function* () {
            req.params.id = req.user._id;
            yield _super.updateById.call(this, req, res);
        });
    }
}
exports.default = new UsersController();
//# sourceMappingURL=users_controller.js.map