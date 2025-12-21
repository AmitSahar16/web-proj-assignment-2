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
exports.BaseController = void 0;
class BaseController {
    constructor(model) {
        this.model = model;
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.query.name) {
                    const entities = yield this.model.find({ name: req.query.name });
                    res.send(entities);
                }
                else {
                    const entities = yield this.model.find();
                    res.send(entities);
                }
            }
            catch (err) {
                console.error(`error get all ${this.model.modelName}`, err);
                res.status(500).json({ message: err.message });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const entity = yield this.model.findById(req.params.id);
                res.send(entity);
            }
            catch (err) {
                console.error(`error get by id ${this.model.modelName}`, err);
                res.status(500).json({ message: err.message });
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const entity = yield this.model.create(req.body);
                res.status(201).send(entity);
            }
            catch (err) {
                console.error(`error post ${this.model.modelName}`, err);
                res.status(409).json({ message: err.message });
            }
        });
    }
    updateById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const entity = yield this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
                res.send(entity);
            }
            catch (err) {
                console.error(`error update ${this.model.modelName}`, err);
                res.status(409).json({ message: err.message });
            }
        });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const entity = yield this.model.findByIdAndDelete(req.params.id);
                res.send(entity);
            }
            catch (err) {
                console.error(`error delete ${this.model.modelName}`, err);
                res.status(409).json({ message: err.message });
            }
        });
    }
}
exports.BaseController = BaseController;
const createController = (model) => {
    return new BaseController(model);
};
exports.default = createController;
//# sourceMappingURL=base_controller.js.map