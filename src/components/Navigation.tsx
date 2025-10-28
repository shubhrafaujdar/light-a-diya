"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/hooks/useLanguage';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useUser();
  const { language, toggleLanguage, isLoading: languageLoading } = useLanguage();

  const handleSignIn = async () => {
    // Use the auth service directly to avoid hook rules in event handlers
    const { authService } = await import('@/lib/auth');
    await authService.signInWithGoogle();
  };

  const handleSignOut = async () => {
    const { authService } = await import('@/lib/auth');
    await authService.signOut();
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
                <span className={language === 'hindi' ? 'hindi-text' : 'english-text'}>
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
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-gray-700 hover:text-spiritual-primary hover:bg-spiritual-primary/5 rounded-md spiritual-transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className={language === 'hindi' ? 'hindi-text' : 'english-text'}>
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
  );
}