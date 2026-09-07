import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Download, LogIn, Shield } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { navigationItems, productLinks } from '../../data/links';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-2.5 bg-white/95 dark:bg-[#071A10]/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 dark:border-darkbg-border'
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#home"
            className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded-lg"
            onClick={(e) => handleNavClick(e, '#home')}
            aria-label="Sehat Sahara Home"
          >
            <Logo variant="auto" imgClassName="h-9 sm:h-10 w-auto" />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-100/70 dark:hover:bg-darkbg-800/80 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Right-Side Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              type="button"
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-darkbg-800 border border-slate-200/60 dark:border-darkbg-border transition-colors"
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Hospital / Clinic Login (Secondary) */}
            <a
              href={productLinks.hospitalLogin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-brand-700 dark:text-brand-300 hover:text-brand-800 dark:hover:text-white bg-brand-50 dark:bg-darkbg-card hover:bg-brand-100/70 dark:hover:bg-darkbg-800 border border-brand-200/80 dark:border-darkbg-border rounded-full transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Hospital Login</span>
            </a>

            {/* Download App (Primary) */}
            <a
              href={productLinks.downloadApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-full shadow-sm hover:shadow transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download App</span>
            </a>
          </div>

          {/* Mobile Actions: Theme + Hamburger */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              onClick={toggleTheme}
              type="button"
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-darkbg-800"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-darkbg-800 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#071A10] border-b border-slate-200 dark:border-darkbg-border px-4 pt-3 pb-5 space-y-3 shadow-2xl animate-in fade-in slide-in-from-top-2">
          <nav className="grid grid-cols-2 gap-2 text-center">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="px-3.5 py-2 text-xs sm:text-sm font-semibold !text-slate-800 dark:!text-slate-100 hover:!text-brand-700 dark:hover:!text-emerald-400 bg-slate-100/80 dark:bg-darkbg-card hover:bg-emerald-50 dark:hover:bg-darkbg-800 border border-slate-200/70 dark:border-darkbg-border rounded-full text-center transition-all"
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-200 dark:border-darkbg-border flex flex-col gap-2.5">
            <a
              href={productLinks.hospitalLogin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold !text-emerald-800 dark:!text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 rounded-full hover:bg-emerald-100 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Hospital / Clinic Login</span>
            </a>

            <a
              href={productLinks.downloadApp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold !text-white bg-brand-600 hover:bg-brand-700 rounded-full shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Sehat Sahara App</span>
            </a>

            <a
              href={productLinks.adminDashboard}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold !text-slate-500 dark:!text-slate-400 hover:!text-slate-800 dark:hover:!text-white transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Login as Admin</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
