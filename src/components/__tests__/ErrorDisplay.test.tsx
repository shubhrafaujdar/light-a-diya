import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorDisplay from '../ErrorDisplay';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

// Mock the useLanguage hook
jest.mock('@/hooks/useLanguage', () => ({
  useLanguage: jest.fn(() => ({ language: 'english' }))
}));

const renderWithLanguage = (component: React.ReactElement, language: 'hindi' | 'english' = 'english') => {
  const { useLanguage } = jest.requireMock('@/hooks/useLanguage');
  useLanguage.mockReturnValue({ language });
  return render(component);
};

describe('ErrorDisplay', () => {
  it('renders error message correctly', () => {
    renderWithLanguage(
      <ErrorDisplay error="Test error message" type="content" />
    );
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Please try again later.')).toBeInTheDocument();
  });

  it('renders aarti-specific error correctly', () => {
    renderWithLanguage(
      <ErrorDisplay error="Aarti not found" type="aarti" />
    );
    
    expect(screen.getByText('Aarti not found')).toBeInTheDocument();
    expect(screen.getByText('This aarti is not available or has been removed.')).toBeInTheDocument();
  });

  it('renders deity-specific error correctly', () => {
    renderWithLanguage(
      <ErrorDisplay error="Deity not found" type="deity" />
    );
    
    expect(screen.getByText('Deity not found')).toBeInTheDocument();
    expect(screen.getByText('This deity is not available or has been removed.')).toBeInTheDocument();
  });

  it('shows retry button for network errors', () => {
    const mockRetry = jest.fn();
    
    renderWithLanguage(
      <ErrorDisplay 
        error="Network error" 
        type="network" 
        onRetry={mockRetry}
      />
    );
    
    const retryButton = screen.getByText('Try Again');
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when retrying', () => {
    const mockRetry = jest.fn();
    
    renderWithLanguage(
      <ErrorDisplay 
        error="Network error" 
        type="network" 
        onRetry={mockRetry}
        retrying={true}
      />
    );
    
    expect(screen.getByText('Retrying...')).toBeInTheDocument();
  });

  it('renders in Hindi when language is set to Hindi', () => {
    renderWithLanguage(
      <ErrorDisplay error="Test error" type="aarti" />,
      'hindi'
    );
    
    expect(screen.getByText('आरती नहीं मिली')).toBeInTheDocument();
    expect(screen.getByText('यह आरती उपलब्ध नहीं है या हटा दी गई है।')).toBeInTheDocument();
  });

  it('includes fallback link with correct URL', () => {
    renderWithLanguage(
      <ErrorDisplay 
        error="Test error" 
        type="content"
        fallbackUrl="/custom-fallback"
        fallbackText="Custom Fallback"
      />
    );
    
    const fallbackLink = screen.getByText('Custom Fallback');
    expect(fallbackLink.closest('a')).toHaveAttribute('href', '/custom-fallback');
  });
});