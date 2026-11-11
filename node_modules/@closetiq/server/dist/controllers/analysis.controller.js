"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analysisController = exports.AnalysisController = void 0;
const analysis_service_js_1 = require("../services/analysis.service.js");
const errors_js_1 = require("../utils/errors.js");
class AnalysisController {
    async uploadPhoto(req, res) {
        if (!req.user)
            throw new errors_js_1.UnauthorizedError();
        const { imageData, fileName, category } = req.body;
        if (!imageData) {
            res.status(400).json({ success: false, error: { code: 'NO_IMAGE_DATA', message: 'imageData is required' } });
            return;
        }
        const result = await analysis_service_js_1.analysisService.saveUploadedImage(req.user.userId, imageData, fileName, category);
        res.json({
            success: true,
            data: result,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    async getUploadTicket(req, res) {
        if (!req.user)
            throw new errors_js_1.UnauthorizedError();
        const category = (req.body.category || 'BODY_ANALYSIS');
        const fileName = req.body.fileName || 'upload.jpg';
        const ticket = await analysis_service_js_1.analysisService.getUploadTicket(req.user.userId, category, fileName);
        res.json({
            success: true,
            data: ticket,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    async processBody(req, res) {
        if (!req.user)
            throw new errors_js_1.UnauthorizedError();
        const result = await analysis_service_js_1.analysisService.processBodyPhoto(req.user.userId, req.body.imageKey);
        res.json({
            success: true,
            data: result,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    async processPortrait(req, res) {
        if (!req.user)
            throw new errors_js_1.UnauthorizedError();
        const result = await analysis_service_js_1.analysisService.processPortraitPhoto(req.user.userId, req.body.imageKey);
        res.json({
            success: true,
            data: result,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    async getLatest(req, res) {
        if (!req.user)
            throw new errors_js_1.UnauthorizedError();
        const result = await analysis_service_js_1.analysisService.getLatestAnalysis(req.user.userId);
        res.json({
            success: true,
            data: result,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    async confirm(req, res) {
        if (!req.user)
            throw new errors_js_1.UnauthorizedError();
        await analysis_service_js_1.analysisService.confirmAnalysis(req.user.userId, req.body);
        res.json({
            success: true,
            data: { message: 'Body shape and undertone confirmed successfully' },
            meta: { timestamp: new Date().toISOString() },
        });
    }
}
exports.AnalysisController = AnalysisController;
exports.analysisController = new AnalysisController();
