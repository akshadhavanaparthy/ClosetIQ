import React from 'react';
import { Sparkles, Compass, Shirt, Layers } from 'lucide-react';
import { ProfileResponseDto } from '@closetiq/shared-types';

interface EditorialHeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  profile: ProfileResponseDto | null;
  wardrobeCount: number;
  isAuthenticated: boolean;
  userName?: string;
  onOpenAuth: () => void;
}

export const EditorialHeader: React.FC<EditorialHeaderProps> = ({
  currentTab,
  onTabChange,
  profile,
  wardrobeCount,
  isAuthenticated,
  userName,
  onOpenAuth,
}) => {
  return (
    <header className="site-header">
      <div className="container header-content">
        <button
          type="button"
          className="brand-home"
          onClick={() => onTabChange('editorial')}
          aria-label="ClosetIQ home"
        >
          <div className="brand-badge">Q</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-medium text-obsidian brand-name">
                ClosetIQ
              </span>
            </div>
            <p className="brand-caption">
              Wardrobe and outfit planning
            </p>
          </div>
        </button>

        <nav className="nav-pills" aria-label="Primary navigation">
          <button
            type="button"
            onClick={() => onTabChange('editorial')}
            className={`pill-tab ${currentTab === 'editorial' ? 'active' : ''}`}
            aria-current={currentTab === 'editorial' ? 'page' : undefined}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => onTabChange('wardrobe')}
            className={`pill-tab ${currentTab === 'wardrobe' ? 'active' : ''}`}
            aria-current={currentTab === 'wardrobe' ? 'page' : undefined}
          >
            <Shirt style={{ width: '0.875rem', height: '0.875rem' }} />
            <span>Wardrobe</span>
            <span className="tab-badge">{wardrobeCount}</span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange('builder')}
            className={`pill-tab ${currentTab === 'builder' ? 'active' : ''}`}
            aria-current={currentTab === 'builder' ? 'page' : undefined}
          >
            <Layers style={{ width: '0.875rem', height: '0.875rem' }} />
            <span>Outfit Builder</span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange('analysis')}
            className={`pill-tab ${currentTab === 'analysis' ? 'active' : ''}`}
            aria-current={currentTab === 'analysis' ? 'page' : undefined}
          >
            <Sparkles style={{ width: '0.875rem', height: '0.875rem' }} />
            <span>Style Analysis</span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange('discovery')}
            className={`pill-tab ${currentTab === 'discovery' ? 'active' : ''}`}
            aria-current={currentTab === 'discovery' ? 'page' : undefined}
          >
            <Compass style={{ width: '0.875rem', height: '0.875rem' }} />
            <span>Discovery</span>
          </button>
        </nav>

        <div className="header-account" aria-live="polite">
          {isAuthenticated ? (
            <span>{profile?.fullName || userName || 'Personal studio'}</span>
          ) : (
            <button type="button" className="header-auth-action" onClick={onOpenAuth}>
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
