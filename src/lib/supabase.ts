import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client with proper cookie handling for SSR
export const createClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        // Use document.cookie to read cookies on the client
        if (typeof document === 'undefined') return undefined;
        
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
          return parts.pop()?.split(';').shift();
        }
        return undefined;
      },
      set(name: string, value: string, options: Record<string, unknown>) {
        // Use document.cookie to set cookies on the client
        if (typeof document === 'undefined') return;
        
        let cookieString = `${name}=${value}`;
        
        if (options?.maxAge) {
          cookieString += `; max-age=${options.maxAge}`;
        }
        if (options?.path) {
          cookieString += `; path=${options.path}`;
        }
        if (options?.domain) {
          cookieString += `; domain=${options.domain}`;
        }
        if (options?.secure) {
          cookieString += `; secure`;
        }
        if (options?.sameSite) {
          cookieString += `; samesite=${options.sameSite}`;
        }
        
        document.cookie = cookieString;
      },
      remove(name: string, options: Record<string, unknown>) {
        // Remove cookie by setting it to expire
        if (typeof document === 'undefined') return;
        
        let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        
        if (options?.path) {
          cookieString += `; path=${options.path}`;
        }
        if (options?.domain) {
          cookieString += `; domain=${options.domain}`;
        }
        
        document.cookie = cookieString;
      },
    },
  })
}

// Legacy export for backward compatibility
export const supabase = createClient()
