"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileController = exports.ProfileController = void 0;
const profile_service_js_1 = require("../services/profile.service.js");
const errors_js_1 = require("../utils/errors.js");
class ProfileController {
    async getMe(req, res) {
        if (!req.user)
            throw new errors_js_1.UnauthorizedError();
        const profile = await profile_service_js_1.profileService.getProfile(req.user.userId);
        res.json({
            success: true,
            data: profile,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    async updateMe(req, res) {
        if (!req.user)
            throw new errors_js_1.UnauthorizedError();
        const profile = await profile_service_js_1.profileService.updateProfile(req.user.userId, req.body);
        res.json({
            success: true,
            data: profile,
            meta: { timestamp: new Date().toISOString() },
        });
    }
}
exports.ProfileController = ProfileController;
exports.profileController = new ProfileController();
