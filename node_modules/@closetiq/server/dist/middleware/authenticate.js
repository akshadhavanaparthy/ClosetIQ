"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.optionalAuthenticate = optionalAuthenticate;
const jwt_js_1 = require("../utils/jwt.js");
const errors_js_1 = require("../utils/errors.js");
function authenticate(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new errors_js_1.UnauthorizedError('Authorization header missing or invalid format (Bearer token required)');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new errors_js_1.UnauthorizedError('Token not provided');
    }
    const payload = (0, jwt_js_1.verifyAccessToken)(token);
    req.user = payload;
    next();
}
function optionalAuthenticate(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        if (token) {
            try {
                req.user = (0, jwt_js_1.verifyAccessToken)(token);
            }
            catch {
                // Ignore failure for optional auth
            }
        }
    }
    next();
}
