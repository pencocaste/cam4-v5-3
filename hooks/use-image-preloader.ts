import { useEffect, useRef } from 'react';

interface ImagePreloaderOptions {
  priority?: boolean;
  delay?: number;
}

export function useImagePreloader() {
  const preloadedImages = useRef(new Set<string>());

  const preloadImage = (src: string, options: ImagePreloaderOptions = {}) => {
    const { priority = false, delay = 0 } = options;
    
    // Skip if already preloaded
    if (preloadedImages.current.has(src)) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      const loadImage = () => {
        const img = new Image();
        
        img.onload = () => {
          preloadedImages.current.add(src);
          resolve();
        };
        
        img.onerror = () => {
          console.warn(`Failed to preload image: ${src}`);
          reject(new Error(`Failed to preload image: ${src}`));
        };
        
        img.src = src;
      };

      if (delay > 0 && !priority) {
        setTimeout(loadImage, delay);
      } else {
        loadImage();
      }
    });
  };

  const preloadImages = async (
    urls: string[], 
    options: ImagePreloaderOptions = {}
  ) => {
    const { priority = false } = options;
    
    if (priority) {
      // Load priority images immediately and in parallel
      return Promise.allSettled(
        urls.map(url => preloadImage(url, { priority: true }))
      );
    } else {
      // Load non-priority images with staggered delay
      const promises = urls.map((url, index) => 
        preloadImage(url, { delay: index * 100 })
      );
      return Promise.allSettled(promises);
    }
  };

  return {
    preloadImage,
    preloadImages,
    isPreloaded: (src: string) => preloadedImages.current.has(src),
  };
}