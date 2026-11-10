"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiProvider = void 0;
const ai_interface_js_1 = require("../ai.interface.js");
const logger_js_1 = require("../../../utils/logger.js");
class GeminiProvider {
    apiKey;
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    async generateOutfitExplanation(context) {
        if (!this.apiKey) {
            throw new Error('Gemini API key is not configured');
        }
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
        const prompt = `You are a high-fashion editorial stylist. Return valid JSON only with keys: headline, editorialSummary, stylingTips (array of 3 strings), and colorStory. Outfit context: ${JSON.stringify(context)}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: 'application/json' },
                }),
            });
            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
            }
            const data = (await response.json());
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
            return ai_interface_js_1.StylingAdviceSchema.parse(JSON.parse(text));
        }
        catch (err) {
            logger_js_1.logger.error('Gemini styling explanation failed:', err);
            throw err;
        }
    }
}
exports.GeminiProvider = GeminiProvider;
