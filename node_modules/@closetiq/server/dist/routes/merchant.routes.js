"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const merchant_controller_js_1 = require("../controllers/merchant.controller.js");
const authenticate_js_1 = require("../middleware/authenticate.js");
const router = (0, express_1.Router)();
router.get('/redirect/:productId', authenticate_js_1.optionalAuthenticate, (req, res, next) => merchant_controller_js_1.merchantController.redirect(req, res).catch(next));
exports.default = router;
