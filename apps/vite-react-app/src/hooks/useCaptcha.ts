/**
 * Custom hook for Google reCAPTCHA v3 integration
 * Handles loading reCAPTCHA script and generating tokens
 */

import { useState, useEffect, useCallback, useRef } from 'react';

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
    
    try {
      // First try to get config from backend
      const response = await fetch('/api/v1/auth/captcha-config');
      if (response.ok) {
        const captchaConfig = await response.json();
        setConfig(captchaConfig);
        configFetched.current = true;
        
        // If CAPTCHA is enabled and we have a site key, load the script
        if (captchaConfig.enabled && captchaConfig.site_key) {
          await loadRecaptchaScript(captchaConfig.site_key);
        }
      } else {
        // Fallback to environment variable if backend fails
        const envSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
        if (envSiteKey && envSiteKey !== 'your_site_key_here') {
          const fallbackConfig = { 
            enabled: true, 
            site_key: envSiteKey, 
            version: 'v3' 
          };
          setConfig(fallbackConfig);
          configFetched.current = true;
          await loadRecaptchaScript(envSiteKey);
        } else {
          console.warn('Failed to fetch CAPTCHA config and no valid env key, assuming disabled');
          setConfig({ enabled: false, site_key: null, version: 'v3' });
          configFetched.current = true;
        }
      }
    } catch (err) {
      console.error('Error fetching CAPTCHA config:', err);
      
      // Fallback to environment variable on error
      const envSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
      if (envSiteKey && envSiteKey !== 'your_site_key_here') {
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
          console.error('Failed to load reCAPTCHA script:', scriptErr);
          setError('Failed to load CAPTCHA script');
        }
      } else {
        setError('Failed to load CAPTCHA configuration');
        setConfig({ enabled: false, site_key: null, version: 'v3' });
        configFetched.current = true;
      }
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
      console.log('reCAPTCHA is disabled, skipping token generation');
      return null;
    }

    // If script is not loaded, return null
    if (!isLoaded || !window.grecaptcha) {
      console.warn('reCAPTCHA script not loaded yet');
      return null;
    }

    try {
      console.log(`Executing reCAPTCHA with site key: ${config.site_key} and action: ${action}`);
      const token = await window.grecaptcha.execute(config.site_key, { action });
      console.log(`reCAPTCHA token generated successfully: ${token.substring(0, 20)}...`);
      return token;
    } catch (err) {
      console.error('Error executing reCAPTCHA:', err);
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