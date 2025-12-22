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
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = require("../server");
const user_1 = __importDefault(require("../models/user"));
let app;
let accessToken;
const user = {
    email: 'test@user.test',
    password: '123456',
    username: 'test',
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = (yield (0, server_1.startServer)()).app;
    yield user_1.default.deleteMany();
    user_1.default.deleteMany({ email: user.email });
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe('User tests', () => {
    const addUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/auth/register')
            .send({
            username: user.username,
            email: user.email,
            password: user.password
        });
        user._id = response.body._id;
        expect(response.statusCode).toBe(201);
        const response2 = yield (0, supertest_1.default)(app).post('/auth/login').send({
            identifier: user.email,
            password: user.password
        });
        accessToken = response2.body.accessToken;
        expect(response2.statusCode).toBe(200);
    });
    test('Test Get Me - not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/users/me');
        expect(response.statusCode).toBe(401);
    }));
    test('Test Post User', () => __awaiter(void 0, void 0, void 0, function* () {
        yield addUser(user);
    }));
    test('Test Get Me - authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get('/users/me')
            .set('Authorization', 'Bearer ' + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body.username).toBe(user.username);
        expect(response.body._id).toBe(user._id);
        expect(response.body.email).toBe(user.email);
    }));
    test('Test Post duplicate User', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/auth/register').send(user);
        expect(response.statusCode).toBe(409);
    }));
    test('Test PUT /users', () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedUser = Object.assign(Object.assign({}, user), { username: 'User123' });
        const response = yield (0, supertest_1.default)(app)
            .put('/users')
            .send({
            email: updatedUser.email,
            password: updatedUser.password,
            username: updatedUser.username
        })
            .set('Authorization', 'Bearer ' + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body.username).toBe(updatedUser.username);
    }));
});
//# sourceMappingURL=users.test.js.map