import React from 'react';
import { render } from '@testing-library/react';
import { DeityGrid } from '../DeityGrid';
import { Deity, Language } from '@/types';

// Mock the DeityCard component to avoid image loading issues in tests
jest.mock('../DeityCard', () => ({
  DeityCard: ({ deity, language }: { deity: Deity; language: Language }) => (
    <div data-testid={`deity-card-${deity.id}`} className="mock-deity-card">
      {language === 'hindi' ? deity.name_hindi : deity.name}
    </div>
  )
}));

// Mock deity data
const mockDeity: Deity = {
  id: '1',
  name: 'Test Deity',
  name_hindi: 'टेस्ट देवता',
  description: 'Test description',
  description_hindi: 'टेस्ट विवरण',
  image_url: '/test-image.jpg',
  significance: 'Test significance',
  significance_hindi: 'टेस्ट महत्व',
  mantras: ['Test mantra'],
  mantras_hindi: ['टेस्ट मंत्र'],
  festivals: ['Test festival'],
  festivals_hindi: ['टेस्ट त्योहार'],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

const createMockDeities = (count: number): Deity[] => {
  return Array.from({ length: count }, (_, index) => ({
    ...mockDeity,
    id: `${index + 1}`,
    name: `Test Deity ${index + 1}`,
    name_hindi: `टेस्ट देवता ${index + 1}`
  }));
};

// Mock window.matchMedia for responsive testing
const mockMatchMedia = (width: number) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // Mock window.innerWidth
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
};

describe('DeityGrid Responsive Breakpoint Tests', () => {
  const defaultProps = {
    language: 'english' as Language,
    loading: false,
    error: null,
    setupRequired: false
  };

  beforeEach(() => {
    // Reset window properties before each test
    delete (window as any).matchMedia;
    delete (window as any).innerWidth;
  });

  describe('Mobile Breakpoint (< 768px)', () => {
    beforeEach(() => {
      mockMatchMedia(375); // iPhone width
    });

    test('should apply mobile-first responsive classes for single card', () => {
      const { container } = render(
        <DeityGrid {...defaultProps} deities={createMockDeities(1)} />
      );
      
      const cardContainer = container.querySelector('.w-full.max-w-sm');
      expect(cardContainer).toBeInTheDocument();
      expect(cardContainer).toHaveClass('w-full');
      expect(cardContainer).toHaveClass('max-w-sm');
    });

    test('should maintain center alignment on mobile with multiple cards', () => {
      const { container } = render(
        <DeityGrid {...defaultProps} deities={createMockDeities(3)} />
      );
      
      const gridContainer = container.querySelector('.justify-center');
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('justify-center');
      
      const cardContainers = container.querySelectorAll('.w-full');
      expect(cardContainers).toHaveLength(3);
    });
  });

  describe('Tablet Breakpoint (768px - 1023px)', () => {
    beforeEach(() => {
      mockMatchMedia(768); // iPad width
    });

    test('should apply tablet responsive classes', () => {
      const { container } = render(
        <DeityGrid {...defaultProps} deities={createMockDeities(2)} />
      );
      
      const cardContainers = container.querySelectorAll('.md\\:w-\\[calc\\(50\\%-12px\\)\\]');
      expect(cardContainers).toHaveLength(2);
      
      cardContainers.forEach(card => {
        expect(card).toHaveClass('md:w-[calc(50%-12px)]');
      });
    });

    test('should center partial rows on tablet', () => {
      const { container } = render(
        <DeityGrid {...defaultProps} deities={createMockDeities(3)} />
      );
      
      const gridContainer = container.querySelector('.justify-center');
      expect(gridContainer).toBeInTheDocument();
      
      const cardContainers = container.querySelectorAll('.md\\:w-\\[calc\\(50\\%-12px\\)\\]');
      expect(cardContainers).toHaveLength(3);
    });
  });

  describe('Desktop Breakpoint (1024px - 1279px)', () => {
    beforeEach(() => {
      mockMatchMedia(1024); // Desktop width
    });

    test('should apply desktop responsive classes', () => {
      const { container } = render(
        <DeityGrid {...defaultProps} deities={createMockDeities(3)} />
      );
      
      const cardContainers = container.querySelectorAll('.lg\\:w-\\[calc\\(33\\.333\\%-16px\\)\\]');
      expect(cardContainers).toHaveLength(3);
      
      cardContainers.forEach(card => {
        expect(card).toHaveClass('lg:w-[calc(33.333%-16px)]');
      });
    });

    test('should center incomplete rows on desktop', () => {
      const { container } = render(
        <DeityGrid {...defaultProps} deities={createMockDeities(2)} />
      );
      
      const gridContainer = container.querySelector('.justify-center');
      expect(gridContainer).toBeInTheDocument();
      
      const cardContainers = container.querySelectorAll('.lg\\:w-\\[calc\\(33\\.333\\%-16px\\)\\]');
      expect(cardContainers).toHaveLength(2);
    });
  });

  describe('Large Desktop Breakpoint (>= 1280px)', () => {
    beforeEach(() => {
      mockMatchMedia(1440); // Large desktop width
    });

    test('should apply large desktop responsive classes', () => {
      const { container } = render(
        <DeityGrid {...defaultProps} deities={createMockDeities(4)} />
      );
      
      const cardContainers = container.querySelectorAll('.xl\\:w-\\[calc\\(25\\%-18px\\)\\]');
      expect(cardContainers).toHaveLength(4);
      
      cardContainers.forEach(card => {
        expect(card).toHaveClass('xl:w-[calc(25%-18px)]');
      });
    });

    test('should center incomplete rows on large desktop', () => {
      const { container } = render(
        <DeityGrid {...defaultProps} deities={createMockDeities(3)} />
      );
      
      const gridContainer = container.querySelector('.justify-center');
      expect(gridContainer).toBeInTheDocument();
      
      const cardContainers = container.querySelectorAll('.xl\\:w-\\[calc\\(25\\%-18px\\)\\]');
      expect(cardContainers).toHaveLength(3);
    });
  });

  describe('Cross-Breakpoint Consistency', () => {
    test('should maintain gap spacing across all breakpoints', () => {
      const breakpoints = [375, 768, 1024, 1440];
      
      breakpoints.forEach(width => {
        mockMatchMedia(width);
        
        const { container } = render(
          <DeityGrid {...defaultProps} deities={createMockDeities(2)} />
        );
        
        const gridContainer = container.querySelector('.gap-6');
        expect(gridContainer).toBeInTheDocument();
        expect(gridContainer).toHaveClass('gap-6');
      });
    });

    test('should maintain center alignment across all breakpoints', () => {
      const breakpoints = [375, 768, 1024, 1440];
      
      breakpoints.forEach(width => {
        mockMatchMedia(width);
        
        const { container } = render(
          <DeityGrid {...defaultProps} deities={createMockDeities(2)} />
        );
        
        const gridContainer = container.querySelector('.justify-center');
        expect(gridContainer).toBeInTheDocument();
        expect(gridContainer).toHaveClass('justify-center');
      });
    });

    test('should apply all responsive width classes simultaneously', () => {
      const { container } = render(
        <DeityGrid {...defaultProps} deities={createMockDeities(1)} />
      );
      
      const cardContainer = container.querySelector('.w-full');
      expect(cardContainer).toBeInTheDocument();
      expect(cardContainer).toHaveClass('w-full');
      expect(cardContainer).toHaveClass('max-w-sm');
      expect(cardContainer).toHaveClass('md:w-[calc(50%-12px)]');
      expect(cardContainer).toHaveClass('lg:w-[calc(33.333%-16px)]');
      expect(cardContainer).toHaveClass('xl:w-[calc(25%-18px)]');
    });
  });
});