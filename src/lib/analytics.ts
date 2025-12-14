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

    answerQuestion: (category: string, isCorrect: boolean, questionNumber: number) => {
        trackEvent({
            action: 'quiz_question_answered',
            category: 'quiz',
            label: `${category}_${isCorrect ? 'correct' : 'incorrect'}`,
            value: questionNumber,
        });
    },

    startTimer: (category: string) => {
        trackEvent({
            action: 'quiz_timer_started',
            category: 'quiz',
            label: category,
        });
    },

    stopTimer: (category: string, remainingSeconds: number) => {
        trackEvent({
            action: 'quiz_timer_stopped',
            category: 'quiz',
            label: category,
            value: remainingSeconds,
        });
    },

    reachQuestionLimit: (category: string) => {
        trackEvent({
            action: 'quiz_limit_reached',
            category: 'quiz',
            label: category,
        });
    },

    promptSignIn: (context: 'timer' | 'question_limit' | 'scripture_goal', category: string) => {
        trackEvent({
            action: 'quiz_signin_prompted',
            category: 'quiz',
            label: `${context}_${category}`,
        });
    },

    completeQuiz: (category: string, score: number, isAuthenticated: boolean, timeSpent?: number) => {
        trackEvent({
            action: 'quiz_complete',
            category: 'quiz',
            label: `${category}_${isAuthenticated ? 'authenticated' : 'anonymous'}`,
            value: score,
        });

        if (timeSpent !== undefined) {
            trackEvent({
                action: 'quiz_time_spent',
                category: 'quiz',
                label: category,
                value: Math.round(timeSpent),
            });
        }
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

    // Scripture events
    viewScripture: (scriptureName: string, chapter: number, verse: number) => {
        trackEvent({
            action: 'view_scripture',
            category: 'scripture',
            label: `${scriptureName}_${chapter}_${verse}`,
            value: chapter,
        });
    },

    updateScriptureGoal: (scriptureName: string, goal: number) => {
        trackEvent({
            action: 'scripture_goal_update',
            category: 'scripture',
            label: scriptureName,
            value: goal,
        });
    },

    scriptureNavigation: (scriptureName: string, action: string) => {
        trackEvent({
            action: 'scripture_navigation',
            category: 'scripture',
            label: `${scriptureName}_${action}`,
        });
    },

    clickComingSoon: (featureName: string) => {
        trackEvent({
            action: 'click_coming_soon',
            category: 'engagement',
            label: featureName,
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
