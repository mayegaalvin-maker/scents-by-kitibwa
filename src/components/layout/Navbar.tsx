import { useState } from 'react';
import { ArrowUpRight, Menu, Shield, X } from 'lucide-react';
import type { StorePage } from '../../types';

interface NavbarProps {
  activePage: StorePage;
  navigate: (page: StorePage) => void;
}

export function Navbar({ activePage, navigate }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links: { label: string; page: StorePage }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Shop', page: 'shop' },
    { label: 'Our story', page: 'about' },
    { label: 'Find us', page: 'visit' },
  ];

  const goTo = (page: StorePage) => {
    navigate(page);
    setMenuOpen(false);
  };

  return (
    <>
      <div className="announcement-bar">New Pioneer Mall · Burton Street · Kampala</div>
      <header className="site-header">
        <div className="nav-shell">
          <button className="mobile-menu-button icon-button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <button className="brand-lockup" onClick={() => goTo('home')} aria-label="Scents By Kitiibwa home">
            <span className="brand-flower" aria-hidden="true">S</span>
            <span className="brand-type"><strong>Scents By Kitiibwa</strong><small>Fragrance · Beauty · Care</small></span>
          </button>
          <nav className={`primary-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
            {links.map(({ label, page }) => (
              <button key={page} className={`nav-link ${activePage === page ? 'active' : ''}`} onClick={() => goTo(page)}>{label}</button>
            ))}
            <button className="nav-mobile-owner" onClick={() => goTo('admin')}><Shield size={15} /> Owner portal</button>
          </nav>
          <div className="nav-actions">
            <a className="nav-call" href="tel:+256752576561">+256 752 576561</a>
            <button className={`owner-link ${activePage === 'admin' ? 'active' : ''}`} onClick={() => goTo('admin')} aria-label="Open owner portal" title="Owner portal"><Shield size={15} /><span>Owner</span></button>
            <a className="nav-whatsapp" href="https://wa.me/256752576561" target="_blank" rel="noreferrer" aria-label="Message the shop on WhatsApp"><ArrowUpRight size={16} /></a>
          </div>
        </div>
      </header>
    </>
  );
}