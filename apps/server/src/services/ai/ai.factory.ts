import { config } from '../../config/index.js';
import { IAIService } from './ai.interface.js';
import { MockAiProvider } from './providers/mock.provider.js';
import { AnthropicProvider } from './providers/anthropic.provider.js';
import { OpenAIProvider } from './providers/openai.provider.js';
import { GeminiProvider } from './providers/gemini.provider.js';

export class AIFactory {
  private static instance: IAIService;

  public static getProvider(): IAIService {
    if (this.instance) {
      return this.instance;
    }

    switch (config.aiProvider) {
      case 'ANTHROPIC':
        this.instance = config.anthropicApiKey
          ? new AnthropicProvider(config.anthropicApiKey)
          : new MockAiProvider();
        break;
      case 'OPENAI':
        this.instance = config.openaiApiKey
          ? new OpenAIProvider(config.openaiApiKey)
          : new MockAiProvider();
        break;
      case 'GEMINI':
        this.instance = config.geminiApiKey
          ? new GeminiProvider(config.geminiApiKey)
          : new MockAiProvider();
        break;
      default:
        this.instance = new MockAiProvider();
        break;
    }

    return this.instance;
  }
}
