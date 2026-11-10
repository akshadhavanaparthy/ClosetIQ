import React, { useEffect, useState } from 'react';
import { EditorialHeader } from './components/EditorialHeader';
import { api } from './services/api';
import {
  ProfileResponseDto,
  WardrobeItemDto,
  OutfitDto,
  ProductDto,
  BodyAnalysisResponseDto,
} from '@closetiq/shared-types';
import { Sparkles, Cpu, Database, Compass, Shirt, Layers, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('editorial');
  const [profile, setProfile] = useState<ProfileResponseDto | null>(null);
  const [wardrobe, setWardrobe] = useState<WardrobeItemDto[]>([]);
  const [outfits, setOutfits] = useState<OutfitDto[]>([]);
  const [catalog, setCatalog] = useState<ProductDto[]>([]);
  const [analysis, setAnalysis] = useState<BodyAnalysisResponseDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [backendConnected, setBackendConnected] = useState<boolean>(false);

  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      try {
        // Probe backend health quietly
        try {
          const res = await fetch('/healthz');
          if (res.ok) setBackendConnected(true);
        } catch {
          setBackendConnected(false);
        }

        const [profData, wardrobeData, catalogData, analysisData] = await Promise.all([
          api.getProfile(),
          api.getWardrobe(),
          api.getCatalog(),
          api.getLatestAnalysis(),
        ]);

        setProfile(profData);
        setWardrobe(wardrobeData);
        setCatalog(catalogData);
        setAnalysis(analysisData);

        if (wardrobeData.length > 0) {
          const outfitData = await api.completeMyOutfit({
            seedItemId: wardrobeData[0].id,
            occasion: 'EDITORIAL_EVENING',
            includeShoppingCatalog: true,
          });
          setOutfits(outfitData);
        }
      } catch (err) {
        console.error('ClosetIQ Initialization:', err);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  return (
    <div className="min-h-screen bg-linen text-obsidian">
      {/* Haute Couture Editorial Header */}
      <EditorialHeader
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        profile={profile}
        wardrobeCount={wardrobe.length}
        onOpenAddModal={() => alert('Garment Computer Vision ingestion pipeline modal.')}
        onStartOnboarding={() => alert('Biometric assessment & morphometry onboarding flow.')}
      />

      <main className="container py-8 animate-fade-in">
        {/* Architecture & Engine Status Bar */}
        <section
          className="mb-8 p-4 rounded-2xl bg-linen-pure flex items-center justify-between flex-wrap gap-4"
          style={{ border: '1px solid var(--border-stone)', boxShadow: 'var(--shadow-sm)' }}
        >
          <div className="flex items-center gap-3">
            <div className={backendConnected ? 'status-dot-active' : 'status-dot-warning'} />
            <div>
              <p className="editorial-caps text-muted" style={{ fontSize: '0.62rem' }}>
                System Architecture Status
              </p>
              <p className="text-sm font-medium text-obsidian">
                {backendConnected
                  ? 'Core Express Service Online (Port 4000) • Real-Time Deterministic Engine'
                  : 'Vite Standalone Mode Active • Deterministic Luxury Engine Running Offline Fallbacks'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="badge-formality badge-terracotta">
              <Cpu style={{ width: '0.85rem', height: '0.85rem' }} />
              <span>TypeScript Microservices</span>
            </span>
            <span className="badge-formality badge-olive">
              <Database style={{ width: '0.85rem', height: '0.85rem' }} />
              <span>Prisma v6 Architecture</span>
            </span>
            <span className="badge-formality">
              <Sparkles style={{ width: '0.85rem', height: '0.85rem', color: 'var(--accent-gold)' }} />
              <span>CIELAB Colorimetry</span>
            </span>
          </div>
        </section>

        {loading ? (
          <div className="py-24 text-center">
            <RefreshCw
              className="mx-auto mb-4 text-terracotta"
              style={{ width: '2.5rem', height: '2.5rem', animation: 'spin 1.5s linear infinite' }}
            />
            <p className="font-serif text-2xl text-muted font-light">
              Calibrating wardrobe geometry and tonal colorimetry...
            </p>
          </div>
        ) : (
          <>
            {/* 1. EDITORIAL DASHBOARD */}
            {currentTab === 'editorial' && (
              <div className="space-y-12 animate-fade-in">
                {/* Hero Editorial Dossier */}
                <section
                  className="p-8 rounded-3xl bg-linen-warm relative overflow-hidden"
                  style={{ border: '1px solid var(--border-stone)' }}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div style={{ maxWidth: '42rem' }}>
                      <span className="editorial-caps text-terracotta">Haute Horlogerie of Wardrobe Curation</span>
                      <h1 className="editorial-title text-5xl font-light text-obsidian mt-2">
                        ClosetIQ Intelligence Studio
                      </h1>
                      <p className="text-base text-muted mt-3 font-normal" style={{ lineHeight: '1.6' }}>
                        Deterministic mathematical modeling for high-end personal styling. Blending anatomical body
                        proportions, CIELAB color space harmony, and an exclusive luxury capsule architecture.
                      </p>
                      <div className="flex items-center gap-2 mt-4 flex-wrap">
                        {profile?.styleKeywords?.map((kw, i) => (
                          <span
                            key={i}
                            className="badge-formality"
                            style={{ backgroundColor: '#FFFFFF', borderColor: 'var(--border-stone)' }}
                          >
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div
                      className="p-5 rounded-2xl bg-linen-pure text-right"
                      style={{
                        border: '1px solid var(--border-stone)',
                        minWidth: '240px',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <p className="editorial-caps text-muted" style={{ fontSize: '0.62rem' }}>
                        Client Style Profile
                      </p>
                      <p className="font-serif text-2xl font-medium text-obsidian mt-1">
                        {profile?.fullName || 'Sloane Sterling'}
                      </p>
                      <div className="mt-3 flex items-center justify-end gap-1.5 flex-wrap">
                        <span className="badge-formality badge-terracotta">
                          {profile?.seasonalPalette?.replace('_', ' ') || 'TRUE WINTER'}
                        </span>
                        <span className="badge-formality badge-olive">
                          {profile?.bodyShapeConfirmed || 'HOURGLASS'}
                        </span>
                      </div>
                      <p className="text-muted mt-2 font-mono" style={{ fontSize: '0.68rem' }}>
                        Height: {profile?.heightCm} cm • Tier: {profile?.budgetTier}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Metrics 4-Column Grid */}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="editorial-card p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="editorial-caps text-muted">Wardrobe Capsule</span>
                      <Shirt style={{ width: '1.25rem', height: '1.25rem', color: 'var(--accent-terracotta)' }} />
                    </div>
                    <p className="font-serif text-4xl font-light text-obsidian">{wardrobe.length}</p>
                    <p className="text-xs text-muted mt-1">Owned & cataloged garments</p>
                  </div>

                  <div className="editorial-card p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="editorial-caps text-muted">Algorithmic Ensembles</span>
                      <Layers style={{ width: '1.25rem', height: '1.25rem', color: 'var(--accent-olive)' }} />
                    </div>
                    <p className="font-serif text-4xl font-light text-obsidian">{outfits.length}</p>
                    <p className="text-xs text-muted mt-1">Mathematically scored pairings</p>
                  </div>

                  <div className="editorial-card p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="editorial-caps text-muted">Colorimetry ITA°</span>
                      <Sparkles style={{ width: '1.25rem', height: '1.25rem', color: 'var(--accent-gold)' }} />
                    </div>
                    <p className="font-serif text-4xl font-light text-obsidian">
                      {analysis?.itaAngle ? `${analysis.itaAngle}°` : '51.4°'}
                    </p>
                    <p className="text-xs text-muted mt-1">Individual Typology Angle</p>
                  </div>

                  <div className="editorial-card p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="editorial-caps text-muted">Luxury Catalog</span>
                      <Compass style={{ width: '1.25rem', height: '1.25rem', color: 'var(--text-obsidian)' }} />
                    </div>
                    <p className="font-serif text-4xl font-light text-obsidian">{catalog.length}</p>
                    <p className="text-xs text-muted mt-1">Curated luxury merchant items</p>
                  </div>
                </section>

                {/* Featured Ensembles */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="editorial-caps text-terracotta">Curated Outfits</span>
                      <h2 className="font-serif text-3xl font-light text-obsidian mt-1">
                        Algorithmic Formula Recommendations
                      </h2>
                    </div>
                    <button onClick={() => setCurrentTab('builder')} className="btn-secondary">
                      <span>Open Outfit Builder</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {outfits.map((outfit) => (
                      <div key={outfit.id} className="editorial-card p-6 space-y-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="badge-formality mb-2">{outfit.occasion}</span>
                            <h3 className="font-serif text-2xl font-medium text-obsidian mt-1">{outfit.name}</h3>
                          </div>
                          <div className="text-right">
                            <span className="font-serif text-3xl font-light text-terracotta">
                              {outfit.overallScore.toFixed(1)}
                            </span>
                            <span className="text-xs text-muted">/100</span>
                            <p className="editorial-caps text-muted" style={{ fontSize: '0.62rem' }}>
                              Overall Score
                            </p>
                          </div>
                        </div>

                        {/* Garment Row */}
                        <div className="grid grid-cols-4 gap-3">
                          {outfit.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="rounded-xl overflow-hidden bg-linen-warm aspect-garment"
                              style={{ border: '1px solid var(--border-stone)' }}
                            >
                              <img src={item.imageUrl} alt={item.name} />
                              <div
                                style={{
                                  position: 'absolute',
                                  inset: 'auto 0 0 0',
                                  padding: '0.4rem',
                                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                                  color: '#FFFFFF',
                                }}
                              >
                                <p className="text-xs font-semibold truncate" style={{ fontSize: '0.65rem' }}>
                                  {item.brand}
                                </p>
                                <p className="truncate" style={{ fontSize: '0.55rem', opacity: 0.8 }}>
                                  {item.slotType}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Editorial Styling Notes */}
                        <div
                          className="p-4 rounded-xl bg-linen-warm"
                          style={{ border: '1px solid var(--border-stone-light)' }}
                        >
                          <p className="font-serif text-lg font-medium text-obsidian mb-1">
                            {outfit.stylingAdvice?.headline || 'Architectural Poise'}
                          </p>
                          <p className="text-xs text-muted" style={{ lineHeight: '1.6' }}>
                            {outfit.stylingAdvice?.editorialSummary}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* 2. WARDROBE TAB */}
            {currentTab === 'wardrobe' && (
              <div className="space-y-8 animate-fade-in">
                <div
                  className="flex justify-between items-end pb-6"
                  style={{ borderBottom: '1px solid var(--border-stone)' }}
                >
                  <div>
                    <span className="editorial-caps text-terracotta">Capsule Collection</span>
                    <h1 className="editorial-title text-4xl font-light text-obsidian mt-1">Wardrobe Archive</h1>
                    <p className="text-sm text-muted mt-1">
                      {wardrobe.length} cataloged pieces evaluated for proportional silhouette and CIELAB color harmony.
                    </p>
                  </div>
                  <button
                    onClick={() => alert('Add Garment ingestion flow.')}
                    className="btn-primary"
                  >
                    <span>+ Add Garment</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {wardrobe.map((item) => (
                    <div key={item.id} className="editorial-card flex flex-col">
                      <div className="aspect-garment">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} />
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted">
                            <Shirt style={{ width: '3rem', height: '3rem' }} />
                          </div>
                        )}
                        <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                          <span className="badge-formality" style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
                            {item.category}
                          </span>
                        </div>
                        {item.cost && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '0.75rem',
                              right: '0.75rem',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '9999px',
                              backgroundColor: 'rgba(20,20,22,0.75)',
                              color: '#FFFFFF',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.7rem',
                            }}
                          >
                            ${item.cost}
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <p className="editorial-caps text-muted" style={{ fontSize: '0.65rem' }}>
                            {item.brand || 'Luxury Atelier'}
                          </p>
                          <h3 className="font-serif text-xl font-medium text-obsidian mt-1">{item.name}</h3>
                          <p className="text-xs text-muted mt-1">{item.subCategory}</p>
                        </div>

                        <div
                          className="pt-3 flex items-center justify-between text-xs text-muted"
                          style={{ borderTop: '1px solid var(--border-stone-light)' }}
                        >
                          <div className="flex items-center gap-1.5">
                            <span
                              style={{
                                width: '0.9rem',
                                height: '0.9rem',
                                borderRadius: '9999px',
                                backgroundColor: item.primaryColorHex,
                                border: '1px solid rgba(0,0,0,0.15)',
                                display: 'inline-block',
                              }}
                              title={item.primaryColorName}
                            />
                            <span className="truncate" style={{ maxWidth: '90px' }}>
                              {item.primaryColorName}
                            </span>
                          </div>
                          <span className="badge-formality" style={{ fontSize: '0.62rem' }}>
                            {item.formalityLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. OUTFIT BUILDER TAB */}
            {currentTab === 'builder' && (
              <div className="space-y-8 animate-fade-in">
                <div className="pb-6" style={{ borderBottom: '1px solid var(--border-stone)' }}>
                  <span className="editorial-caps text-terracotta">Mathematical Rule Engine</span>
                  <h1 className="editorial-title text-4xl font-light text-obsidian mt-1">
                    Algorithmic Outfit Builder
                  </h1>
                  <p className="text-sm text-muted mt-1" style={{ maxWidth: '44rem' }}>
                    Calculates deterministic compatibility across Color Harmony (CIELAB ΔE & angular relationships),
                    Silhouette Balance (anatomical compensation), and Formality Alignment.
                  </p>
                </div>

                <div className="space-y-8">
                  {outfits.map((outfit) => (
                    <div key={outfit.id} className="editorial-card p-8 space-y-8">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="badge-formality">{outfit.occasion}</span>
                            <span className="badge-formality badge-olive">{outfit.season}</span>
                          </div>
                          <h2 className="font-serif text-3xl font-medium text-obsidian">{outfit.name}</h2>
                        </div>

                        <div
                          className="p-4 rounded-2xl bg-linen-warm flex items-center gap-4"
                          style={{ border: '1px solid var(--border-stone)' }}
                        >
                          <div className="text-right">
                            <p className="editorial-caps text-muted" style={{ fontSize: '0.62rem' }}>
                              Formula Score
                            </p>
                            <p className="font-serif text-4xl font-semibold text-terracotta">
                              {outfit.overallScore.toFixed(1)}%
                            </p>
                          </div>
                          <div
                            className="rounded-full flex items-center justify-center text-white bg-obsidian"
                            style={{ width: '2.75rem', height: '2.75rem' }}
                          >
                            <Sparkles style={{ width: '1.25rem', height: '1.25rem', color: 'var(--accent-gold)' }} />
                          </div>
                        </div>
                      </div>

                      {/* Score Metrics 3-Bar Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-linen-pure" style={{ border: '1px solid var(--border-stone)' }}>
                          <div className="flex justify-between items-center text-xs mb-2">
                            <span className="font-medium text-muted">Color Harmony</span>
                            <span className="font-mono font-semibold text-obsidian">
                              {outfit.colorHarmonyScore.toFixed(1)}%
                            </span>
                          </div>
                          <div className="progress-bar-bg">
                            <div
                              className="progress-bar-fill"
                              style={{ width: `${outfit.colorHarmonyScore}%`, backgroundColor: 'var(--accent-olive)' }}
                            />
                          </div>
                          <p className="text-xs text-muted mt-2" style={{ fontSize: '0.72rem' }}>
                            {outfit.ruleBreakdown?.colorHarmony?.details || 'Complementary tonal balance'}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-linen-pure" style={{ border: '1px solid var(--border-stone)' }}>
                          <div className="flex justify-between items-center text-xs mb-2">
                            <span className="font-medium text-muted">Silhouette Balance</span>
                            <span className="font-mono font-semibold text-obsidian">
                              {outfit.silhouetteScore.toFixed(1)}%
                            </span>
                          </div>
                          <div className="progress-bar-bg">
                            <div
                              className="progress-bar-fill"
                              style={{ width: `${outfit.silhouetteScore}%`, backgroundColor: 'var(--accent-terracotta)' }}
                            />
                          </div>
                          <p className="text-xs text-muted mt-2" style={{ fontSize: '0.72rem' }}>
                            {outfit.ruleBreakdown?.silhouetteBalance?.critique || 'Proportional vertical drape'}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-linen-pure" style={{ border: '1px solid var(--border-stone)' }}>
                          <div className="flex justify-between items-center text-xs mb-2">
                            <span className="font-medium text-muted">Formality Alignment</span>
                            <span className="font-mono font-semibold text-obsidian">
                              {outfit.formalityScore.toFixed(1)}%
                            </span>
                          </div>
                          <div className="progress-bar-bg">
                            <div
                              className="progress-bar-fill"
                              style={{ width: `${outfit.formalityScore}%`, backgroundColor: 'var(--text-obsidian)' }}
                            />
                          </div>
                          <p className="text-xs text-muted mt-2" style={{ fontSize: '0.72rem' }}>
                            {outfit.ruleBreakdown?.formalityAlignment?.critique || 'Target formality verified'}
                          </p>
                        </div>
                      </div>

                      {/* Items Row */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {outfit.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl overflow-hidden bg-linen-pure"
                            style={{ border: '1px solid var(--border-stone)' }}
                          >
                            <div className="aspect-garment">
                              <img src={item.imageUrl} alt={item.name} />
                            </div>
                            <div className="p-3">
                              <div className="flex justify-between items-center mb-1">
                                <span className="editorial-caps text-muted" style={{ fontSize: '0.6rem' }}>
                                  {item.slotType}
                                </span>
                                <span
                                  className="badge-formality"
                                  style={{ fontSize: '0.55rem', padding: '0.1rem 0.4rem' }}
                                >
                                  {item.isOwned ? 'OWNED' : 'CURATED'}
                                </span>
                              </div>
                              <p className="text-xs font-semibold text-obsidian truncate">{item.name}</p>
                              <p className="text-muted truncate" style={{ fontSize: '0.7rem' }}>
                                {item.brand}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Editorial Advice */}
                      {outfit.stylingAdvice && (
                        <div
                          className="p-5 rounded-2xl bg-linen-warm space-y-3"
                          style={{ border: '1px solid var(--border-stone)' }}
                        >
                          <div className="flex items-center gap-2 text-terracotta">
                            <Sparkles style={{ width: '1.1rem', height: '1.1rem' }} />
                            <h4 className="font-serif text-xl font-medium text-obsidian">
                              {outfit.stylingAdvice.headline}
                            </h4>
                          </div>
                          <p className="text-sm text-muted" style={{ lineHeight: '1.6' }}>
                            {outfit.stylingAdvice.editorialSummary}
                          </p>
                          {outfit.stylingAdvice.stylingTips && (
                            <ul className="text-xs text-muted space-y-1" style={{ paddingLeft: '1.25rem' }}>
                              {outfit.stylingAdvice.stylingTips.map((tip, i) => (
                                <li key={i}>{tip}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. ANALYSIS LAB TAB */}
            {currentTab === 'analysis' && (
              <div className="space-y-8 animate-fade-in">
                <div className="pb-6" style={{ borderBottom: '1px solid var(--border-stone)' }}>
                  <span className="editorial-caps text-terracotta">Computer Vision & Colorimetry</span>
                  <h1 className="editorial-title text-4xl font-light text-obsidian mt-1">
                    Biometric & Spectrometry Lab
                  </h1>
                  <p className="text-sm text-muted mt-1">
                    Deterministic geometry derived from anatomical landmarks and colorimetric skin spectrometry.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Geometric Morphometry Card */}
                  <div className="editorial-card p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-serif text-2xl font-medium text-obsidian">Geometric Morphometry</h3>
                        <p className="text-xs text-muted mt-0.5">Anatomical proportions & classification</p>
                      </div>
                      <span className="badge-formality badge-olive">
                        {analysis?.detectedBodyShape || 'HOURGLASS'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div
                        className="p-4 rounded-xl bg-linen-warm flex justify-between items-center"
                        style={{ border: '1px solid var(--border-stone)' }}
                      >
                        <div>
                          <p className="text-xs font-semibold text-obsidian">Shoulder-to-Hip Ratio</p>
                          <p className="text-muted" style={{ fontSize: '0.7rem' }}>Horizontal anatomical proportion</p>
                        </div>
                        <p className="font-mono text-xl font-semibold text-obsidian">
                          {analysis?.shoulderHipRatio || 1.02}
                        </p>
                      </div>

                      <div
                        className="p-4 rounded-xl bg-linen-warm flex justify-between items-center"
                        style={{ border: '1px solid var(--border-stone)' }}
                      >
                        <div>
                          <p className="text-xs font-semibold text-obsidian">Waist-to-Hip Ratio</p>
                          <p className="text-muted" style={{ fontSize: '0.7rem' }}>Natural waist definition factor</p>
                        </div>
                        <p className="font-mono text-xl font-semibold text-obsidian">
                          {analysis?.waistHipRatio || 0.72}
                        </p>
                      </div>

                      <div
                        className="p-4 rounded-xl bg-linen-warm flex justify-between items-center"
                        style={{ border: '1px solid var(--border-stone)' }}
                      >
                        <div>
                          <p className="text-xs font-semibold text-obsidian">Torso-to-Leg Ratio</p>
                          <p className="text-muted" style={{ fontSize: '0.7rem' }}>Vertical balance index</p>
                        </div>
                        <p className="font-mono text-xl font-semibold text-obsidian">
                          {analysis?.torsoLegRatio || 0.85}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Spectrometric Colorimetry Card */}
                  <div className="editorial-card p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-serif text-2xl font-medium text-obsidian">Spectrometric Colorimetry</h3>
                        <p className="text-xs text-muted mt-0.5">CIELAB coordinates & ITA° typology</p>
                      </div>
                      <span className="badge-formality badge-terracotta">
                        {analysis?.detectedPalette || 'TRUE_WINTER'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div
                        className="p-4 rounded-xl bg-linen-warm"
                        style={{ border: '1px solid var(--border-stone)' }}
                      >
                        <p className="font-mono text-muted" style={{ fontSize: '0.7rem' }}>L* (Luminance)</p>
                        <p className="font-mono text-xl font-semibold text-obsidian mt-1">
                          {analysis?.skinLabL || 66.8}
                        </p>
                      </div>
                      <div
                        className="p-4 rounded-xl bg-linen-warm"
                        style={{ border: '1px solid var(--border-stone)' }}
                      >
                        <p className="font-mono text-muted" style={{ fontSize: '0.7rem' }}>a* (Red-Green)</p>
                        <p className="font-mono text-xl font-semibold text-obsidian mt-1">
                          {analysis?.skinLabA || 11.2}
                        </p>
                      </div>
                      <div
                        className="p-4 rounded-xl bg-linen-warm"
                        style={{ border: '1px solid var(--border-stone)' }}
                      >
                        <p className="font-mono text-muted" style={{ fontSize: '0.7rem' }}>b* (Yellow-Blue)</p>
                        <p className="font-mono text-xl font-semibold text-obsidian mt-1">
                          {analysis?.skinLabB || 13.4}
                        </p>
                      </div>
                    </div>

                    <div
                      className="p-4 rounded-xl bg-linen-pure space-y-3"
                      style={{ border: '1px solid var(--border-stone)' }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-muted">Individual Typology Angle (ITA)</span>
                        <span className="font-mono text-base font-semibold text-obsidian">
                          {analysis?.itaAngle || 51.4}°
                        </span>
                      </div>
                      <div
                        className="flex justify-between items-center pt-3"
                        style={{ borderTop: '1px solid var(--border-stone-light)' }}
                      >
                        <span className="text-xs font-medium text-muted">Confirmed Undertone</span>
                        <span className="badge-formality badge-olive">
                          {analysis?.detectedUndertone || 'COOL'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. DISCOVERY TAB */}
            {currentTab === 'discovery' && (
              <div className="space-y-8 animate-fade-in">
                <div
                  className="flex justify-between items-end pb-6"
                  style={{ borderBottom: '1px solid var(--border-stone)' }}
                >
                  <div>
                    <span className="editorial-caps text-terracotta">Global Luxury Index</span>
                    <h1 className="editorial-title text-4xl font-light text-obsidian mt-1">
                      Curated Discovery Catalog
                    </h1>
                    <p className="text-sm text-muted mt-1">
                      Pieces hand-selected from SSENSE, MR PORTER, and NET-A-PORTER for client palette harmony.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {catalog.map((product) => (
                    <div key={product.id} className="editorial-card flex flex-col">
                      <div className="aspect-garment">
                        {product.imageUrls?.[0] && (
                          <img src={product.imageUrls[0]} alt={product.title} />
                        )}
                        <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                          <span className="badge-formality" style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
                            {product.merchantName}
                          </span>
                        </div>
                        <div
                          style={{
                            position: 'absolute',
                            top: '0.75rem',
                            right: '0.75rem',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '9999px',
                            backgroundColor: 'rgba(20,20,22,0.75)',
                            color: '#FFFFFF',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.7rem',
                          }}
                        >
                          ${product.price}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <p className="editorial-caps text-muted" style={{ fontSize: '0.65rem' }}>
                            {product.brand}
                          </p>
                          <h3 className="font-serif text-xl font-medium text-obsidian mt-1">{product.title}</h3>
                          <p
                            className="text-xs text-muted mt-2"
                            style={{
                              lineHeight: '1.5',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {product.description}
                          </p>
                        </div>

                        <div
                          className="pt-3 flex items-center justify-between"
                          style={{ borderTop: '1px solid var(--border-stone-light)' }}
                        >
                          <span className="editorial-caps text-muted" style={{ fontSize: '0.65rem' }}>
                            {product.subCategory}
                          </span>
                          <span
                            className="text-xs font-semibold text-terracotta"
                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                          >
                            View Merchant →
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
