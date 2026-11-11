import React from 'react';

export const SiteFooter: React.FC = () => (
  <footer className="site-footer">
    <div className="container footer-content">
      <div>
        <p className="footer-brand">ClosetIQ</p>
        <p className="footer-description">Wardrobe and outfit planning</p>
      </div>
      <nav className="footer-links" aria-label="Footer navigation">
        <a href="/">Studio</a>
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms and Conditions</a>
      </nav>
    </div>
  </footer>
);
