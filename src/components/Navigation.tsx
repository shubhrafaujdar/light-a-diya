"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/hooks/useLanguage';
import { SettingsMenu } from '@/components/SettingsMenu';
import { analytics } from '@/lib/analytics';

interface NavItem {
  href?: string;
  label: {
    hindi: string;
    english: string;
  };
  children?: NavItem[];
  comingSoon?: boolean;
}

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { language, toggleLanguage, isLoading: languageLoading } = useLanguage();

  const handleSignIn = async () => {
    // Use the auth service directly to avoid hook rules in event handlers
    const { authService } = await import('@/lib/auth');
    await authService.signInWithGoogle(window.location.pathname);
  };

  const handleSignOut = async () => {
    const { authService } = await import('@/lib/auth');
    await authService.signOut();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigationItems: NavItem[] = [
    {
      href: '/aartis',
      label: {
        hindi: 'आरती संग्रह',
        english: 'Aarti Sangrah'
      }
    },
    {
      href: '/diya',
      label: {
        hindi: 'दीया जलाएं',
        english: 'Light a Diya'
      }
    },
    {
      label: {
        hindi: 'धर्मग्रंथ',
        english: 'Scriptures'
      },
      children: [
        {
          href: '/gita',
          label: {
            hindi: 'गीता',
            english: 'Gita'
          }
        },
        {
          label: {
            hindi: 'रामायण',
            english: 'Ramayana'
          },
          comingSoon: true
        }
      ]
    },
    {
      href: '/quiz',
      label: {
        hindi: 'आध्यात्मिक प्रश्नोत्तरी',
        english: 'Spiritual Quiz'
      }
    },
    ...(user ? [{
      href: '/celebrations',
      label: {
        hindi: 'मेरे उत्सव',
        english: 'My Celebrations'
      }
    }] : [])
  ];

  return (
    <header>
      <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-spiritual-secondary/20 sticky top-0 z-50" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-spiritual-accent to-spiritual-secondary rounded-full flex items-center justify-center spiritual-glow">
                  <span className="text-white font-bold text-sm">ॐ</span>
                </div>
                <span className="text-xl font-bold text-spiritual-primary group-hover:text-spiritual-primary-light spiritual-transition">
                  Dharma.com
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item, index) => {
                if (item.children) {
                  return (
                    <div key={index} className="relative group">
                      <button className="flex items-center gap-1 text-gray-700 hover:text-spiritual-primary font-medium spiritual-transition px-3 py-2 rounded-md hover:bg-spiritual-primary/5">
                        <span className={language === 'hindi' ? 'hindi-text' : 'english-text'}>
                          {item.label[language]}
                        </span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50">
                        <div className="py-1">
                          {item.children.map((child, childIndex) => (
                            child.comingSoon ? (
                              <div
                                key={childIndex}
                                className="block px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
                                onClick={() => child.label.english === 'Ramayana' && analytics.clickComingSoon('ramayana')}
                              >
                                <div className="flex justify-between items-center">
                                  <span className={language === 'hindi' ? 'hindi-text' : 'english-text'}>
                                    {child.label[language]}
                                  </span>
                                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                    {language === 'hindi' ? 'शीघ्र' : 'Soon'}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <Link
                                key={child.href}
                                href={child.href!} // We know it's there if not comingSoon
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-spiritual-primary w-full text-left"
                                onClick={() => child.label.english === 'Gita' && analytics.scriptureNavigation('gita', 'menu_select')}
                              >
                                <span className={language === 'hindi' ? 'hindi-text' : 'english-text'}>
                                  {child.label[language]}
                                </span>
                              </Link>
                            )
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href!}
                    className="text-gray-700 hover:text-spiritual-primary font-medium spiritual-transition px-3 py-2 rounded-md hover:bg-spiritual-primary/5"
                  >
                    <span className={language === 'hindi' ? 'hindi-text' : 'english-text'}>
                      {item.label[language]}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Settings Menu */}
              <SettingsMenu />

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                disabled={languageLoading}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-spiritual-primary/10 hover:bg-spiritual-primary/20 spiritual-transition text-sm font-medium text-spiritual-primary border border-spiritual-primary/20 hover:border-spiritual-primary/40"
                aria-label={`Switch to ${language === 'hindi' ? 'English' : 'Hindi'}`}
                title={`Switch to ${language === 'hindi' ? 'English' : 'Hindi'}`}
              >
                <span className="flex items-center space-x-1">
                  <span className={language === 'hindi' ? 'hindi-text' : 'english-text'}>
                    {language === 'hindi' ? 'अ' : 'A'}
                  </span>
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span className={language === 'english' ? 'hindi-text' : 'english-text'}>
                    {language === 'english' ? 'अ' : 'A'}
                  </span>
                </span>
              </button>

              {/* Authentication */}
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {user.displayName}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-sm font-medium text-spiritual-primary border border-spiritual-primary rounded-md hover:bg-spiritual-primary hover:text-white spiritual-transition"
                  >
                    <span className={language === 'hindi' ? 'hindi-text' : 'english-text'}>
                      {language === 'hindi' ? 'साइन आउट' : 'Sign Out'}
                    </span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="px-4 py-2 text-sm font-medium text-white bg-spiritual-primary rounded-md hover:bg-spiritual-primary-light spiritual-transition shadow-md"
                >
                  <span className={language === 'hindi' ? 'hindi-text' : 'english-text'}>
                    {language === 'hindi' ? 'साइन इन' : 'Sign In'}
                  </span>
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-spiritual-primary hover:bg-spiritual-primary/5 spiritual-transition"
                aria-expanded="false"
                aria-label="Toggle navigation menu"
              >
                <svg
                  className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden pb-4`}>
            <div className="space-y-2">
              {navigationItems.map((item, index) => {
                if (item.children) {
                  return (
                    <div key={index} className="space-y-1">
                      <div className="px-3 py-2 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                        {item.label[language]}
                      </div>
                      {item.children.map((child, cIdx) => (
                        child.comingSoon ? (
                          <div key={cIdx} className="block pl-6 pr-3 py-2 text-gray-400 text-sm flex justify-between">
                            <span>{child.label[language]}</span>
                            <span className="text-xs bg-gray-100 px-2 rounded-full">{language === 'hindi' ? 'शीघ्र' : 'Soon'}</span>
                          </div>
                        ) : (
                          <Link
                            key={cIdx}
                            href={child.href!}
                            className="block pl-6 pr-3 py-2 text-gray-700 hover:text-spiritual-primary hover:bg-spiritual-primary/5 rounded-md spiritual-transition"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {child.label[language]}
                          </Link>
                        )
                      ))}
                    </div>
                  );
                }

                return (
                  <Link
                    key={index}
                    href={item.href!}
                    className="block px-3 py-2 text-gray-700 hover:text-spiritual-primary hover:bg-spiritual-primary/5 rounded-md spiritual-transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className={language === 'hindi' ? 'hindi-text' : 'english-text'}>
                      {item.label[language]}
                    </span>
                  </Link>
                );
              })}

              {/* Mobile Settings Menu - Inline */}
              <div className="px-3 py-2 border-t border-gray-200 mt-2 pt-4">
                <div className="mb-2">
                  <SettingsMenu />
                </div>
              </div>

              {/* Mobile Language Toggle */}
              <button
                onClick={toggleLanguage}
                disabled={languageLoading}
                className="w-full text-left px-3 py-2 text-gray-700 hover:text-spiritual-primary hover:bg-spiritual-primary/5 rounded-md spiritual-transition"
              >
                <span className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1">
                    <span className={language === 'hindi' ? 'hindi-text' : 'english-text'}>
                      {language === 'hindi' ? 'अ' : 'A'}
                    </span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span className={language === 'english' ? 'hindi-text' : 'english-text'}>
                      {language === 'english' ? 'अ' : 'A'}
                    </span>
                  </span>
                  <span className={language === 'hindi' ? 'hindi-text' : 'english-text'}>
                    {language === 'hindi' ? 'भाषा बदलें' : 'Switch Language'}
                  </span>
                </span>
              </button>

              {/* Mobile Authentication */}
              <div className="pt-2 border-t border-gray-200">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm text-gray-600">
                      {user.displayName}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 text-spiritual-primary hover:bg-spiritual-primary/5 rounded-md spiritual-transition"
                    >
                      <span className={language === 'hindi' ? 'hindi-text' : 'english-text'}>
                        {language === 'hindi' ? 'साइन आउट' : 'Sign Out'}
                      </span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleSignIn}
                    className="w-full text-left px-3 py-2 text-white bg-spiritual-primary rounded-md hover:bg-spiritual-primary-light spiritual-transition"
                  >
                    <span className={language === 'hindi' ? 'hindi-text' : 'english-text'}>
                      {language === 'hindi' ? 'साइन इन' : 'Sign In'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}