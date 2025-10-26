import React from 'react';
import { render } from '@testing-library/react';
import { DeityGrid } from '../DeityGrid';
import { Deity, Language } from '@/types';
import { 
  createMockDeities, 
  CARD_COUNT_SCENARIOS, 
  RESPONSIVE_BREAKPOINTS,
  EXPECTED_RESPONSIVE_CLASSES,
  hasAllClasses,
  mockWindowDimensions,
  resetWindowMocks
} from './utils/test-helpers';


// Mock the DeityCard component to avoid image loading issues in tests
jest.mock('../DeityCard', () => ({
  DeityCard: ({ deity, language }: { deity: Deity; language: Language }) => (
    <div data-testid={`deity-card-${deity.id}`} className="mock-deity-card">
      {language === 'hindi' ? deity.name_hindi : deity.name_english}
    </div>
  )
}));

describe('DeityGrid Alignment Integration Tests', () => {
  const defaultProps = {
    language: 'english' as Language,
    loading: false,
    error: null,
    setupRequired: false
  };

  afterEach(() => {
    resetWindowMocks();
  });

  describe('Card Count Alignment Scenarios', () => {
    CARD_COUNT_SCENARIOS.forEach(({ count, description }) => {
      test(`should center align cards with ${description}`, () => {
        const { container } = render(
          <DeityGrid {...defaultProps} deities={createMockDeities(count)} />
        );
        
        // Check container has center alignment classes
        const gridContainer = container.querySelector('.flex.flex-wrap.justify-center.gap-6');
        expect(gridContainer).toBeInTheDocument();
        expect(hasAllClasses(gridContainer, EXPECTED_RESPONSIVE_CLASSES.container)).toBe(true);
        
        // Check all cards have proper responsive classes
        const cardContainers = container.querySelectorAll('.w-full.max-w-sm');
        expect(cardContainers).toHaveLength(count);
        
        cardContainers.forEach(card => {
          expect(hasAllClasses(card, EXPECTED_RESPONSIVE_CLASSES.card)).toBe(true);
        });
      });
    });
  });

  describe('Responsive Breakpoint Alignment', () => {
    RESPONSIVE_BREAKPOINTS.forEach(({ width, name }) => {
      CARD_COUNT_SCENARIOS.slice(0, 4).forEach(({ count, description: cardDesc }) => {
        test(`should maintain center alignment at ${name} (${width}px) with ${cardDesc}`, () => {
          mockWindowDimensions(width);
          
          const { container } = render(
            <DeityGrid {...defaultProps} deities={createMockDeities(count)} />
          );
          
          // Verify container alignment
          const gridContainer = container.querySelector('.justify-center');
          expect(gridContainer).toBeInTheDocument();
          expect(gridContainer).toHaveClass('justify-center');
          
          // Verify gap spacing is maintained
          expect(gridContainer).toHaveClass('gap-6');
          
          // Verify card count
          const cards = container.querySelectorAll('.w-full');
          expect(cards).toHaveLength(count);
          
          // Verify responsive classes are applied
          cards.forEach(card => {
            expect(card).toHaveClass('w-full');
            expect(card).toHaveClass('max-w-sm');
            expect(card).toHaveClass('md:w-[calc(50%-12px)]');
            expect(card).toHaveClass('lg:w-[calc(33.333%-16px)]');
            expect(card).toHaveClass('xl:w-[calc(25%-18px)]');
          });
        });
      });
    });
  });

  describe('Edge Cases and State Alignment', () => {
    test('should maintain center alignment in loading state', () => {
      const { container } = render(
        <DeityGrid {...defaultProps} deities={[]} loading={true} />
      );
      
      const loadingContainer = container.querySelector('.flex.flex-wrap.justify-center.gap-6');
      expect(loadingContainer).toBeInTheDocument();
      expect(hasAllClasses(loadingContainer, EXPECTED_RESPONSIVE_CLASSES.container)).toBe(true);
      
      // Check skeleton cards have responsive classes
      const skeletonCards = container.querySelectorAll('.animate-pulse');
      expect(skeletonCards).toHaveLength(8);
      
      skeletonCards.forEach(card => {
        expect(hasAllClasses(card, EXPECTED_RESPONSIVE_CLASSES.card)).toBe(true);
      });
    });

    test('should center align error state content', () => {
      const { container } = render(
        <DeityGrid {...defaultProps} deities={[]} error="Test error" />
      );
      
      const errorContainer = container.querySelector('.text-center.py-12');
      expect(errorContainer).toBeInTheDocument();
      expect(errorContainer).toHaveClass('text-center');
    });

    test('should center align empty state content', () => {
      const { container } = render(
        <DeityGrid {...defaultProps} deities={[]} />
      );
      
      const emptyContainer = container.querySelector('.text-center.py-12');
      expect(emptyContainer).toBeInTheDocument();
      expect(emptyContainer).toHaveClass('text-center');
    });

    test('should maintain alignment with database setup required state', () => {
      const { container } = render(
        <DeityGrid {...defaultProps} deities={[]} setupRequired={true} />
      );
      
      // DatabaseSetupInstructions component should be rendered
      // The component itself should handle its own centering
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Language Support Alignment', () => {
    ['english', 'hindi'].forEach(language => {
      test(`should maintain center alignment with ${language} language`, () => {
        const { container } = render(
          <DeityGrid 
            {...defaultProps} 
            deities={createMockDeities(3)} 
            language={language as Language}
          />
        );
        
        const gridContainer = container.querySelector('.justify-center');
        expect(gridContainer).toBeInTheDocument();
        expect(gridContainer).toHaveClass('justify-center');
        
        const cards = container.querySelectorAll('.w-full');
        expect(cards).toHaveLength(3);
      });
    });
  });

  describe('Visual Regression Prevention', () => {
    test('should not break existing flex-wrap behavior', () => {
      const { container } = render(
        <DeityGrid {...defaultProps} deities={createMockDeities(6)} />
      );
      
      const gridContainer = container.querySelector('.flex-wrap');
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('flex-wrap');
    });

    test('should preserve gap spacing in all scenarios', () => {
      CARD_COUNT_SCENARIOS.forEach(({ count }) => {
        const { container } = render(
          <DeityGrid {...defaultProps} deities={createMockDeities(count)} />
        );
        
        const gridContainer = container.querySelector('.gap-6');
        expect(gridContainer).toBeInTheDocument();
        expect(gridContainer).toHaveClass('gap-6');
      });
    });

    test('should not interfere with card aspect ratios', () => {
      const { container } = render(
        <DeityGrid {...defaultProps} deities={createMockDeities(2)} />
      );
      
      const cards = container.querySelectorAll('.w-full.max-w-sm');
      expect(cards).toHaveLength(2);
      
      // Verify cards maintain their responsive width constraints
      cards.forEach(card => {
        expect(card).toHaveClass('max-w-sm');
        expect(card).toHaveClass('md:w-[calc(50%-12px)]');
        expect(card).toHaveClass('lg:w-[calc(33.333%-16px)]');
        expect(card).toHaveClass('xl:w-[calc(25%-18px)]');
      });
    });
  });
});