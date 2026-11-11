import React, { useState } from 'react';
import { api } from '../services/api';
import { ProfileResponseDto } from '@closetiq/shared-types';
import {
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: ProfileResponseDto | null;
  onProfileUpdated: (profile: ProfileResponseDto) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onProfileUpdated,
}) => {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Measurement unit toggle
  const [unit, setUnit] = useState<'cm' | 'inches'>('cm');

  // Form State: strictly initialized from current profile without fake or guessed defaults
  const [genderPreference, setGenderPreference] = useState<'WOMENSWEAR' | 'MENSWEAR' | 'ANDROGYNOUS'>(
    (currentProfile?.genderPreference as any) || 'ANDROGYNOUS'
  );
  const [height, setHeight] = useState<string>(
    currentProfile?.heightCm ? String(currentProfile.heightCm) : ''
  );
  const [bustChest, setBustChest] = useState<string>(
    currentProfile?.bustChestCm ? String(currentProfile.bustChestCm) : ''
  );
  const [waist, setWaist] = useState<string>(
    currentProfile?.waistCm ? String(currentProfile.waistCm) : ''
  );
  const [hip, setHip] = useState<string>(
    currentProfile?.hipCm ? String(currentProfile.hipCm) : ''
  );

  // Clothing & occasion preferences
  const [preferredCategories, setPreferredCategories] = useState<string[]>(
    currentProfile?.preferredCategories || []
  );
  const [preferredOccasions, setPreferredOccasions] = useState<string[]>(
    currentProfile?.preferredOccasions || []
  );

  // Style aesthetics & brands
  const [styleKeywords, setStyleKeywords] = useState<string[]>(
    currentProfile?.styleKeywords || []
  );
  const [budgetTier, setBudgetTier] = useState<number>(currentProfile?.budgetTier || 2);
  const [preferredBrands, setPreferredBrands] = useState<string[]>(
    currentProfile?.preferredBrands || []
  );

  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const toggleArrayItem = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSaveAndContinue = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Final Step: Persist entire onboarding profile to database
      setSaving(true);
      try {
        // Convert measurements based on unit if entered
        const parseMeasurement = (val: string): number | undefined => {
          if (!val || isNaN(Number(val))) return undefined;
          const num = Number(val);
          return unit === 'inches' ? Math.round(num * 2.54 * 10) / 10 : num;
        };

        const updated = await api.updateProfile({
          genderPreference,
          heightCm: parseMeasurement(height),
          bustChestCm: parseMeasurement(bustChest),
          waistCm: parseMeasurement(waist),
          hipCm: parseMeasurement(hip),
          budgetTier,
          preferredCategories,
          preferredOccasions,
          styleKeywords,
          preferredBrands,
        });

        onProfileUpdated(updated);
        onClose();
      } catch (err: any) {
        console.error('Failed to save profile:', err);
        setFormError(err?.message || 'Failed to save profile.');
      } finally {
        setSaving(false);
      }
    }
  };

  const calculateProgress = () => Math.round((step / totalSteps) * 100);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content p-8" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '44rem' }}>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-muted"
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', border: 'none', background: 'transparent', cursor: 'pointer' }}
          title="Close onboarding"
        >
          <X style={{ width: '1.25rem', height: '1.25rem' }} />
        </button>

        {/* Progress Stepper */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-xs text-muted mb-2">
            <span className="editorial-caps text-terracotta">
            Step {step} of {totalSteps}: Profile setup
            </span>
            <span className="font-mono font-semibold">{calculateProgress()}% Complete</span>
          </div>
          <div className="progress-bar-bg" style={{ height: '0.45rem' }}>
            <div
              className="progress-bar-fill"
              style={{ width: `${calculateProgress()}%`, backgroundColor: 'var(--accent-terracotta)' }}
            />
          </div>
        </div>

        {/* STEP 1: Styling Dimension */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <span className="editorial-caps text-terracotta">Styling Dimension</span>
              <h2 className="font-serif text-3xl font-medium text-obsidian mt-1">
                Select Your Styling Focus
              </h2>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Choose the wardrobe proportion library and sizing frameworks for your personal styling feed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'WOMENSWEAR', label: 'Womenswear', desc: 'Sculpted dresses, tailored skirts, fluid coats, and ethnic gowns' },
                { id: 'MENSWEAR', label: 'Menswear', desc: 'Sartorial suiting, sharp overcoats, luxury shirting, and sherwanis' },
                { id: 'ANDROGYNOUS', label: 'Androgynous / Fluid', desc: 'Architectural volumes, boxy tailoring, and relaxed unisex draping' },
              ].map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setGenderPreference(cat.id as any)}
                  className={`editorial-card p-5 cursor-pointer text-center transition ${
                    genderPreference === cat.id ? 'editorial-card-featured border-stone-dark' : ''
                  }`}
                  style={{
                    borderColor: genderPreference === cat.id ? 'var(--text-obsidian)' : 'var(--border-stone)',
                    borderWidth: genderPreference === cat.id ? '2px' : '1px',
                    backgroundColor: genderPreference === cat.id ? 'var(--bg-linen-pure)' : 'var(--bg-linen-warm)',
                  }}
                >
                  <p className="font-serif text-xl font-medium text-obsidian">{cat.label}</p>
                  <p className="text-xs text-muted mt-2 leading-relaxed">{cat.desc}</p>
                  {genderPreference === cat.id && (
                    <span className="badge-formality mt-3 inline-flex items-center gap-1" style={{ borderColor: 'var(--accent-terracotta)', color: 'var(--accent-terracotta)' }}>
                      <Check style={{ width: '0.75rem', height: '0.75rem' }} /> Selected
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Body Measurements (Strictly User-Entered & Optional) */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <span className="editorial-caps text-terracotta">Anatomical Calibration</span>
                <h2 className="font-serif text-3xl font-medium text-obsidian mt-1">
                  Enter Your Body Measurements
                </h2>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Measurements are completely optional. Skip any field you prefer not to share. ClosetIQ never invents missing data.
                </p>
              </div>

              {/* Unit Toggle */}
              <div className="flex items-center border border-stone rounded-lg p-1 bg-linen-warm text-xs">
                <button
                  type="button"
                  onClick={() => setUnit('cm')}
                  className={`px-3 py-1 rounded-lg font-mono transition ${unit === 'cm' ? 'bg-obsidian text-white' : 'text-muted'}`}
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  Centimeters (cm)
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('inches')}
                  className={`px-3 py-1 rounded-lg font-mono transition ${unit === 'inches' ? 'bg-obsidian text-white' : 'text-muted'}`}
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  Inches (in)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Height */}
              <div className="editorial-card p-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="editorial-caps text-muted" style={{ fontSize: '0.62rem' }}>
                    Height ({unit})
                  </label>
                  <span className="text-xs text-muted font-mono">Optional</span>
                </div>
                <input
                  type="number"
                  placeholder={unit === 'cm' ? 'e.g. 172' : 'e.g. 68'}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="input-editorial font-mono"
                  min="50"
                  max="250"
                />
                <p className="text-xs text-muted mt-2 leading-tight" style={{ fontSize: '0.7rem' }}>
                  Calibrates garment hemline drape, trouser inseam proportions, and vertical layering.
                </p>
              </div>

              {/* Bust / Chest */}
              <div className="editorial-card p-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="editorial-caps text-muted" style={{ fontSize: '0.62rem' }}>
                    Bust / Chest ({unit})
                  </label>
                  <span className="text-xs text-muted font-mono">Optional</span>
                </div>
                <input
                  type="number"
                  placeholder={unit === 'cm' ? 'e.g. 92' : 'e.g. 36'}
                  value={bustChest}
                  onChange={(e) => setBustChest(e.target.value)}
                  className="input-editorial font-mono"
                  min="30"
                  max="200"
                />
                <p className="text-xs text-muted mt-2 leading-tight" style={{ fontSize: '0.7rem' }}>
                  Measured around the fullest point of the chest. Evaluates structured blazer and shirt fit.
                </p>
              </div>

              {/* Waist */}
              <div className="editorial-card p-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="editorial-caps text-muted" style={{ fontSize: '0.62rem' }}>
                    Natural Waist ({unit})
                  </label>
                  <span className="text-xs text-muted font-mono">Optional</span>
                </div>
                <input
                  type="number"
                  placeholder={unit === 'cm' ? 'e.g. 74' : 'e.g. 29'}
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  className="input-editorial font-mono"
                  min="30"
                  max="200"
                />
                <p className="text-xs text-muted mt-2 leading-tight" style={{ fontSize: '0.7rem' }}>
                  Measured at the narrowest point of your torso, typically above the navel.
                </p>
              </div>

              {/* Hips */}
              <div className="editorial-card p-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="editorial-caps text-muted" style={{ fontSize: '0.62rem' }}>
                    Hips ({unit})
                  </label>
                  <span className="text-xs text-muted font-mono">Optional</span>
                </div>
                <input
                  type="number"
                  placeholder={unit === 'cm' ? 'e.g. 98' : 'e.g. 38'}
                  value={hip}
                  onChange={(e) => setHip(e.target.value)}
                  className="input-editorial font-mono"
                  min="30"
                  max="200"
                />
                <p className="text-xs text-muted mt-2 leading-tight" style={{ fontSize: '0.7rem' }}>
                  Measured at the widest part of your hips and glutes. Crucial for skirt and trouser drape.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-linen-warm text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <HelpCircle style={{ width: '0.9rem', height: '0.9rem', color: 'var(--accent-terracotta)' }} />
                <span>You can skip all measurements if you prefer. They are never guessed or filled automatically.</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setHeight('');
                  setBustChest('');
                  setWaist('');
                  setHip('');
                  setStep(3);
                }}
                className="text-xs text-terracotta underline font-medium"
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                Skip Measurements →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Preferred Categories & Occasions */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <span className="editorial-caps text-terracotta">Catalog Alignment</span>
              <h2 className="font-serif text-3xl font-medium text-obsidian mt-1">
                Preferred Fashion Categories & Occasions
              </h2>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Select the fashion categories and occasions you shop for most frequently.
              </p>
            </div>

            {/* Categories */}
            <div>
              <label className="editorial-caps text-muted mb-2 block" style={{ fontSize: '0.62rem' }}>
                Preferred Fashion Categories
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  'Casual',
                  'Party',
                  'Traditional',
                  'Ethnic',
                  'Formal',
                  'Office',
                  'Wedding',
                  'Festive',
                  'Streetwear',
                  'Sportswear',
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleArrayItem(preferredCategories, setPreferredCategories, cat)}
                    className={`p-3 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition ${
                      preferredCategories.includes(cat)
                        ? 'bg-linen-pure border-obsidian text-obsidian shadow-sm'
                        : 'bg-linen-warm border-stone text-muted hover:border-stone-dark'
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <span>{cat}</span>
                    {preferredCategories.includes(cat) && (
                      <Check style={{ width: '0.85rem', height: '0.85rem', color: 'var(--accent-terracotta)' }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Occasions */}
            <div>
              <label className="editorial-caps text-muted mb-2 block" style={{ fontSize: '0.62rem' }}>
                Frequent Occasions
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Weekend Outings',
                  'Client Meetings',
                  'Cocktail Galas',
                  'Festivals & Puja',
                  'Weddings & Receptions',
                  'Daily Commute',
                  'Fitness & Running',
                  'Fine Dining',
                ].map((occ) => (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => toggleArrayItem(preferredOccasions, setPreferredOccasions, occ)}
                    className={`badge-formality cursor-pointer transition ${
                      preferredOccasions.includes(occ) ? 'bg-obsidian text-white border-obsidian' : 'bg-linen-warm border-stone'
                    }`}
                  >
                    {preferredOccasions.includes(occ) && <Check style={{ width: '0.75rem', height: '0.75rem' }} />}
                    <span>{occ}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Aesthetics & Preferred Brands */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <span className="editorial-caps text-terracotta">Sartorial Taste</span>
              <h2 className="font-serif text-3xl font-medium text-obsidian mt-1">
                Aesthetics, Brands & Budget
              </h2>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Tune the curation engine to your aesthetic sensibility and preferred price tiers.
              </p>
            </div>

            {/* Style Keywords */}
            <div>
              <label className="editorial-caps text-muted mb-2 block" style={{ fontSize: '0.62rem' }}>
                Style Aesthetics
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Minimalist',
                  'Architectural Tailoring',
                  'Old Money',
                  'Quiet Luxury',
                  'Streetwear Luxe',
                  'Modern Classic',
                  'Bohemian Elegance',
                  'Monochrome Chic',
                ].map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => toggleArrayItem(styleKeywords, setStyleKeywords, kw)}
                    className={`badge-formality cursor-pointer transition ${
                      styleKeywords.includes(kw) ? 'bg-obsidian text-white border-obsidian' : 'bg-linen-warm border-stone'
                    }`}
                  >
                    {styleKeywords.includes(kw) && <Check style={{ width: '0.75rem', height: '0.75rem' }} />}
                    <span>#{kw}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Orientation */}
            <div>
              <label className="editorial-caps text-muted mb-2 block" style={{ fontSize: '0.62rem' }}>
                Budget Orientation Tier
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { tier: 1, label: 'Accessible Contemporary', desc: '$100 – $400 / piece' },
                  { tier: 2, label: 'Elevated Designer', desc: '$400 – $1,200 / piece' },
                  { tier: 3, label: 'Haute Horlogerie & Luxury', desc: '$1,200 – $3,500+ / piece' },
                ].map((b) => (
                  <div
                    key={b.tier}
                    onClick={() => setBudgetTier(b.tier)}
                    className={`editorial-card p-4 cursor-pointer text-center transition ${
                      budgetTier === b.tier ? 'border-obsidian bg-linen-pure shadow-sm' : 'bg-linen-warm'
                    }`}
                    style={{ borderWidth: budgetTier === b.tier ? '2px' : '1px' }}
                  >
                    <p className="font-serif text-lg font-medium text-obsidian">{b.label}</p>
                    <p className="text-xs text-muted mt-1 font-mono">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div>
              <label className="editorial-caps text-muted mb-2 block" style={{ fontSize: '0.62rem' }}>
                Preferred Fashion Houses
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Toteme',
                  'Loro Piana',
                  'Lemaire',
                  'Khaite',
                  'J.M. Weston',
                  'Sabyasachi',
                  'Anita Dongre',
                  'Raw Mango',
                  'Brunello Cucinelli',
                  'Fear of God',
                  'Stone Island',
                  'Alo Yoga',
                  'The Row',
                ].map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => toggleArrayItem(preferredBrands, setPreferredBrands, brand)}
                    className={`badge-formality cursor-pointer transition ${
                      preferredBrands.includes(brand) ? 'bg-obsidian text-white border-obsidian' : 'bg-linen-warm border-stone'
                    }`}
                  >
                    {preferredBrands.includes(brand) && <Check style={{ width: '0.75rem', height: '0.75rem' }} />}
                    <span>{brand}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Portrait Analysis */}
        {step === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <span className="editorial-caps text-terracotta">Portrait analysis</span>
              <h2 className="font-serif text-3xl font-medium text-obsidian mt-1">
                Portrait analysis setup
              </h2>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                [TODO: verify the portrait-analysis service and document its results before enabling photo upload.]
              </p>
            </div>

            <div className="p-4 rounded-xl bg-linen-warm border border-stone space-y-2 text-xs text-muted">
              <p className="font-medium text-obsidian">Portrait processing details</p>
              <p className="leading-relaxed">
                [TODO: describe the analysis performed by the connected service and the results it returns.]
              </p>
              <p className="leading-relaxed">
                [TODO: explain where portraits are sent or stored, how they are protected, and when they are deleted.]
              </p>
            </div>

            <div className="p-3.5 rounded-lg border bg-linen-pure text-xs text-muted" role="note">
              [TODO: add informed-consent text after portrait processing and retention details are confirmed.]
            </div>

            <div className="border-2 border-dashed border-stone rounded-xl p-8 flex flex-col items-center justify-center text-center bg-linen-warm">
              <p className="font-serif text-lg text-obsidian font-medium">Photo upload unavailable</p>
              <p className="text-xs text-muted mt-1">[TODO: enable after portrait analysis and data handling are verified.]</p>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-linen-warm border border-terracotta text-terracotta text-xs flex items-center gap-2" role="alert">
                <AlertCircle style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
                <span>{formError}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-muted pt-2">
              <span>Portrait upload is unavailable until processing details are verified.</span>
            </div>
          </div>
        )}

        {/* STEP 6: Summary & Studio Activation */}
        {step === 6 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <span className="editorial-caps text-terracotta">Profile summary</span>
              <h2 className="font-serif text-3xl font-medium text-obsidian mt-1">
                Review Your Personal Profile
              </h2>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Review your details before saving your profile.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="editorial-card p-4 space-y-2">
                <span className="editorial-caps text-muted" style={{ fontSize: '0.62rem' }}>
                  Styling Focus & Silhouette
                </span>
                <p className="font-serif text-xl text-obsidian font-medium">{genderPreference}</p>
                <div className="text-xs text-muted space-y-1 pt-1 font-mono">
                  <p>Height: {height ? `${height} ${unit}` : 'Not specified (skipped)'}</p>
                  <p>Chest: {bustChest ? `${bustChest} ${unit}` : 'Not specified'}</p>
                  <p>Waist: {waist ? `${waist} ${unit}` : 'Not specified'}</p>
                  <p>Hips: {hip ? `${hip} ${unit}` : 'Not specified'}</p>
                </div>
              </div>

              <div className="editorial-card p-4 space-y-2">
                <span className="editorial-caps text-muted" style={{ fontSize: '0.62rem' }}>
                  Portrait analysis
                </span>
                <p className="font-serif text-xl text-obsidian font-medium">
                  Not configured
                </p>
                <p className="text-xs text-muted leading-relaxed">
                  [TODO: connect portrait analysis and document its data handling before launch.]
                </p>
              </div>
            </div>

            <div className="editorial-card p-4 space-y-2">
              <span className="editorial-caps text-muted" style={{ fontSize: '0.62rem' }}>
                Preferences & Curated Categories
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {preferredCategories.length > 0 ? (
                  preferredCategories.map((c) => (
                    <span key={c} className="badge-formality" style={{ backgroundColor: 'var(--bg-linen-pure)' }}>
                      {c}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted italic">All catalog categories active</span>
                )}
                {preferredBrands.map((b) => (
                  <span key={b} className="badge-formality badge-olive">
                    {b}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-linen-warm text-xs text-muted leading-relaxed">
              Your dashboard displays saved profile details and analysis results returned by the connected service.
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6" style={{ borderTop: '1px solid var(--border-stone-light)' }}>
          {step > 1 ? (
            <button
              type="button"
              onClick={() => {
                setFormError(null);
                setStep(step - 1);
              }}
              className="btn-secondary"
            >
              <ArrowLeft style={{ width: '0.85rem', height: '0.85rem' }} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleSaveAndContinue}
            disabled={saving}
            className="btn-primary"
          >
            <span>{saving ? 'Saving...' : step === totalSteps ? 'Save profile' : 'Save & Continue'}</span>
            <ArrowRight style={{ width: '0.85rem', height: '0.85rem' }} />
          </button>
        </div>
      </div>
    </div>
  );
};
