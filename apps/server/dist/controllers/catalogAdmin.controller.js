"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catalogAdminController = exports.CatalogAdminController = void 0;
const catalogAdmin_service_js_1 = require("../services/catalogAdmin.service.js");
const errors_js_1 = require("../utils/errors.js");
class CatalogAdminController {
    async listMerchants(_req, res) {
        const merchants = await catalogAdmin_service_js_1.catalogAdminService.listMerchants();
        res.json({
            success: true,
            data: merchants,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    async createMerchant(req, res) {
        if (!req.user)
            throw new errors_js_1.UnauthorizedError();
        const merchant = await catalogAdmin_service_js_1.catalogAdminService.createMerchant(req.body);
        res.status(201).json({
            success: true,
            data: merchant,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    async listProducts(_req, res) {
        const products = await catalogAdmin_service_js_1.catalogAdminService.listProducts();
        res.json({
            success: true,
            data: products,
            meta: { totalCount: products.length, timestamp: new Date().toISOString() },
        });
    }
    async createProduct(req, res) {
        if (!req.user)
            throw new errors_js_1.UnauthorizedError();
        const product = await catalogAdmin_service_js_1.catalogAdminService.createProduct(req.body);
        res.status(201).json({
            success: true,
            data: product,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    async updateProduct(req, res) {
        const productId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!productId)
            throw new errors_js_1.NotFoundError('Product identifier is required.');
        const product = await catalogAdmin_service_js_1.catalogAdminService.updateProduct(productId, req.body);
        res.json({
            success: true,
            data: product,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    async verifyProduct(req, res) {
        const productId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!productId)
            throw new errors_js_1.NotFoundError('Product identifier is required.');
        const product = await catalogAdmin_service_js_1.catalogAdminService.verifyManualProduct(productId, req.body.inStock);
        res.json({
            success: true,
            data: product,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    async markUnavailable(req, res) {
        const productId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!productId)
            throw new errors_js_1.NotFoundError('Product identifier is required.');
        const product = await catalogAdmin_service_js_1.catalogAdminService.setProductUnavailable(productId);
        res.json({
            success: true,
            data: product,
            meta: { timestamp: new Date().toISOString() },
        });
    }
}
exports.CatalogAdminController = CatalogAdminController;
exports.catalogAdminController = new CatalogAdminController();
