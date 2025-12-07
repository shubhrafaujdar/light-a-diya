import pino from 'pino';

// Determine if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Determine if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Create logger configuration
const loggerConfig: pino.LoggerOptions = {
    level: isDevelopment ? 'debug' : 'info',
    browser: isBrowser ? {
        asObject: true,
        serialize: true,
        transmit: {
            level: 'info',
            send: function (level, logEvent) {
                // In browser, we can still output to console for debugging
                // but in a structured way
                if (isDevelopment) {
                    const { messages } = logEvent;
                    console.log(...messages);
                }
            }
        }
    } : undefined,
    // For server-side (Node.js), use pretty printing in development
    // optimization: disable worker transport to prevent crashes in Next.js dev environment
    // logs will be in JSON format which is safer and can be piped to pino-pretty manually if needed
    transport: undefined,
};

// Create and export the logger instance
export const logger = pino(loggerConfig);

// Export typed logger methods for convenience
export default logger;
