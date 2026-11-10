"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockAiProvider = void 0;
class MockAiProvider {
    async generateOutfitExplanation(context) {
        const { outfit, scoringBreakdown, userProfile } = context;
        const topItem = outfit.items.find((i) => i.category === 'TOP' || i.category === 'OUTERWEAR');
        const bottomItem = outfit.items.find((i) => i.category === 'BOTTOM');
        const topName = topItem?.name || 'Architectural Layer';
        const bottomName = bottomItem?.name || 'Tailored Foundation';
        return {
            headline: `The New Classic: Modern Poise in ${outfit.formality.toLowerCase().replace('_', ' ')}`,
            editorialSummary: `This ensemble pairs ${topName} with ${bottomName} to construct an intentional, sculpted profile. Operating at a deterministic synergy score of ${scoringBreakdown.overallScore}/100, the look anchors itself on ${scoringBreakdown.primaryColorHarmonies.toLowerCase()} while effortlessly honoring your ${userProfile.confirmedBodyShape.toLowerCase()} body architecture.`,
            stylingTips: [
                `Half-tuck or drape the upper layer loosely to honor the ${userProfile.confirmedBodyShape.toLowerCase()} waistline.`,
                `Complement the look with minimalist metallic accents tuned for your ${userProfile.confirmedUndertone.toLowerCase()} undertone.`,
                `Maintain the tactile contrast between structured suiting and fluid drape for an effortless gallery-worthy finish.`,
            ],
            colorStory: `Curated for your ${userProfile.seasonalPalette.replace('_', ' ').toLowerCase()} palette, balancing earthy grounding neutrals against quiet luminous accents.`,
        };
    }
}
exports.MockAiProvider = MockAiProvider;
