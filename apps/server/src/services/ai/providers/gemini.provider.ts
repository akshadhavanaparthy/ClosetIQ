import { IAIService, OutfitExplanationContext, StylingAdviceResult, StylingAdviceSchema } from '../ai.interface.js';
import { logger } from '../../../utils/logger.js';

export class GeminiProvider implements IAIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateOutfitExplanation(context: OutfitExplanationContext): Promise<StylingAdviceResult> {
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

      const data = (await response.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      return StylingAdviceSchema.parse(JSON.parse(text));
    } catch (err) {
      logger.error('Gemini styling explanation failed:', err);
      throw err;
    }
  }
}
