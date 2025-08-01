'use client'

import { useImagePrefetch } from '@/hooks/use-image-preloader';

interface ImagePrefetcherProps {
  images: string[];
  enabled?: boolean;
}

export function ImagePrefetcher({ images, enabled = true }: ImagePrefetcherProps) {
  // Filter out any null/undefined values
  const validImages = images.filter(Boolean);
  
  useImagePrefetch(validImages, enabled);
  
  // This component doesn't render anything
  return null;
}