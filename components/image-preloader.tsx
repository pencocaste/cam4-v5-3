'use client'

import { useEffect } from 'react';
import { useImagePreloader } from '@/hooks/use-image-preloader';

interface ImagePreloaderProps {
  images: string[];
  priority?: boolean;
  delay?: number;
}

export function ImagePreloader({ 
  images, 
  priority = false, 
  delay = 0 
}: ImagePreloaderProps) {
  const { preloadImages } = useImagePreloader();

  useEffect(() => {
    if (images.length === 0) return;

    const loadImages = async () => {
      try {
        await preloadImages(images, { priority });
        console.log(`Successfully preloaded ${images.length} images`);
      } catch (error) {
        console.warn('Some images failed to preload:', error);
      }
    };

    if (delay > 0) {
      const timer = setTimeout(loadImages, delay);
      return () => clearTimeout(timer);
    } else {
      loadImages();
    }
  }, [images, priority, delay, preloadImages]);

  return null; // This component doesn't render anything visible
}