"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = authorize;
const errors_js_1 = require("../utils/errors.js");
function authorize(...allowedRoles) {
    return (req, _res, next) => {
        if (!req.user) {
            throw new errors_js_1.UnauthorizedError('User not authenticated');
        }
        if (!allowedRoles.includes(req.user.role)) {
            throw new errors_js_1.ForbiddenError(`Access denied. Role ${req.user.role} does not have required permissions.`);
        }
        next();
    };
}
