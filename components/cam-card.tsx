'use client'

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { performanceMonitor } from "@/lib/performance-monitor"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { EyeIcon, MapPinIcon } from "lucide-react"
import { type Cam } from "@/lib/types"
import { cn, getCountryName } from "@/lib/utils"

interface CamCardProps {
  cam: Cam
  priority?: boolean
  loading?: "eager" | "lazy"
}

// Fallback images in order of preference
const FALLBACK_IMAGES = [
  "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3394658/pexels-photo-3394658.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1386604/pexels-photo-1386604.jpeg?auto=compress&cs=tinysrgb&w=800",
]

const DEFAULT_PLACEHOLDER = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyEkJyTjvzRQVhuwT2O/wArGtUIBUh6T6Hb5l8/cRBTKIWvjFaU4xZB0Pl9o8uo8mN4JKtZRRW0ixF7F6Bfc/P9f/Z"
export function CamCard({ cam, priority = false, loading = "lazy" }: CamCardProps) {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px', // Start loading 100px before the image enters viewport
    triggerOnce: true,
  });
  
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loadStartTime, setLoadStartTime] = useState<number | null>(null)
  
  // Only load image when it's about to enter viewport or if it's priority
  const shouldLoadImage = priority || isIntersecting;
  
  // Pre-compute values to ensure they are directly included in the initial HTML
  const countryName = getCountryName(cam.country);
  const viewerCount = cam.viewers || Math.floor(Math.random() * 1000) + 50;
  
  // Smart image URL selection with fallback logic
  const getImageUrl = () => {
    const originalUrls = [
      cam.thumb_big,
      cam.thumb,
      cam.thumb_error
    ].filter(Boolean); // Remove null/undefined values
    
    if (currentImageIndex < originalUrls.length) {
      return originalUrls[currentImageIndex];
    }
    
    // Use fallback images if original URLs failed
    const fallbackIndex = currentImageIndex - originalUrls.length;
    if (fallbackIndex < FALLBACK_IMAGES.length) {
      return FALLBACK_IMAGES[fallbackIndex];
    }
    
    // Last resort - use the first fallback
    return FALLBACK_IMAGES[0];
  };
  
  const imageUrl = getImageUrl();
  const badgeVariant = cam.gender === "female" ? "default" : cam.gender === "male" ? "secondary" : "outline";
  
  const handleImageError = () => {
    console.warn(`Image failed to load for ${cam.nickname}: ${imageUrl}`);
    
    // Track error in performance monitor
    if (loadStartTime) {
      performanceMonitor.trackImageError(imageUrl, loadStartTime, currentImageIndex > 0);
    }
    
    // Try next image in the fallback chain
    const originalUrls = [cam.thumb_big, cam.thumb, cam.thumb_error].filter(Boolean);
    const maxAttempts = originalUrls.length + FALLBACK_IMAGES.length;
    
    if (currentImageIndex < maxAttempts - 1) {
      setCurrentImageIndex(prev => prev + 1);
      setImageError(false); // Reset error state for retry
    } else {
      setImageError(true);
      console.error(`All image sources failed for ${cam.nickname}`);
    }
  };
  
  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
    
    // Track successful load in performance monitor
    if (loadStartTime) {
      performanceMonitor.trackImageLoad(imageUrl, loadStartTime, currentImageIndex > 0);
    }
    
    // Image loaded successfully - no need to reset currentImageIndex as it's managed per component
  };
  
  const handleImageLoadStart = () => {
    setLoadStartTime(performance.now());
  };
  
  return (
    <Link href={`/${cam.nickname}`}>
      <div className="cam-card h-full border-0 block">
        <div ref={elementRef} className="relative bg-muted overflow-hidden">
          <AspectRatio ratio={4/3}>
            {shouldLoadImage ? (
              <Image
                src={imageUrl}
                alt={`${cam.nickname} - live cam model from ${getCountryName(cam.country)}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                priority={priority}
                loading={priority ? "eager" : "lazy"}
                onLoad={handleImageLoad}
                onLoadStart={handleImageLoadStart}
                onError={handleImageError}
                placeholder="blur"
                blurDataURL={DEFAULT_PLACEHOLDER}
              />
            ) : (
              // Show placeholder while waiting for intersection
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            
            {/* Error state overlay */}
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="text-center p-2">
                  <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                    <span className="text-xs">📷</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {cam.nickname}
                  </div>
                </div>
              </div>
            )}
            
            {/* Viewers badge */}
            <div className="absolute top-0.5 right-0.5">
              <Badge variant="secondary" className="bg-black/60 hover:bg-black/80 py-0 px-1 text-[10px] h-4 min-w-0 min-h-0">
                <EyeIcon className="h-2.5 w-2.5 mr-0.5" />
                {viewerCount}
              </Badge>
            </div>
            
            {/* Info overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white">
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-medium text-sm text-white truncate">{cam.nickname}</span>
                <Badge
                  variant={badgeVariant}
                  className="text-[10px] py-0 px-2 h-4 min-w-0 min-h-0"
                >
                  {cam.gender}
                </Badge>
              </div>
              
              <div className="flex items-center text-xs text-white/90 w-full justify-between">
                <div className="flex items-center">
                  <MapPinIcon className="h-3 w-3 mr-1" />
                  <span>{countryName}</span>
                </div>
                
                {cam.age && (
                  <span>{cam.age} yo</span>
                )}
              </div>
            </div>
          </AspectRatio>
        </div>
      </div>
    </Link>
  )
}