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
const comment_1 = __importDefault(require("../models/comment"));
const post_1 = __importDefault(require("../models/post"));
const user_1 = __importDefault(require("../models/user"));
let app;
let accessToken = '';
let accessToken2 = '';
const user = {
    email: 'comment-test@user.test',
    password: '123456',
    username: 'commenttest',
};
const user2 = {
    email: 'comment-test2@user.test',
    password: '123456',
    username: 'commenttest2',
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = (yield (0, server_1.startServer)()).app;
    yield comment_1.default.deleteMany();
    yield post_1.default.deleteMany();
    yield user_1.default.deleteMany({ email: user.email });
    const response = yield (0, supertest_1.default)(app)
        .post('/auth/register')
        .send({
        username: user.username,
        email: user.email,
        password: user.password
    });
    user._id = response.body._id;
    post.user = user._id;
    const loginResponse = yield (0, supertest_1.default)(app).post('/auth/login').send({
        identifier: user.email,
        password: user.password
    });
    accessToken = loginResponse.body.accessToken;
    yield user_1.default.deleteMany({ email: user2.email });
    const response2 = yield (0, supertest_1.default)(app)
        .post('/auth/register')
        .send({
        username: user2.username,
        email: user2.email,
        password: user2.password
    });
    user2._id = response2.body._id;
    const loginResponse2 = yield (0, supertest_1.default)(app).post('/auth/login').send({
        identifier: user2.email,
        password: user2.password
    });
    accessToken2 = loginResponse2.body.accessToken;
    const postResponse = yield (0, supertest_1.default)(app)
        .post('/posts')
        .set('Authorization', 'Bearer ' + accessToken)
        .send({ message: 'Test post for comments' });
    post._id = postResponse.body._id;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
const post = {
    message: 'Test post for comments',
};
const comment = {
    text: 'This is a test comment',
};
describe('Comment tests', () => {
    test('Test POST comment - create comment', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/comments')
            .set('Authorization', 'Bearer ' + accessToken)
            .send({
            text: comment.text,
            post: post._id
        });
        comment._id = response.body._id;
        expect(response.statusCode).toBe(201);
        expect(response.body.text).toBe(comment.text);
        expect(response.body.post).toBe(post._id);
        expect(response.body.user).toBe(user._id);
        expect(response.body.createdAt).toBeDefined();
        expect(response.body.updatedAt).toBeDefined();
    }));
    test('Test POST comment - missing text', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/comments')
            .set('Authorization', 'Bearer ' + accessToken)
            .send({
            post: post._id
        });
        expect(response.statusCode).toBe(409);
    }));
    test('Test POST comment - missing post', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/comments')
            .set('Authorization', 'Bearer ' + accessToken)
            .send({
            text: 'Another comment'
        });
        expect(response.statusCode).toBe(409);
    }));
    test('Test POST comment - unauthorized (no token)', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/comments')
            .send({
            text: 'Unauthorized comment',
            post: post._id
        });
        expect(response.statusCode).toBe(401);
    }));
    test('Test POST comment - create second comment', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/comments')
            .set('Authorization', 'Bearer ' + accessToken2)
            .send({
            text: 'Second user comment',
            post: post._id
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.text).toBe('Second user comment');
        expect(response.body.user).toBe(user2._id);
    }));
    test('Test GET all comments', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get('/comments')
            .set('Authorization', 'Bearer ' + accessToken);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThanOrEqual(2);
    }));
    test('Test GET comment by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/comments/${comment._id}`)
            .set('Authorization', 'Bearer ' + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(comment._id);
        expect(response.body.text).toBe(comment.text);
        expect(response.body.post).toBe(post._id);
    }));
    test('Test GET comment by ID - unauthorized (no token)', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/comments/${comment._id}`);
        expect(response.statusCode).toBe(401);
    }));
    test('Test GET comments by post ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/posts/${post._id}/comments`)
            .set('Authorization', 'Bearer ' + accessToken);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThanOrEqual(2);
        // Verify comments have user populated
        if (response.body.length > 0) {
            expect(response.body[0].user).toBeDefined();
            if (typeof response.body[0].user === 'object') {
                expect(response.body[0].user.username).toBeDefined();
            }
        }
    }));
    test('Test PUT comment - update own comment', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put(`/comments/${comment._id}`)
            .set('Authorization', 'Bearer ' + accessToken)
            .send({
            text: 'Updated comment text'
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.text).toBe('Updated comment text');
        expect(response.body._id).toBe(comment._id);
    }));
    test('Test PUT comment - unauthorized (no token)', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put(`/comments/${comment._id}`)
            .send({
            text: 'Trying to update without auth'
        });
        expect(response.statusCode).toBe(401);
    }));
    test("Test PUT comment - forbidden (updating someone else's comment)", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put(`/comments/${comment._id}`)
            .set('Authorization', 'Bearer ' + accessToken2)
            .send({
            text: "Trying to update someone else's comment"
        });
        expect(response.statusCode).toBe(403);
    }));
    test("Test DELETE comment - forbidden (deleting someone else's comment)", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/comments/${comment._id}`)
            .set('Authorization', 'Bearer ' + accessToken2);
        expect(response.statusCode).toBe(403);
    }));
    test('Test DELETE comment - unauthorized (no token)', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/comments/${comment._id}`);
        expect(response.statusCode).toBe(401);
    }));
    test('Test DELETE comment - delete own comment', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/comments/${comment._id}`)
            .set('Authorization', 'Bearer ' + accessToken);
        expect(response.statusCode).toBe(200);
    }));
    test('Test GET comment by ID - not found after deletion', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/comments/${comment._id}`)
            .set('Authorization', 'Bearer ' + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeNull();
    }));
    test('Test DELETE comment - comment not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/comments/${comment._id}`)
            .set('Authorization', 'Bearer ' + accessToken);
        // Could be 200 with null or 404 depending on implementation
        expect([200, 404]).toContain(response.statusCode);
    }));
});
//# sourceMappingURL=comments.test.js.map