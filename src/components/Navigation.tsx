"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/lib/supabase';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useUser();
  const { language, toggleLanguage, isLoading: languageLoading } = useLanguage();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigationItems = [
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
    }
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-spiritual-secondary/20 sticky top-0 z-50">
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
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-spiritual-primary font-medium spiritual-transition px-3 py-2 rounded-md hover:bg-spiritual-primary/5"
              >
                <span className={language === 'hindi' ? 'devanagari' : ''}>
                  {item.label[language]}
                </span>
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              disabled={languageLoading}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-spiritual-primary/10 hover:bg-spiritual-primary/20 spiritual-transition text-sm font-medium text-spiritual-primary"
              aria-label="Toggle language"
            >
              <span className={language === 'hindi' ? 'devanagari' : ''}>
                {language === 'hindi' ? 'हिं' : 'EN'}
              </span>
              <span className="text-xs">|</span>
              <span className={language === 'english' ? 'devanagari' : ''}>
                {language === 'english' ? 'हिं' : 'EN'}
              </span>
            </button>

            {/* Authentication */}
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                </span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-spiritual-primary border border-spiritual-primary rounded-md hover:bg-spiritual-primary hover:text-white spiritual-transition"
                >
                  {language === 'hindi' ? 'साइन आउट' : 'Sign Out'}
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="px-4 py-2 text-sm font-medium text-white bg-spiritual-primary rounded-md hover:bg-spiritual-primary-light spiritual-transition shadow-md"
              >
                {language === 'hindi' ? 'साइन इन' : 'Sign In'}
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
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-gray-700 hover:text-spiritual-primary hover:bg-spiritual-primary/5 rounded-md spiritual-transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className={language === 'hindi' ? 'devanagari' : ''}>
                  {item.label[language]}
                </span>
              </Link>
            ))}
            
            {/* Mobile Language Toggle */}
            <button
              onClick={toggleLanguage}
              disabled={languageLoading}
              className="w-full text-left px-3 py-2 text-gray-700 hover:text-spiritual-primary hover:bg-spiritual-primary/5 rounded-md spiritual-transition"
            >
              <span className="flex items-center space-x-2">
                <span>{language === 'hindi' ? '🇮🇳' : '🇺🇸'}</span>
                <span className={language === 'hindi' ? 'devanagari' : ''}>
                  {language === 'hindi' ? 'भाषा बदलें' : 'Switch Language'}
                </span>
              </span>
            </button>

            {/* Mobile Authentication */}
            <div className="pt-2 border-t border-gray-200">
              {user ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 text-sm text-gray-600">
                    {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-spiritual-primary hover:bg-spiritual-primary/5 rounded-md spiritual-transition"
                  >
                    {language === 'hindi' ? 'साइन आउट' : 'Sign Out'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="w-full text-left px-3 py-2 text-white bg-spiritual-primary rounded-md hover:bg-spiritual-primary-light spiritual-transition"
                >
                  {language === 'hindi' ? 'साइन इन' : 'Sign In'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}