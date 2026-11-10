"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merchantController = exports.MerchantController = void 0;
const merchant_service_js_1 = require("../services/merchant.service.js");
class MerchantController {
    async redirect(req, res) {
        const productId = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
        const outfitId = req.query.outfitId;
        const userId = req.user?.userId;
        const ipAddress = req.ip || req.socket.remoteAddress;
        const targetUrl = await merchant_service_js_1.merchantService.handleRedirect(productId, userId, outfitId, ipAddress);
        // Issue HTTP 302 Found redirect
        res.redirect(302, targetUrl);
    }
}
exports.MerchantController = MerchantController;
exports.merchantController = new MerchantController();
