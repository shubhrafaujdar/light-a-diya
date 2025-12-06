import {
  getSavedLanguage,
  saveLanguage,
  getOppositeLanguage,
  getBrowserPreferredLanguage
} from '@/utils/language-persistence';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock navigator
Object.defineProperty(window, 'navigator', {
  value: {
    language: 'en-US',
  },
  writable: true,
});

describe('Language Toggle Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Language Persistence Utilities', () => {
    it('should return english as default when no saved language', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = getSavedLanguage();
      expect(result).toBe('english');
    });

    it('should return saved language preference', () => {
      mockLocalStorage.getItem.mockReturnValue('hindi');

      const result = getSavedLanguage();
      expect(result).toBe('hindi');
    });

    it('should save language preference to localStorage', () => {
      saveLanguage('hindi');

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('dharma_preferred_language', 'hindi');
    });

    it('should toggle between languages correctly', () => {
      expect(getOppositeLanguage('english')).toBe('hindi');
      expect(getOppositeLanguage('hindi')).toBe('english');
    });

    it('should detect browser language preference', () => {
      // Test Hindi browser language
      Object.defineProperty(window.navigator, 'language', {
        value: 'hi-IN',
        writable: true,
      });

      expect(getBrowserPreferredLanguage()).toBe('hindi');

      // Test English browser language
      Object.defineProperty(window.navigator, 'language', {
        value: 'en-US',
        writable: true,
      });

      expect(getBrowserPreferredLanguage()).toBe('english');

      // Test unsupported language
      Object.defineProperty(window.navigator, 'language', {
        value: 'fr-FR',
        writable: true,
      });

      expect(getBrowserPreferredLanguage()).toBe(null);
    });
  });

  describe('Language State Management', () => {
    it('should handle localStorage errors gracefully', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });

      const result = getSavedLanguage();
      expect(result).toBe('english');
    });

    it('should handle invalid saved language values', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-language');

      const result = getSavedLanguage();
      expect(result).toBe('english');
    });

    it('should handle localStorage save errors gracefully', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });

      // Should not throw error
      expect(() => saveLanguage('hindi')).not.toThrow();
    });
  });
});