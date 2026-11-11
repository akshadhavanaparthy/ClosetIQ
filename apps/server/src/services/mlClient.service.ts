import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { BodyShape, SeasonalPalette, Undertone } from '@closetiq/shared-types';

import { ServiceUnavailableError } from '../utils/errors.js';

export interface MLBodyAnalysisResult {
  shoulderHipRatio: number;
  waistHipRatio: number;
  torsoLegRatio: number;
  detectedBodyShape: BodyShape;
  confidenceScore: number;
}

export interface MLUndertoneResult {
  skinLabL: number;
  skinLabA: number;
  skinLabB: number;
  itaAngle: number;
  detectedUndertone: Undertone;
  detectedPalette: SeasonalPalette;
  confidenceScore: number;
}

export class MLClientService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = config.mlServiceUrl;
    this.apiKey = config.mlServiceApiKey;
  }

  async analyzeBodyShape(imageKey: string): Promise<MLBodyAnalysisResult> {
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
        return (await response.json()) as MLBodyAnalysisResult;
      }
      throw new Error(`ML service returned status ${response.status}`);
    } catch (err: any) {
      logger.error('ML Body Shape Analysis failed or service unreachable:', err);
      throw new ServiceUnavailableError('AI Body Shape model service is currently offline or unreachable. Please verify ML service status.');
    }
  }

  async analyzeSkinUndertone(imageKey: string): Promise<MLUndertoneResult> {
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
        return (await response.json()) as MLUndertoneResult;
      }
      throw new Error(`ML service returned status ${response.status}`);
    } catch (err: any) {
      logger.error('ML Skin Undertone Analysis failed or service unreachable:', err);
      throw new ServiceUnavailableError('AI Skin Tone & Palette model service is currently offline or unreachable. Please verify ML service status.');
    }
  }

}

export const mlClient = new MLClientService();
