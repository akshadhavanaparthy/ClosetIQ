import React from 'react';
import { Sparkles, Plus, Compass, Shirt, Layers, UserCheck } from 'lucide-react';
import { ProfileResponseDto } from '@closetiq/shared-types';

interface EditorialHeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  profile: ProfileResponseDto | null;
  wardrobeCount: number;
  onOpenAddModal: () => void;
  onStartOnboarding: () => void;
}

export const EditorialHeader: React.FC<EditorialHeaderProps> = ({
  currentTab,
  onTabChange,
  profile,
  wardrobeCount,
  onOpenAddModal,
  onStartOnboarding,
}) => {
  return (
    <header className="glass-header py-3 px-6">
      <div className="container flex items-center justify-between gap-4">
        {/* Brand Mark */}
        <div
          className="flex items-center gap-3"
          style={{ cursor: 'pointer' }}
          onClick={() => onTabChange('editorial')}
        >
          <div className="brand-badge">Q</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-medium text-obsidian" style={{ letterSpacing: '-0.02em' }}>
                ClosetIQ
              </span>
              <span className="badge-formality" style={{ fontSize: '0.62rem', padding: '0.15rem 0.5rem' }}>
                Determinism
              </span>
            </div>
            <p className="text-xs text-muted font-sans uppercase" style={{ letterSpacing: '0.12em', fontSize: '0.65rem' }}>
              Editorial Fashion Intelligence
            </p>
          </div>
        </div>

        {/* Navigation Pills */}
        <nav className="nav-pills">
          <button
            onClick={() => onTabChange('editorial')}
            className={`pill-tab ${currentTab === 'editorial' ? 'active' : ''}`}
          >
            Editorial
          </button>
          <button
            onClick={() => onTabChange('wardrobe')}
            className={`pill-tab ${currentTab === 'wardrobe' ? 'active' : ''}`}
          >
            <Shirt style={{ width: '0.875rem', height: '0.875rem' }} />
            <span>Wardrobe</span>
            <span className="tab-badge">{wardrobeCount}</span>
          </button>
          <button
            onClick={() => onTabChange('builder')}
            className={`pill-tab ${currentTab === 'builder' ? 'active' : ''}`}
          >
            <Layers style={{ width: '0.875rem', height: '0.875rem' }} />
            <span>Outfit Builder</span>
          </button>
          <button
            onClick={() => onTabChange('analysis')}
            className={`pill-tab ${currentTab === 'analysis' ? 'active' : ''}`}
          >
            <Sparkles style={{ width: '0.875rem', height: '0.875rem' }} />
            <span>Analysis Lab</span>
          </button>
          <button
            onClick={() => onTabChange('discovery')}
            className={`pill-tab ${currentTab === 'discovery' ? 'active' : ''}`}
          >
            <Compass style={{ width: '0.875rem', height: '0.875rem' }} />
            <span>Discovery</span>
          </button>
        </nav>

        {/* Action Controls & User Profile Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAddModal}
            className="btn-primary"
            style={{ fontSize: '0.78rem', padding: '0.5rem 1.1rem' }}
          >
            <Plus style={{ width: '0.875rem', height: '0.875rem' }} />
            <span>Add Garment</span>
          </button>

          <button
            onClick={onStartOnboarding}
            className="flex items-center gap-2 p-2 rounded-full border-stone bg-linen-pure"
            style={{ border: '1px solid var(--border-stone)', cursor: 'pointer', paddingRight: '1rem' }}
          >
            <div
              className="rounded-full flex items-center justify-center text-olive"
              style={{
                width: '1.75rem',
                height: '1.75rem',
                backgroundColor: 'var(--accent-olive-light)',
              }}
            >
              <UserCheck style={{ width: '0.9rem', height: '0.9rem' }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <p className="text-xs font-medium text-obsidian" style={{ lineHeight: '1.1' }}>
                {profile?.fullName || 'Style Profile'}
              </p>
              <p className="text-muted" style={{ fontSize: '0.65rem', lineHeight: '1' }}>
                {profile?.seasonalPalette ? profile.seasonalPalette.replace('_', ' ') : 'Assessment'}
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
