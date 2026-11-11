"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discoveryController = exports.DiscoveryController = void 0;
const discovery_service_js_1 = require("../services/discovery.service.js");
const errors_js_1 = require("../utils/errors.js");
class DiscoveryController {
    async search(req, res) {
        const result = await discovery_service_js_1.discoveryService.searchProducts(req.query);
        res.json({
            success: true,
            data: result.products,
            meta: {
                totalCount: result.total,
                page: Number(req.query.page || 1),
                pageSize: Number(req.query.pageSize || 20),
                timestamp: new Date().toISOString(),
            },
        });
    }
    async getBrands(_req, res) {
        const brands = await discovery_service_js_1.discoveryService.getBrands();
        res.json({
            success: true,
            data: brands,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    async getById(req, res) {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const product = await discovery_service_js_1.discoveryService.getProductById(id);
        res.json({
            success: true,
            data: product,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    async getWishlist(req, res) {
        if (!req.user)
            throw new errors_js_1.UnauthorizedError();
        const wishlist = await discovery_service_js_1.discoveryService.getWishlist(req.user.userId);
        res.json({
            success: true,
            data: wishlist,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    async addToWishlist(req, res) {
        if (!req.user)
            throw new errors_js_1.UnauthorizedError();
        const productId = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
        await discovery_service_js_1.discoveryService.addToWishlist(req.user.userId, productId);
        res.status(201).json({
            success: true,
            data: { message: 'Added to wishlist' },
            meta: { timestamp: new Date().toISOString() },
        });
    }
    async removeFromWishlist(req, res) {
        if (!req.user)
            throw new errors_js_1.UnauthorizedError();
        const productId = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
        await discovery_service_js_1.discoveryService.removeFromWishlist(req.user.userId, productId);
        res.json({
            success: true,
            data: { message: 'Removed from wishlist' },
            meta: { timestamp: new Date().toISOString() },
        });
    }
}
exports.DiscoveryController = DiscoveryController;
exports.discoveryController = new DiscoveryController();
