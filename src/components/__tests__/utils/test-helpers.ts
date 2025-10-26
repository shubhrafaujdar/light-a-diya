import { Deity } from '@/types';

/**
 * Creates mock deity data for testing purposes
 */
export const createMockDeity = (id: string, name?: string): Deity => ({
  id,
  name: name || `Test Deity ${id}`,
  name_hindi: `टेस्ट देवता ${id}`,
  description: `Test description for deity ${id}`,
  description_hindi: `देवता ${id} के लिए टेस्ट विवरण`,
  image_url: `/test-images/deity-${id}.jpg`,
  significance: `Test significance for deity ${id}`,
  significance_hindi: `देवता ${id} के लिए टेस्ट महत्व`,
  mantras: [`Test mantra for deity ${id}`],
  mantras_hindi: [`देवता ${id} के लिए टेस्ट मंत्र`],
  festivals: [`Test festival for deity ${id}`],
  festivals_hindi: [`देवता ${id} के लिए टेस्ट त्योहार`],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
});

/**
 * Creates an array of mock deities for testing different card count scenarios
 */
export const createMockDeities = (count: number): Deity[] => {
  return Array.from({ length: count }, (_, index) => 
    createMockDeity(`${index + 1}`)
  );
};

/**
 * Test scenarios for different card counts that should be tested
 */
export const CARD_COUNT_SCENARIOS = [
  { count: 1, description: 'single card' },
  { count: 2, description: 'two cards' },
  { count: 3, description: 'three cards' },
  { count: 4, description: 'four cards (full row on large desktop)' },
  { count: 5, description: 'five cards (partial second row)' },
  { count: 7, description: 'seven cards (multiple partial rows)' },
  { count: 8, description: 'eight cards (two full rows on large desktop)' }
];

/**
 * Responsive breakpoint configurations for testing
 */
export const RESPONSIVE_BREAKPOINTS = [
  { width: 375, name: 'mobile', description: 'iPhone SE' },
  { width: 768, name: 'tablet', description: 'iPad' },
  { width: 1024, name: 'desktop', description: 'Desktop' },
  { width: 1280, name: 'large-desktop', description: 'Large Desktop' },
  { width: 1440, name: 'xl-desktop', description: 'Extra Large Desktop' }
];

/**
 * Expected CSS classes for different responsive breakpoints
 */
export const EXPECTED_RESPONSIVE_CLASSES = {
  container: [
    'flex',
    'flex-wrap', 
    'justify-center',
    'gap-6'
  ],
  card: [
    'w-full',
    'max-w-sm',
    'md:w-[calc(50%-12px)]',
    'lg:w-[calc(33.333%-16px)]',
    'xl:w-[calc(25%-18px)]'
  ]
};

/**
 * Utility function to check if an element has all expected classes
 */
export const hasAllClasses = (element: Element | null, expectedClasses: string[]): boolean => {
  if (!element) return false;
  
  return expectedClasses.every(className => element.classList.contains(className));
};

/**
 * Utility function to mock window dimensions for responsive testing
 */
export const mockWindowDimensions = (width: number, height: number = 800) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  // Mock matchMedia for CSS media queries
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

/**
 * Utility function to reset window mocks after tests
 */
export const resetWindowMocks = () => {
  delete (window as any).innerWidth;
  delete (window as any).innerHeight;
  delete (window as any).matchMedia;
};