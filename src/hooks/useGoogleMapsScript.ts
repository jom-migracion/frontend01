import { useState, useEffect } from "react";

// Singleton to avoid injecting the Google Maps script more than once
let googleMapsLoadPromise: Promise<void> | null = null;

interface UseGoogleMapsScriptOptions {
  googleMapsApiKey: string;
  libraries?: string[];
  language?: string;
  /** When true, skip loading the script until set to false. */
  skip?: boolean;
}

/**
 * Lightweight replacement for @react-google-maps/api `useLoadScript`.
 * Only injects the <script> tag — no React context or extra runtime overhead.
 * Multiple components can call this hook safely; the script is injected once.
 */
export function useGoogleMapsScript({
  googleMapsApiKey,
  libraries = [],
  language,
  skip = false,
}: UseGoogleMapsScriptOptions): { isLoaded: boolean; loadError: Error | null } {
  const [isLoaded, setIsLoaded] = useState(
    () =>
      !skip && typeof window !== "undefined" && !!(window as any).google?.maps
  );
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    if (skip) return;

    // Already available (e.g. script loaded by another component)
    if ((window as any).google?.maps) {
      setIsLoaded(true);
      return;
    }

    if (!googleMapsLoadPromise) {
      googleMapsLoadPromise = new Promise<void>((resolve, reject) => {
        const params = new URLSearchParams({ key: googleMapsApiKey });
        if (libraries.length > 0) params.set("libraries", libraries.join(","));
        if (language) params.set("language", language);

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => {
          googleMapsLoadPromise = null; // allow retry on next mount
          reject(new Error("Google Maps script failed to load"));
        };
        document.head.appendChild(script);
      });
    }

    googleMapsLoadPromise
      .then(() => setIsLoaded(true))
      .catch((err: Error) => setLoadError(err));
  }, [skip]); // re-runs when skip changes from true → false

  return { isLoaded, loadError };
}
