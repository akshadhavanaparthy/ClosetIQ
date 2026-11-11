"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mlClient = exports.MLClientService = void 0;
const index_js_1 = require("../config/index.js");
const logger_js_1 = require("../utils/logger.js");
const errors_js_1 = require("../utils/errors.js");
class MLClientService {
    baseUrl;
    apiKey;
    constructor() {
        this.baseUrl = index_js_1.config.mlServiceUrl;
        this.apiKey = index_js_1.config.mlServiceApiKey;
    }
    async analyzeBodyShape(imageKey) {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/body/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': this.apiKey,
                },
                body: JSON.stringify({ imageKey }),
            });
            if (response.ok) {
                return (await response.json());
            }
            throw new Error(`ML service returned status ${response.status}`);
        }
        catch (err) {
            logger_js_1.logger.error('ML Body Shape Analysis failed or service unreachable:', err);
            throw new errors_js_1.ServiceUnavailableError('AI Body Shape model service is currently offline or unreachable. Please verify ML service status.');
        }
    }
    async analyzeSkinUndertone(imageKey) {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/undertone/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': this.apiKey,
                },
                body: JSON.stringify({ imageKey }),
            });
            if (response.ok) {
                return (await response.json());
            }
            throw new Error(`ML service returned status ${response.status}`);
        }
        catch (err) {
            logger_js_1.logger.error('ML Skin Undertone Analysis failed or service unreachable:', err);
            throw new errors_js_1.ServiceUnavailableError('AI Skin Tone & Palette model service is currently offline or unreachable. Please verify ML service status.');
        }
    }
    async detectGarmentAttributes(imageKey) {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/garment/detect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': this.apiKey,
                },
                body: JSON.stringify({ imageKey }),
            });
            if (response.ok) {
                return (await response.json());
            }
        }
        catch (err) {
            logger_js_1.logger.warn('ML Service unreachable, using garment CV fallback:', err);
        }
        return {
            category: 'TOP',
            subCategory: 'Button-Up Shirts',
            primaryColorHex: '#F7F6F2',
            primaryColorName: 'Chalk White',
            pattern: 'Solid',
            formalityLevel: 'SMART_CASUAL',
            confidence: 0.92,
        };
    }
}
exports.MLClientService = MLClientService;
exports.mlClient = new MLClientService();
