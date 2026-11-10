import { IAIService, OutfitExplanationContext, StylingAdviceResult, StylingAdviceSchema } from '../ai.interface.js';
import { logger } from '../../../utils/logger.js';

export class OpenAIProvider implements IAIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateOutfitExplanation(context: OutfitExplanationContext): Promise<StylingAdviceResult> {
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

      const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const rawText = data.choices?.[0]?.message?.content || '{}';
      return StylingAdviceSchema.parse(JSON.parse(rawText));
    } catch (err) {
      logger.error('OpenAI styling explanation failed:', err);
      throw err;
    }
  }
}
