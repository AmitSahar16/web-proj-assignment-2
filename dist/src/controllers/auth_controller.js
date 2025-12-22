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
const bcrypt_1 = __importDefault(require("bcrypt"));
const authUtils_1 = require("../utils/authUtils");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
        console.error('missing one of the following: email, password, username');
        return res
            .status(400)
            .send('missing one of the following: email, password, username');
    }
    try {
        const existingUser = yield user_1.default.findOne({ email: email });
        if (existingUser) {
            console.error('email already exists');
            return res.status(409).send('email already exists');
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const encryptedPassword = yield bcrypt_1.default.hash(password, salt);
        const user = yield user_1.default.create({
            email: email,
            password: encryptedPassword,
            username: username,
        });
        console.info('new user added to db');
        return res.status(201).send(user);
    }
    catch (err) {
        console.error('error while trying to register');
        return res.status(500).send('error while trying to register');
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
        console.error('missing identifier or password');
        return res.status(400).send('missing identifier or password');
    }
    try {
        const isEmail = identifier.includes('@');
        const query = isEmail ? { email: identifier } : { username: identifier };
        const user = yield user_1.default.findOne(query);
        if (!user) {
            console.error('user not found');
            return res.status(401).send('invalid credentials');
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            console.error('password is incorrect');
            return res.status(401).send('invalid credentials');
        }
        const accessToken = (0, authUtils_1.generateAccessToken)({ _id: user._id });
        const refreshToken = (0, authUtils_1.generateRefreshToken)({ _id: user._id });
        if (!user.refreshTokens) {
            user.refreshTokens = [refreshToken];
        }
        else {
            user.refreshTokens.push(refreshToken);
        }
        yield user.save();
        return res.status(200).send({
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    }
    catch (err) {
        console.error('error while trying to login');
        return res.status(500).send('error while trying to login');
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = (0, authUtils_1.getRefreshTokenFromHeader)(req.headers);
    if (!refreshToken) {
        return res.sendStatus(401);
    }
    try {
        const tokenPayload = (0, authUtils_1.verifyRefreshToken)(refreshToken);
        const user = yield user_1.default.findOne(tokenPayload);
        if (!user) {
            return res.sendStatus(401);
        }
        if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
            user.refreshTokens = [];
            yield user.save();
            return res.sendStatus(401);
        }
        else {
            user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
            yield user.save();
            return res.sendStatus(200);
        }
    }
    catch (err) {
        console.error('error while trying to logout', err);
        return res.status(500).send('error while trying to logout');
    }
});
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = (0, authUtils_1.getRefreshTokenFromHeader)(req.headers);
    if (!refreshToken) {
        console.error('No refresh token provided');
        return res.sendStatus(401);
    }
    try {
        const tokenPayload = (0, authUtils_1.verifyRefreshToken)(refreshToken);
        const user = yield user_1.default.findById(tokenPayload._id);
        if (!user) {
            console.error('User not found for refresh token');
            return res.sendStatus(401);
        }
        if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
            console.error('Refresh token not found in user tokens array');
            user.refreshTokens = [];
            yield user.save();
            return res.sendStatus(401);
        }
        const accessToken = (0, authUtils_1.generateAccessToken)(tokenPayload);
        const newRefreshToken = (0, authUtils_1.generateRefreshToken)(tokenPayload);
        user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
        user.refreshTokens.push(newRefreshToken);
        yield user.save();
        return res.status(200).send({
            accessToken: accessToken,
            refreshToken: newRefreshToken,
        });
    }
    catch (err) {
        console.error('error while trying to refresh', err);
        return res.status(500).send('error while trying to refresh');
    }
});
exports.default = {
    register,
    login,
    logout,
    refresh,
};
//# sourceMappingURL=auth_controller.js.map