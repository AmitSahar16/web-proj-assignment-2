"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRefreshTokenFromHeader = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (payload) => {
    const ACCESS_TOKEN_SECRET = (process.env.ACCESS_TOKEN_SECRET || 'access-token-secret');
    const ACCESS_TOKEN_EXPIRY = (process.env.ACCESS_TOKEN_EXPIRY || '15m');
    const options = { expiresIn: ACCESS_TOKEN_EXPIRY };
    return jsonwebtoken_1.default.sign(payload, ACCESS_TOKEN_SECRET, options);
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    const REFRESH_TOKEN_SECRET = (process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret');
    const REFRESH_TOKEN_EXPIRY = (process.env.REFRESH_TOKEN_EXPIRY || '7d');
    const options = { expiresIn: REFRESH_TOKEN_EXPIRY };
    return jsonwebtoken_1.default.sign(payload, REFRESH_TOKEN_SECRET, options);
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    const ACCESS_TOKEN_SECRET = (process.env.ACCESS_TOKEN_SECRET || 'access-token-secret');
    return jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    const REFRESH_TOKEN_SECRET = (process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret');
    return jsonwebtoken_1.default.verify(token, REFRESH_TOKEN_SECRET);
};
exports.verifyRefreshToken = verifyRefreshToken;
const getRefreshTokenFromHeader = (headers) => {
    const authHeader = headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (!refreshToken) {
        console.error("user didn't add refresh token to the request");
        return null;
    }
    return refreshToken;
};
exports.getRefreshTokenFromHeader = getRefreshTokenFromHeader;
//# sourceMappingURL=authUtils.js.map