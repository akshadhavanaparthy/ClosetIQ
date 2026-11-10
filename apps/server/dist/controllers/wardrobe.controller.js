"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wardrobeController = exports.WardrobeController = void 0;
const wardrobe_service_js_1 = require("../services/wardrobe.service.js");
const errors_js_1 = require("../utils/errors.js");
class WardrobeController {
    async getItems(req, res) {
        if (!req.user)
            throw new errors_js_1.UnauthorizedError();
        const result = await wardrobe_service_js_1.wardrobeService.getItems(req.user.userId, req.query);
        res.json({
            success: true,
            data: result.items,
            meta: {
                totalCount: result.total,
                page: Number(req.query.page || 1),
                pageSize: Number(req.query.pageSize || 20),
                timestamp: new Date().toISOString(),
            },
        });
    }
    async createItem(req, res) {
        if (!req.user)
            throw new errors_js_1.UnauthorizedError();
        const item = await wardrobe_service_js_1.wardrobeService.createItem(req.user.userId, req.body);
        res.status(201).json({
            success: true,
            data: item,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    async getItemById(req, res) {
        if (!req.user)
            throw new errors_js_1.UnauthorizedError();
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const item = await wardrobe_service_js_1.wardrobeService.getItemById(req.user.userId, id);
        res.json({
            success: true,
            data: item,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    async updateItem(req, res) {
        if (!req.user)
            throw new errors_js_1.UnauthorizedError();
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const item = await wardrobe_service_js_1.wardrobeService.updateItem(req.user.userId, id, req.body);
        res.json({
            success: true,
            data: item,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    async deleteItem(req, res) {
        if (!req.user)
            throw new errors_js_1.UnauthorizedError();
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        await wardrobe_service_js_1.wardrobeService.deleteItem(req.user.userId, id);
        res.json({
            success: true,
            data: { message: 'Item archived successfully' },
            meta: { timestamp: new Date().toISOString() },
        });
    }
}
exports.WardrobeController = WardrobeController;
exports.wardrobeController = new WardrobeController();
