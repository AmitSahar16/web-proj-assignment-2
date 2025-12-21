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
const post_1 = __importDefault(require("../models/post"));
const user_1 = __importDefault(require("../models/user"));
let app;
let accessToken = '';
const user = {
    email: 'test@user.test',
    password: '123456',
    username: 'test',
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = (yield (0, server_1.startServer)()).app;
    yield post_1.default.deleteMany();
    yield user_1.default.deleteMany({ email: user.email });
    const response = yield (0, supertest_1.default)(app)
        .post('/auth/register')
        .field('username', user.username)
        .field('email', user.email)
        .field('password', user.password);
    user._id = response.body._id;
    post.user = user._id;
    const response2 = yield (0, supertest_1.default)(app).post('/auth/login').send({
        identifier: user.email,
        password: user.password
    });
    accessToken = response2.body.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
const post = {
    message: 'description1',
    user: user._id,
};
describe('post tests', () => {
    test('TEST POST post', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/posts')
            .set('Authorization', 'Bearer ' + accessToken)
            .field('user', post.user)
            .field('message', post.message);
        post._id = response.body._id;
        expect(response.statusCode).toBe(201);
        expect(response.body.user).toBe(user._id);
        expect(response.body.message).toBe(post.message);
    }));
    test('Test GET posts', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/posts');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(2);
    }));
    test('Test GET post by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/posts/${post._id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.user._id).toBe(user._id);
        expect(response.body.message).toBe(post.message);
    }));
    test('TEST GET posts of me', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get('/posts/user/me')
            .set('Authorization', 'Bearer ' + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(2);
    }));
    test('Test PUT post', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put(`/posts/${post._id}`)
            .set('Authorization', 'Bearer ' + accessToken)
            .send({ message: 'my post' });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('my post');
    }));
    test('Test DELETE post', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/posts/${post._id}`)
            .set('Authorization', 'Bearer ' + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(post._id);
    }));
});
//# sourceMappingURL=posts.test.js.map