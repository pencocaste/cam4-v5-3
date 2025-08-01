'use client'

import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';
import { useImagePreloader } from '@/hooks/use-image-preloader';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string;
  preload?: boolean;
  onImageLoad?: () => void;
  onImageError?: () => void;
}

export function OptimizedImage({
  src,
  fallbackSrc,
  preload = false,
  onImageLoad,
  onImageError,
  ...props
}: OptimizedImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(src as string);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { preloadImage, isImageCached } = useImagePreloader();

  // Preload image if requested
  useEffect(() => {
    if (preload && src && !isImageCached(src as string)) {
      preloadImage(src as string).catch(() => {
        // Silently handle preload errors
      });
    }
  }, [src, preload, preloadImage, isImageCached]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    onImageLoad?.();
  };

  // Handle image error with fallback
  const handleError = () => {
    if (!hasError && fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(true);
    } else {
      setHasError(true);
      onImageError?.();
    }
  };

  return (
    <Image
      {...props}
      src={currentSrc}
      onLoad={handleLoad}
      onError={handleError}
      loading="eager"
      // Optimized image settings
      quality={85}
      // Enable image optimization
      unoptimized={false}
    />
  );
}