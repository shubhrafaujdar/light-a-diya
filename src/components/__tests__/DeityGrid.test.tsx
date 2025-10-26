import React from 'react';
import { render, screen } from '@testing-library/react';
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

// Mock deity data for testing
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

describe('DeityGrid Card Alignment Tests', () => {
  const defaultProps = {
    language: 'english' as Language,
    loading: false,
    error: null,
    setupRequired: false
  };

  describe('Card Centering Behavior', () => {
    test('should apply center alignment classes with single card', () => {
      const { container } = render(
        <DeityGrid {...defaultProps} deities={createMockDeities(1)} />
      );
      
      const gridContainer = container.querySelector('.flex.flex-wrap.justify-center');
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('justify-center');
    });

    test('should apply center alignment classes with two cards', () => {
      const { container } = render(
        <DeityGrid {...defaultProps} deities={createMockDeities(2)} />
      );
      
      const gridContainer = container.querySelector('.flex.flex-wrap.justify-center');
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('justify-center');
    });

    test('should apply center alignment classes with three cards', () => {
      const { container } = render(
        <DeityGrid {...defaultProps} deities={createMockDeities(3)} />
      );
      
      const gridContainer = container.querySelector('.flex.flex-wrap.justify-center');
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('justify-center');
    });

    test('should apply center alignment classes with four or more cards', () => {
      const { container } = render(
        <DeityGrid {...defaultProps} deities={createMockDeities(5)} />
      );
      
      const gridContainer = container.querySelector('.flex.flex-wrap.justify-center');
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('justify-center');
    });
  });

  describe('Responsive Layout Classes', () => {
    test('should apply responsive width classes to card containers', () => {
      const { container } = render(
        <DeityGrid {...defaultProps} deities={createMockDeities(2)} />
      );
      
      const cardContainers = container.querySelectorAll('.w-full.max-w-sm');
      expect(cardContainers).toHaveLength(2);
      
      cardContainers.forEach(cardContainer => {
        expect(cardContainer).toHaveClass('w-full');
        expect(cardContainer).toHaveClass('max-w-sm');
        expect(cardContainer).toHaveClass('md:w-[calc(50%-12px)]');
        expect(cardContainer).toHaveClass('lg:w-[calc(33.333%-16px)]');
        expect(cardContainer).toHaveClass('xl:w-[calc(25%-18px)]');
      });
    });

    test('should maintain gap spacing between cards', () => {
      const { container } = render(
        <DeityGrid {...defaultProps} deities={createMockDeities(3)} />
      );
      
      const gridContainer = container.querySelector('.flex.flex-wrap.justify-center.gap-6');
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('gap-6');
    });
  });

  describe('Card Count Scenarios', () => {
    test('should render correct number of cards for single card', () => {
      render(<DeityGrid {...defaultProps} deities={createMockDeities(1)} />);
      
      const cards = screen.getAllByText(/Test Deity/);
      expect(cards).toHaveLength(1);
    });

    test('should render correct number of cards for multiple cards', () => {
      render(<DeityGrid {...defaultProps} deities={createMockDeities(4)} />);
      
      const cards = screen.getAllByText(/Test Deity/);
      expect(cards).toHaveLength(4);
    });

    test('should maintain card spacing consistency across different counts', () => {
      const { container: container1 } = render(
        <DeityGrid {...defaultProps} deities={createMockDeities(1)} />
      );
      const { container: container3 } = render(
        <DeityGrid {...defaultProps} deities={createMockDeities(3)} />
      );
      
      const grid1 = container1.querySelector('.gap-6');
      const grid3 = container3.querySelector('.gap-6');
      
      expect(grid1).toHaveClass('gap-6');
      expect(grid3).toHaveClass('gap-6');
    });
  });

  describe('Loading State Alignment', () => {
    test('should apply center alignment to loading skeleton cards', () => {
      const { container } = render(
        <DeityGrid {...defaultProps} deities={[]} loading={true} />
      );
      
      const loadingContainer = container.querySelector('.flex.flex-wrap.justify-center');
      expect(loadingContainer).toBeInTheDocument();
      expect(loadingContainer).toHaveClass('justify-center');
      
      const skeletonCards = container.querySelectorAll('.animate-pulse');
      expect(skeletonCards).toHaveLength(8);
    });

    test('should apply responsive classes to loading skeleton cards', () => {
      const { container } = render(
        <DeityGrid {...defaultProps} deities={[]} loading={true} />
      );
      
      const skeletonCards = container.querySelectorAll('.w-full.max-w-sm');
      expect(skeletonCards).toHaveLength(8);
      
      skeletonCards.forEach(card => {
        expect(card).toHaveClass('md:w-[calc(50%-12px)]');
        expect(card).toHaveClass('lg:w-[calc(33.333%-16px)]');
        expect(card).toHaveClass('xl:w-[calc(25%-18px)]');
      });
    });
  });

  describe('Error and Empty States', () => {
    test('should center error state content', () => {
      render(
        <DeityGrid {...defaultProps} deities={[]} error="Test error" />
      );
      
      const errorContainer = screen.getByText('Something went wrong').closest('.text-center');
      expect(errorContainer).toBeInTheDocument();
      expect(errorContainer).toHaveClass('text-center');
    });

    test('should center empty state content', () => {
      render(
        <DeityGrid {...defaultProps} deities={[]} />
      );
      
      const emptyContainer = screen.getByText('No deities found').closest('.text-center');
      expect(emptyContainer).toBeInTheDocument();
      expect(emptyContainer).toHaveClass('text-center');
    });
  });

  describe('Language Support', () => {
    test('should maintain alignment with Hindi language', () => {
      const { container } = render(
        <DeityGrid {...defaultProps} deities={createMockDeities(2)} language="hindi" />
      );
      
      const gridContainer = container.querySelector('.flex.flex-wrap.justify-center');
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('justify-center');
    });
  });
});