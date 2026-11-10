"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnthropicProvider = void 0;
const ai_interface_js_1 = require("../ai.interface.js");
const logger_js_1 = require("../../../utils/logger.js");
class AnthropicProvider {
    apiKey;
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    async generateOutfitExplanation(context) {
        if (!this.apiKey) {
            throw new Error('Anthropic API key is not configured');
        }
        const prompt = `You are a high-editorial fashion director for a luxury publication like SSENSE or Vogue.
Generate concise, sophisticated styling commentary for this outfit:
Context: ${JSON.stringify(context, null, 2)}

Respond with STRICT JSON format:
{
  "headline": "Short poetic editorial title",
  "editorialSummary": "2-3 sentences explaining silhouette balance and texture",
  "stylingTips": ["Tip 1", "Tip 2", "Tip 3"],
  "colorStory": "Brief description of the color palette harmony"
}`;
        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey,
                    'anthropic-version': '2023-06-01',
                },
                body: JSON.stringify({
                    model: 'claude-3-5-sonnet-20241022',
                    max_tokens: 600,
                    messages: [{ role: 'user', content: prompt }],
                }),
            });
            if (!response.ok) {
                throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
            }
            const data = (await response.json());
            const rawText = data.content?.[0]?.text || '{}';
            const parsed = JSON.parse(rawText.replace(/```json\n?|\n?```/g, '').trim());
            return ai_interface_js_1.StylingAdviceSchema.parse(parsed);
        }
        catch (err) {
            logger_js_1.logger.error('Anthropic styling explanation failed, falling back:', err);
            throw err;
        }
    }
}
exports.AnthropicProvider = AnthropicProvider;
