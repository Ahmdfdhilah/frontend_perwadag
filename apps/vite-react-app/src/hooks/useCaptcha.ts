/**
 * Custom hook for Google reCAPTCHA v3 integration
 * Handles loading reCAPTCHA script and generating tokens
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { authService } from '@/services/auth';

interface CaptchaConfig {
  enabled: boolean;
  site_key: string | null;
  version: string;
}

interface UseCaptchaReturn {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  executeRecaptcha: (action?: string) => Promise<string | null>;
  isEnabled: boolean;
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export const useCaptcha = (): UseCaptchaReturn => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<CaptchaConfig>({
    enabled: false,
    site_key: null,
    version: 'v3'
  });

  const configFetched = useRef(false);
  const scriptLoaded = useRef(false);

  // Fetch CAPTCHA configuration from backend or environment
  const fetchCaptchaConfig = useCallback(async () => {
    if (configFetched.current) return;

    // First try environment variable fallback
    const envSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    const hasValidEnvKey = envSiteKey && envSiteKey !== 'your_site_key_here' && envSiteKey.trim() !== '';

    try {
      // Try to get config from backend using service layer

      const captchaConfig = await authService.getCaptchaConfig();
      setConfig(captchaConfig);
      configFetched.current = true;

      // If CAPTCHA is enabled and we have a site key, load the script
      if (captchaConfig.enabled && captchaConfig.site_key) {
        await loadRecaptchaScript(captchaConfig.site_key);
      }
      return;
    } catch (err) {
      // Silent fallback to environment variable
    }

    // Fallback to environment variable
    if (hasValidEnvKey) {
      const fallbackConfig = {
        enabled: true,
        site_key: envSiteKey,
        version: 'v3'
      };
      setConfig(fallbackConfig);
      configFetched.current = true;

      try {
        await loadRecaptchaScript(envSiteKey);
      } catch (scriptErr) {
        setError('Failed to load CAPTCHA script');
      }
    } else {
      setConfig({ enabled: false, site_key: null, version: 'v3' });
      configFetched.current = true;
    }
  }, []);

  // Load reCAPTCHA script
  const loadRecaptchaScript = useCallback(async (siteKey: string): Promise<void> => {
    if (scriptLoaded.current) {
      setIsLoaded(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (window.grecaptcha) {
        scriptLoaded.current = true;
        setIsLoaded(true);
        setIsLoading(false);
        resolve();
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        // Wait for grecaptcha to be ready
        if (window.grecaptcha && window.grecaptcha.ready) {
          window.grecaptcha.ready(() => {
            scriptLoaded.current = true;
            setIsLoaded(true);
            setIsLoading(false);
            resolve();
          });
        } else {
          const errorMsg = 'reCAPTCHA failed to initialize';
          setError(errorMsg);
          setIsLoading(false);
          reject(new Error(errorMsg));
        }
      };

      script.onerror = () => {
        const errorMsg = 'Failed to load reCAPTCHA script';
        setError(errorMsg);
        setIsLoading(false);
        scriptLoaded.current = false;
        reject(new Error(errorMsg));
      };

      // Add script to document head
      document.head.appendChild(script);
    });
  }, []);

  // Execute reCAPTCHA and get token
  const executeRecaptcha = useCallback(async (action: string = 'login'): Promise<string | null> => {
    // If CAPTCHA is not enabled, return null
    if (!config.enabled || !config.site_key) {
      return null;
    }

    // If script is not loaded, return null
    if (!isLoaded || !window.grecaptcha) {
      return null;
    }

    try {
      const token = await window.grecaptcha.execute(config.site_key, { action });
      return token;
    } catch (err) {
      setError('Failed to generate CAPTCHA token');
      return null;
    }
  }, [config.enabled, config.site_key, isLoaded]);

  // Initialize on mount
  useEffect(() => {
    fetchCaptchaConfig();
  }, [fetchCaptchaConfig]);

  return {
    isLoaded,
    isLoading,
    error,
    executeRecaptcha,
    isEnabled: config.enabled && !!config.site_key
  };
};