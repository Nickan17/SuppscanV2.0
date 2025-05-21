// Environment variables with type safety
type Config = {
  supabase: {
    url: string;
    anonKey: string;
  };
  openRouter: {
    apiKey: string;
    apiUrl: string;
  };
  isDev: boolean;
};

// Get environment variables with fallbacks
const getEnv = (key: string, fallback: string = ''): string => {
  if (typeof process === 'undefined' || !('env' in process)) {
    // Running in browser environment
    // @ts-ignore - process.env is injected by Expo
    return (window.process?.env?.[key] ?? fallback) as string;
  }
  // Running in Node.js environment
  return (process.env[key] as string) || fallback;
};

// Check if running in Node.js environment
const isNode =
  typeof process !== 'undefined' &&
  process.versions != null &&
  process.versions.node != null;

export const config: Config = {
  supabase: {
    url: getEnv('EXPO_PUBLIC_SUPABASE_URL', ''),
    anonKey: getEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY', ''),
  },
  openRouter: {
    apiKey: getEnv('EXPO_PUBLIC_OPENROUTER_API_KEY', ''),
    apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
  },
  isDev: isNode
    ? process.env.NODE_ENV === 'development'
    : typeof __DEV__ !== 'undefined'
      ? __DEV__
      : false,
};

// Validate required environment variables
const validateConfig = () => {
  const required = {
    EXPO_PUBLIC_SUPABASE_URL: config.supabase.url,
    EXPO_PUBLIC_SUPABASE_ANON_KEY: config.supabase.anonKey,
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.warn('Missing required environment variables:', missing.join(', '));
  }
};

// Run validation
validateConfig();

export default config;
