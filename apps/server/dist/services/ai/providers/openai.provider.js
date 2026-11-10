"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIProvider = void 0;
const ai_interface_js_1 = require("../ai.interface.js");
const logger_js_1 = require("../../../utils/logger.js");
class OpenAIProvider {
    apiKey;
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    async generateOutfitExplanation(context) {
        if (!this.apiKey) {
            throw new Error('OpenAI API key is not configured');
        }
        const systemPrompt = 'You are a luxury editorial fashion stylist. Output strictly JSON matching the required schema.';
        const userPrompt = `Provide styling critique for this ensemble: ${JSON.stringify(context, null, 2)}`;
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    response_format: { type: 'json_object' },
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt },
                    ],
                }),
            });
            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
            }
            const data = (await response.json());
            const rawText = data.choices?.[0]?.message?.content || '{}';
            return ai_interface_js_1.StylingAdviceSchema.parse(JSON.parse(rawText));
        }
        catch (err) {
            logger_js_1.logger.error('OpenAI styling explanation failed:', err);
            throw err;
        }
    }
}
exports.OpenAIProvider = OpenAIProvider;
