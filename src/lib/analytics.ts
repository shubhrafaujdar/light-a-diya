// Google Analytics event tracking utilities
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Event types for type safety
export type GAEvent = {
    action: string;
    category: string;
    label?: string;
    value?: number;
};

// Track custom events
export const trackEvent = ({ action, category, label, value }: GAEvent) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
};

// Predefined event tracking functions
export const analytics = {
    // Page view tracking (automatic with Next.js)
    pageView: (url: string) => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('config', GA_MEASUREMENT_ID!, {
                page_path: url,
            });
        }
    },

    // User authentication events
    login: (method: string) => {
        trackEvent({
            action: 'login',
            category: 'engagement',
            label: method,
        });
    },

    signUp: (method: string) => {
        trackEvent({
            action: 'sign_up',
            category: 'engagement',
            label: method,
        });
    },

    // Content engagement
    viewAarti: (deityName: string) => {
        trackEvent({
            action: 'view_aarti',
            category: 'content',
            label: deityName,
        });
    },

    // Quiz interactions
    startQuiz: (category: string) => {
        trackEvent({
            action: 'quiz_start',
            category: 'quiz',
            label: category,
        });
    },

    completeQuiz: (category: string, score: number) => {
        trackEvent({
            action: 'quiz_complete',
            category: 'quiz',
            label: category,
            value: score,
        });
    },

    // Diya lighting events
    lightDiya: (celebrationName: string) => {
        trackEvent({
            action: 'light_diya',
            category: 'celebration',
            label: celebrationName,
        });
    },

    viewCelebration: (celebrationName: string) => {
        trackEvent({
            action: 'view_celebration',
            category: 'celebration',
            label: celebrationName,
        });
    },

    // Search events
    search: (searchTerm: string) => {
        trackEvent({
            action: 'search',
            category: 'engagement',
            label: searchTerm,
        });
    },

    // Language preference
    changeLanguage: (language: string) => {
        trackEvent({
            action: 'change_language',
            category: 'settings',
            label: language,
        });
    },
};

// Set user properties for better segmentation
export const setUserProperties = (properties: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('set', 'user_properties', properties);
    }
};

// Set user profile after authentication
export const setUserProfile = (user: any) => {
    setUserProperties({
        user_id: user.id,
        preferred_language: user.language || 'en',
        signup_date: user.created_at,
    });
};

// Type declaration for gtag
declare global {
    interface Window {
        gtag: (
            command: string,
            targetId: string,
            config?: Record<string, any>
        ) => void;
    }
}
