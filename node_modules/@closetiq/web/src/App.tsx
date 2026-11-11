import React, { useEffect, useState } from 'react';
import { AuthModal } from './components/AuthModal';
import { EditorialHeader } from './components/EditorialHeader';
import { LegalPage } from './components/LegalPage';
import { SiteFooter } from './components/SiteFooter';
import { CatalogAdminPage } from './components/CatalogAdminPage';
import { ProductDiscovery } from './components/ProductDiscovery';
import { api, UserSession } from './services/api';
import {
  ProfileResponseDto,
  WardrobeItemDto,
  OutfitDto,
  BodyAnalysisResponseDto,
} from '@closetiq/shared-types';
import { Sparkles, Compass, Shirt, Layers, RefreshCw } from 'lucide-react';

const isProvidedImage = (imageUrl?: string | null): imageUrl is string =>
  Boolean(imageUrl && (imageUrl.startsWith('/uploads/') || imageUrl.startsWith('uploads/')));

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('editorial');
  const [profile, setProfile] = useState<ProfileResponseDto | null>(null);
  const [wardrobe, setWardrobe] = useState<WardrobeItemDto[]>([]);
  const [outfits, setOutfits] = useState<OutfitDto[]>([]);
  const [analysis, setAnalysis] = useState<BodyAnalysisResponseDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [session, setSession] = useState<UserSession | null>(() => api.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const hasActiveSession = Boolean(
    session &&
    session.token &&
    session.token !== 'mock-jwt-token-2026' &&
    !session.token.startsWith('demo-token-')
  );

  useEffect(() => {
    let active = true;
    api.restoreSession()
      .then((user) => {
        if (active) setSession(user);
      })
      .catch((error: unknown) => {
        console.error('ClosetIQ session restoration:', error);
        if (active) setLoadError('Your session could not be restored. Please sign in again.');
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    async function loadInitialData() {
      if (path === '/admin/catalog') {
        setLoading(false);
        return;
      }
      if (!hasActiveSession) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const healthResponse = await fetch('/healthz');
        if (!healthResponse.ok) {
          throw new Error(`The ClosetIQ service is unavailable (${healthResponse.status}).`);
        }
        const [profData, wardrobeData, analysisData] = await Promise.all([
          api.getProfile(),
          api.getWardrobe(),
          api.getLatestAnalysis(),
        ]);

        setProfile(profData);
        setWardrobe(wardrobeData);
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
        setLoadError(err instanceof Error ? err.message : 'Your ClosetIQ data could not be loaded.');
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, [hasActiveSession, path]);

  if (path === '/privacy') return <LegalPage kind="privacy" />;
  if (path === '/terms') return <LegalPage kind="terms" />;
  if (path === '/admin/catalog') {
    return <CatalogAdminPage session={hasActiveSession ? session : null} onAuthSuccess={setSession} />;
  }

  return (
    <div className="min-h-screen bg-linen text-obsidian">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <EditorialHeader
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        profile={profile}
        wardrobeCount={wardrobe.length}
        isAuthenticated={hasActiveSession}
        userName={session?.fullName}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={() => {
          api.logout()
            .then(() => setSession(null))
            .catch((error: unknown) => {
              console.error('ClosetIQ sign out:', error);
              setSession(null);
              setLoadError('Sign out could not be completed. Please try again.');
            });
        }}
      />

      <main id="main-content" className="container py-8">
        {!hasActiveSession && (
          <section className="connection-notice" role="status">
            Sign in to load your wardrobe and personal style details.
          </section>
        )}
        {loadError && (
          <section className="connection-error" role="alert">
            {loadError}
          </section>
        )}

        {loading ? (
          <div className="py-24 text-center">
            <RefreshCw
              className="mx-auto mb-4 text-terracotta"
              style={{ width: '2rem', height: '2rem' }}
              aria-hidden="true"
            />
            <p className="font-serif text-2xl text-muted font-light">Loading your wardrobe...</p>
          </div>
        ) : (
          <>
            {currentTab === 'editorial' && (
              <div className="space-y-12 animate-fade-in">
                <section className="hero-panel">
                  <div className="hero-copy">
                    <span className="editorial-caps text-terracotta">ClosetIQ wardrobe studio</span>
                    <h1 className="editorial-title hero-title">Plan outfits from the clothes you own.</h1>
                    <p className="hero-description">
                      ClosetIQ helps you organize your wardrobe, review your style preferences, and plan outfits for
                      everyday wear, work, and events.
                    </p>
                    <button
                      type="button"
                      onClick={() => hasActiveSession ? setCurrentTab('wardrobe') : setIsAuthModalOpen(true)}
                      className="btn-primary"
                    >
                      {hasActiveSession ? 'View your wardrobe' : 'Sign in to get started'}
                    </button>
                  </div>
                  <aside className="profile-summary" aria-label="Style profile">
                    <p className="editorial-caps text-muted">Style profile</p>
                    <p className="profile-name">{profile?.fullName || 'Not set up'}</p>
                    {profile ? (
                      <div className="profile-details">
                        {profile.seasonalPalette && (
                          <span className="badge-formality badge-terracotta">
                            {profile.seasonalPalette.replace(/_/g, ' ')}
                          </span>
                        )}
                        {profile.bodyShapeConfirmed && (
                          <span className="badge-formality badge-olive">{profile.bodyShapeConfirmed}</span>
                        )}
                        {profile.heightCm && <span>{profile.heightCm} cm</span>}
                      </div>
                    ) : (
                      <p className="text-sm text-muted">Your preferences will appear here when a profile is connected.</p>
                    )}
                  </aside>
                </section>

                <section className="dashboard-metrics">
                  <div className="editorial-card p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="editorial-caps text-muted">Wardrobe items</span>
                      <Shirt style={{ width: '1.25rem', height: '1.25rem', color: 'var(--accent-terracotta)' }} />
                    </div>
                    <p className="font-serif text-4xl font-light text-obsidian">{wardrobe.length}</p>
                    <p className="text-xs text-muted mt-1">Items in your wardrobe</p>
                  </div>

                  <div className="editorial-card p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="editorial-caps text-muted">Outfit suggestions</span>
                      <Layers style={{ width: '1.25rem', height: '1.25rem', color: 'var(--accent-olive)' }} />
                    </div>
                    <p className="font-serif text-4xl font-light text-obsidian">{outfits.length}</p>
                    <p className="text-xs text-muted mt-1">Suggestions from your wardrobe</p>
                  </div>

                  <div className="editorial-card p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="editorial-caps text-muted">Style profile</span>
                      <Sparkles style={{ width: '1.25rem', height: '1.25rem', color: 'var(--accent-gold)' }} />
                    </div>
                    <p className="font-serif text-2xl font-light text-obsidian">
                      {profile ? 'Available' : 'Not set up'}
                    </p>
                    <p className="text-xs text-muted mt-1">Your preferences and measurements</p>
                  </div>

                  <div className="editorial-card p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="editorial-caps text-muted">Merchant catalog</span>
                      <Compass style={{ width: '1.25rem', height: '1.25rem', color: 'var(--text-obsidian)' }} />
                    </div>
                    <p className="font-serif text-2xl font-light text-obsidian">Not connected</p>
                    <p className="text-xs text-muted mt-1">Merchant items are not configured</p>
                  </div>
                </section>

                <section>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="editorial-caps text-terracotta">Outfit planning</span>
                      <h2 className="font-serif text-3xl font-light text-obsidian mt-1">Your outfit suggestions</h2>
                    </div>
                    <button type="button" onClick={() => setCurrentTab('builder')} className="btn-secondary">
                      <span>Open Outfit Builder</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {outfits.length === 0 && (
                      <div className="empty-state">
                        <h3>No outfit suggestions yet</h3>
                        <p>Add wardrobe items and connect the outfit service to see suggestions here.</p>
                      </div>
                    )}
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
                              {isProvidedImage(item.imageUrl) ? (
                                <img src={item.imageUrl} alt={item.name} loading="lazy" decoding="async" />
                              ) : (
                                <div className="image-placeholder" aria-hidden="true">
                                  <Shirt />
                                </div>
                              )}
                              <div
                                style={{
                                  position: 'absolute',
                                  inset: 'auto 0 0 0',
                                  padding: '0.4rem',
                                  background: 'rgba(20, 20, 22, 0.86)',
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
                            {outfit.stylingAdvice?.headline || 'Styling notes'}
                          </p>
                          <p className="text-xs text-muted" style={{ lineHeight: '1.6' }}>
                            {outfit.stylingAdvice?.editorialSummary || 'No notes were provided for this outfit.'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

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
                      Your saved garments and the details you choose to record.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {wardrobe.length === 0 && (
                    <div className="empty-state empty-state-wide">
                      <h2>Your wardrobe is empty</h2>
                      <p>[TODO: connect the garment upload flow before launch.]</p>
                    </div>
                  )}
                  {wardrobe.map((item) => (
                    <div key={item.id} className="editorial-card flex flex-col">
                      <div className="aspect-garment">
                        {isProvidedImage(item.imageUrl) ? (
                          <img src={item.imageUrl} alt={item.name} loading="lazy" decoding="async" />
                        ) : (
                          <div className="image-placeholder" aria-hidden="true">
                            <Shirt />
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
                            {item.brand || 'Brand not provided'}
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

            {currentTab === 'builder' && (
              <div className="space-y-8 animate-fade-in">
                <div className="pb-6" style={{ borderBottom: '1px solid var(--border-stone)' }}>
                  <span className="editorial-caps text-terracotta">Outfit planning</span>
                  <h1 className="editorial-title text-4xl font-light text-obsidian mt-1">
                    Outfit Builder
                  </h1>
                  <p className="text-sm text-muted mt-1" style={{ maxWidth: '44rem' }}>
                    Build outfit combinations from your wardrobe and see the details behind each suggestion.
                  </p>
                </div>

                <div className="space-y-8">
                  {outfits.length === 0 && (
                    <div className="empty-state">
                      <h2>No outfits to show</h2>
                      <p>Outfit suggestions will appear when wardrobe items and the recommendation service are available.</p>
                    </div>
                  )}
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
                            className="score-sparkle-icon flex items-center justify-center text-white bg-obsidian"
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
                            {outfit.ruleBreakdown?.colorHarmony?.details || 'No color notes provided.'}
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
                            {outfit.ruleBreakdown?.silhouetteBalance?.critique || 'No silhouette notes provided.'}
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
                            {outfit.ruleBreakdown?.formalityAlignment?.critique || 'No formality notes provided.'}
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
                              {isProvidedImage(item.imageUrl) ? (
                                <img src={item.imageUrl} alt={item.name} loading="lazy" decoding="async" />
                              ) : (
                                <div className="image-placeholder" aria-hidden="true">
                                  <Shirt />
                                </div>
                              )}
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
                  <span className="editorial-caps text-terracotta">Style preferences</span>
                  <h1 className="editorial-title text-4xl font-light text-obsidian mt-1">
                    Style analysis
                  </h1>
                  <p className="text-sm text-muted mt-1">
                    Review the measurements and color preferences saved to your profile.
                  </p>
                </div>

                {!analysis && (
                  <div className="empty-state" role="status">
                    <h2>No completed analysis</h2>
                    <p>Analysis results will appear here after a completed assessment is connected to your profile.</p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="editorial-card p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-serif text-2xl font-medium text-obsidian">Geometric Morphometry</h3>
                        <p className="text-xs text-muted mt-0.5">Anatomical proportions & classification</p>
                      </div>
                      <span className="badge-formality badge-olive">
                        {analysis?.detectedBodyShape || 'Not available'}
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
                          {analysis?.shoulderHipRatio ?? 'Not available'}
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
                          {analysis?.waistHipRatio ?? 'Not available'}
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
                          {analysis?.torsoLegRatio ?? 'Not available'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="editorial-card p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-serif text-2xl font-medium text-obsidian">Spectrometric Colorimetry</h3>
                        <p className="text-xs text-muted mt-0.5">CIELAB coordinates & ITA° typology</p>
                      </div>
                      <span className="badge-formality badge-terracotta">
                        {analysis?.detectedPalette || 'Not available'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div
                        className="p-4 rounded-xl bg-linen-warm"
                        style={{ border: '1px solid var(--border-stone)' }}
                      >
                        <p className="font-mono text-muted" style={{ fontSize: '0.7rem' }}>L* (Luminance)</p>
                        <p className="font-mono text-xl font-semibold text-obsidian mt-1">
                          {analysis?.skinLabL ?? 'Not available'}
                        </p>
                      </div>
                      <div
                        className="p-4 rounded-xl bg-linen-warm"
                        style={{ border: '1px solid var(--border-stone)' }}
                      >
                        <p className="font-mono text-muted" style={{ fontSize: '0.7rem' }}>a* (Red-Green)</p>
                        <p className="font-mono text-xl font-semibold text-obsidian mt-1">
                          {analysis?.skinLabA ?? 'Not available'}
                        </p>
                      </div>
                      <div
                        className="p-4 rounded-xl bg-linen-warm"
                        style={{ border: '1px solid var(--border-stone)' }}
                      >
                        <p className="font-mono text-muted" style={{ fontSize: '0.7rem' }}>b* (Yellow-Blue)</p>
                        <p className="font-mono text-xl font-semibold text-obsidian mt-1">
                          {analysis?.skinLabB ?? 'Not available'}
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
                          {analysis?.itaAngle != null ? `${analysis.itaAngle}°` : 'Not available'}
                        </span>
                      </div>
                      <div
                        className="flex justify-between items-center pt-3"
                        style={{ borderTop: '1px solid var(--border-stone-light)' }}
                      >
                        <span className="text-xs font-medium text-muted">Confirmed Undertone</span>
                        <span className="badge-formality badge-olive">
                          {analysis?.detectedUndertone || 'Not available'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentTab === 'discovery' && (
              <ProductDiscovery
                isAuthenticated={hasActiveSession}
                onOpenAuth={() => setIsAuthModalOpen(true)}
              />
            )}
          </>
        )}
      </main>
      <SiteFooter />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={setSession}
      />
    </div>
  );
};

export default App;
