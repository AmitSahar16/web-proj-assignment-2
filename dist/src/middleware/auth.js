"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authUtils_1 = require("../utils/authUtils");
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
        if (!token) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }
        const decoded = (0, authUtils_1.verifyAccessToken)(token);
        req.user = { _id: decoded._id };
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
    }
};
exports.default = authMiddleware;
//# sourceMappingURL=auth.js.map