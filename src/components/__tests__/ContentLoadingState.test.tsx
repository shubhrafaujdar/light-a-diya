import React from 'react';
import { render, screen } from '@testing-library/react';
import ContentLoadingState from '../ContentLoadingState';

// Mock the useLanguage hook
jest.mock('@/hooks/useLanguage', () => ({
  useLanguage: jest.fn(() => ({ language: 'english' }))
}));

const renderWithLanguage = (component: React.ReactElement, language: 'hindi' | 'english' = 'english') => {
  const { useLanguage } = jest.requireMock('@/hooks/useLanguage');
  useLanguage.mockReturnValue({ language });
  return render(component);
};

describe('ContentLoadingState', () => {
  it('renders aarti loading skeleton correctly', () => {
    renderWithLanguage(<ContentLoadingState type="aarti" />);
    
    // Check for loading state accessibility
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
  });

  it('renders deity loading skeleton correctly', () => {
    renderWithLanguage(<ContentLoadingState type="deity" />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
  });

  it('renders list loading skeleton correctly', () => {
    renderWithLanguage(<ContentLoadingState type="list" />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders page loading skeleton correctly', () => {
    renderWithLanguage(<ContentLoadingState type="page" />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders with Hindi aria-label when language is Hindi', () => {
    renderWithLanguage(<ContentLoadingState type="aarti" />, 'hindi');
    
    expect(screen.getByLabelText('लोड हो रहा है...')).toBeInTheDocument();
  });

  it('applies custom className correctly', () => {
    const { container } = renderWithLanguage(
      <ContentLoadingState type="aarti" className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});