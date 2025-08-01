'use client'

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { EyeIcon, MapPinIcon } from "lucide-react"
import { type Cam } from "@/lib/types"
import { cn, getCountryName } from "@/lib/utils"

interface CamCardProps {
  cam: Cam
  priority?: boolean
}

export function CamCard({ cam, priority = false }: CamCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  // Pre-compute values to ensure they are directly included in the initial HTML
  const countryName = getCountryName(cam.country);
  const viewerCount = cam.viewers || Math.floor(Math.random() * 1000) + 50;
  const imageUrl = cam.thumb_big || cam.thumb || cam.thumb_error;
  const badgeVariant = cam.gender === "female" ? "default" : cam.gender === "male" ? "secondary" : "outline";
  
  return (
    <Link href={`/${cam.nickname}`}>
      <div className="cam-card h-full border-0 block">
        <div className="relative bg-muted overflow-hidden">
          <AspectRatio ratio={4/3}>
            <Image
              src={imageUrl}
              alt={`${cam.nickname} - live cam model from ${getCountryName(cam.country)}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
              priority={priority}
              loading="eager"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyEkJyTjvzRQVhuwT2O/wArGtUIBUh6T6Hb5l8/cRBTKIWvjFaU4xZB0Pl9o8uo8mN4JKtZRRW0ixF7F6Bfc/P9f/Z"
            />
            
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