"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIFactory = void 0;
const index_js_1 = require("../../config/index.js");
const mock_provider_js_1 = require("./providers/mock.provider.js");
const anthropic_provider_js_1 = require("./providers/anthropic.provider.js");
const openai_provider_js_1 = require("./providers/openai.provider.js");
const gemini_provider_js_1 = require("./providers/gemini.provider.js");
class AIFactory {
    static instance;
    static getProvider() {
        if (this.instance) {
            return this.instance;
        }
        switch (index_js_1.config.aiProvider) {
            case 'ANTHROPIC':
                this.instance = index_js_1.config.anthropicApiKey
                    ? new anthropic_provider_js_1.AnthropicProvider(index_js_1.config.anthropicApiKey)
                    : new mock_provider_js_1.MockAiProvider();
                break;
            case 'OPENAI':
                this.instance = index_js_1.config.openaiApiKey
                    ? new openai_provider_js_1.OpenAIProvider(index_js_1.config.openaiApiKey)
                    : new mock_provider_js_1.MockAiProvider();
                break;
            case 'GEMINI':
                this.instance = index_js_1.config.geminiApiKey
                    ? new gemini_provider_js_1.GeminiProvider(index_js_1.config.geminiApiKey)
                    : new mock_provider_js_1.MockAiProvider();
                break;
            default:
                this.instance = new mock_provider_js_1.MockAiProvider();
                break;
        }
        return this.instance;
    }
}
exports.AIFactory = AIFactory;
