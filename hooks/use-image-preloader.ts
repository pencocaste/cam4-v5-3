import { useEffect, useCallback } from 'react';

interface ImagePreloaderOptions {
  priority?: boolean;  
  crossOrigin?: 'anonymous' | 'use-credentials';
}

// Global cache to track loaded images
const imageCache = new Set<string>();
const preloadingQueue = new Set<string>();

export function useImagePreloader() {
  const preloadImage = useCallback((src: string, options: ImagePreloaderOptions = {}) => {
    // Skip if already cached or being preloaded
    if (imageCache.has(src) || preloadingQueue.has(src)) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      preloadingQueue.add(src);
      
      const img = new Image();
      
      img.onload = () => {
        imageCache.add(src);
        preloadingQueue.delete(src);
        resolve();
      };
      
      img.onerror = () => {
        preloadingQueue.delete(src);
        reject(new Error(`Failed to preload image: ${src}`));
      };
      
      // Set crossOrigin before src to avoid CORS issues
      if (options.crossOrigin) {
        img.crossOrigin = options.crossOrigin;
      }
      
      img.src = src;
    });
  }, []);

  const preloadImages = useCallback((sources: string[], options: ImagePreloaderOptions = {}) => {
    return Promise.allSettled(
      sources.map(src => preloadImage(src, options))
    );
  }, [preloadImage]);

  const isImageCached = useCallback((src: string) => {
    return imageCache.has(src);
  }, []);

  const clearCache = useCallback(() => {
    imageCache.clear();
    preloadingQueue.clear();
  }, []);

  return {
    preloadImage,
    preloadImages,
    isImageCached,
    clearCache
  };
}

// Hook to preload images for next batch
export function useImagePrefetch(images: string[], enabled = true) {
  const { preloadImages } = useImagePreloader();

  useEffect(() => {
    if (!enabled || images.length === 0) return;

    // Delay prefetching to avoid blocking current page load
    const timeoutId = setTimeout(() => {
      preloadImages(images, { priority: false });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [images, enabled, preloadImages]);
}