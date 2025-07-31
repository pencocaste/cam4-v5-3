"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MessageCircleIcon, X } from "lucide-react"
import { fetchCamProfileDetail, fetchCams } from "@/lib/api"
import { type DetailedCamProfile, type Cam } from "@/lib/types"
import { getCountryName, getLanguageName } from "@/lib/utils"
import { CamCard } from "@/components/cam-card"
import { SchemaMarkup } from "@/components/schema-markup"

interface CamProfilePageProps {
  params: {
    username: string
  }
}

export default function CamProfilePage({ params }: CamProfilePageProps) {
  const username = params.username
  const [profile, setProfile] = useState<DetailedCamProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [relatedPerformers, setRelatedPerformers] = useState<any[]>([])
  const [loadingRelated, setLoadingRelated] = useState(false)
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await fetchCamProfileDetail(username)
        
        if (!profileData) {
          setError("Profile not found")
          return
        }
        
        setProfile(profileData)
        
        // Fetch related performers of the same gender
        if (profileData.gender) {
          setLoadingRelated(true)
          try {
            const relatedCams = await fetchCams(1, { 
              gender: profileData.gender,
              items_per_page: "12" 
            })
            // Filter out the current performer
            const filtered = relatedCams.filter(cam => cam.nickname !== username)
            setRelatedPerformers(filtered.slice(0, 12))
          } catch (error) {
            console.error("Error fetching related performers:", error)
          } finally {
            setLoadingRelated(false)
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }
    
    fetchProfile()
  }, [username])
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Title skeleton */}
        <div className="w-80 h-8 lg:h-9 bg-muted animate-pulse rounded mb-6"></div>
        
        {/* Mobile layout - stacked */}
        <div className="block lg:hidden">
          {/* Video embed skeleton */}
          <div className="relative aspect-video rounded-lg overflow-hidden mb-6 bg-muted animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-muted-foreground/20 animate-pulse rounded-full"></div>
            </div>
          </div>
          
          {/* Chat button skeleton */}
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-md h-12 bg-muted animate-pulse rounded"></div>
          </div>
          
          {/* About card skeleton - Mobile */}
          <div className="rounded-lg border bg-card mb-4">
            <div className="p-4">
              {/* Profile picture inside card */}
              <div className="flex justify-center mb-3">
                <div className="w-20 h-20 bg-muted animate-pulse rounded-full"></div>
              </div>
              <div className="w-48 h-6 bg-muted animate-pulse rounded mb-4 mx-auto"></div>
              <div className="space-y-2 mb-4">
                <div className="w-full h-4 bg-muted animate-pulse rounded"></div>
                <div className="w-3/4 h-4 bg-muted animate-pulse rounded"></div>
              </div>
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between">
                      <div className="w-20 h-4 bg-muted animate-pulse rounded"></div>
                      <div className="w-16 h-5 bg-muted animate-pulse rounded"></div>
                    </div>
                    {index < 7 && <div className="w-full h-px bg-border mt-3"></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Broadcast History skeleton - Mobile */}
          <div className="rounded-lg border bg-card mb-8">
            <div className="p-4">
              <div className="w-36 h-5 bg-muted animate-pulse rounded mb-3"></div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="w-32 h-4 bg-muted animate-pulse rounded"></div>
                  <div className="w-20 h-4 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="w-full h-px bg-border"></div>
                <div className="flex justify-between items-center">
                  <div className="w-28 h-4 bg-muted animate-pulse rounded"></div>
                  <div className="w-12 h-4 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="w-full h-px bg-border"></div>
                <div className="w-28 h-4 bg-muted animate-pulse rounded"></div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {Array.from({ length: 7 }).map((_, index) => (
                    <div key={index}>
                      <div className="w-6 h-2 bg-muted animate-pulse rounded mb-1 mx-auto"></div>
                      <div className="h-8 bg-muted animate-pulse rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop layout - 2 columns */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {/* Left column - Video and button */}
          <div className="lg:col-span-2">
            {/* Video embed skeleton */}
            <div className="relative aspect-video rounded-lg overflow-hidden mb-6 bg-muted animate-pulse">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-muted-foreground/20 animate-pulse rounded-full"></div>
              </div>
            </div>
            
            {/* Chat button skeleton */}
            <div className="mb-6">
              <div className="w-full h-12 bg-muted animate-pulse rounded"></div>
            </div>
          </div>

          {/* Right column - About and Broadcast History */}
          <div className="lg:col-span-1">
            {/* About card skeleton */}
            <div className="rounded-lg border bg-card mb-3">
              <div className="p-4">
                {/* Profile picture inside card */}
                <div className="flex justify-center mb-3">
                  <div className="w-16 h-16 bg-muted animate-pulse rounded-full"></div>
                </div>
                <div className="w-40 h-5 bg-muted animate-pulse rounded mb-2 mx-auto"></div>
                <div className="space-y-2 mb-3">
                  <div className="w-full h-3 bg-muted animate-pulse rounded"></div>
                  <div className="w-3/4 h-3 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="space-y-2">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between">
                        <div className="w-16 h-3 bg-muted animate-pulse rounded"></div>
                        <div className="w-12 h-4 bg-muted animate-pulse rounded"></div>
                      </div>
                      {index < 7 && <div className="w-full h-px bg-border mt-2"></div>}
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <div className="w-20 h-3 bg-muted animate-pulse rounded mb-1"></div>
                  <div className="flex flex-wrap gap-1">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="w-12 h-4 bg-muted animate-pulse rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Broadcast History section */}
            <div className="rounded-lg border bg-card">
              <div className="p-4">
                <div className="w-32 h-4 bg-muted animate-pulse rounded mb-2"></div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="w-28 h-3 bg-muted animate-pulse rounded"></div>
                    <div className="w-16 h-3 bg-muted animate-pulse rounded"></div>
                  </div>
                  <div className="w-full h-px bg-border"></div>
                  <div className="flex justify-between items-center">
                    <div className="w-24 h-3 bg-muted animate-pulse rounded"></div>
                    <div className="w-8 h-3 bg-muted animate-pulse rounded"></div>
                  </div>
                  <div className="w-full h-px bg-border"></div>
                  <div className="w-24 h-3 bg-muted animate-pulse rounded"></div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {Array.from({ length: 7 }).map((_, index) => (
                      <div key={index}>
                        <div className="w-6 h-2 bg-muted animate-pulse rounded mb-1 mx-auto"></div>
                        <div className="h-8 bg-muted animate-pulse rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Photos section skeleton */}
        <div className="w-full">
          <div className="rounded-lg border bg-card mb-8">
            <div className="p-6">
              <div className="w-20 h-6 bg-muted animate-pulse rounded mb-4"></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="relative aspect-square rounded-md bg-muted animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full">
          <div className="rounded-lg border bg-card">
            <div className="p-6">
              <div className="w-40 h-6 bg-muted animate-pulse rounded mb-4"></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="cam-card overflow-hidden h-full flex flex-col border-0">
                    <div className="relative bg-muted">
                      <div className="aspect-[4/3]">
                        <div className="absolute inset-0 bg-muted animate-pulse">
                          <div className="flex items-center justify-center h-full">
                            <div className="w-8 h-8 rounded-full bg-muted-foreground/20 animate-pulse"></div>
                          </div>
                          <div className="absolute top-0.5 right-0.5">
                            <div className="bg-muted-foreground/20 rounded-md h-4 w-12 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start p-1 pt-1 flex-grow space-y-0.5 bg-card dark:bg-card shadow-sm border-t border-border/50 rounded-b-md">
                      <div className="w-full">
                        <div className="flex items-center justify-between w-full mb-0.5">
                          <div className="h-3 bg-muted-foreground/20 rounded w-16 animate-pulse"></div>
                          <div className="h-4 bg-muted-foreground/20 rounded w-12 animate-pulse"></div>
                        </div>
                        <div className="flex items-center justify-between w-full">
                          <div className="h-2.5 bg-muted-foreground/20 rounded w-20 animate-pulse"></div>
                          <div className="h-2.5 bg-muted-foreground/20 rounded w-8 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  if (error || !profile) {
    return notFound()
  }
  
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Function to handle photo selection
  const handlePhotoClick = (photoUrl: string) => {
    setSelectedPhoto(photoUrl)
  }

  // Function to close photo modal
  const closePhotoModal = () => {
    setSelectedPhoto(null)
  }
  
  // Parse bio only if it exists
  const parsedBio = profile.bio ? profile.bio.replace(/\[b\]/g, "<b>")
                                        .replace(/\[\/b\]/g, "</b>")
                                        .replace(/\[i\]/g, "<i>")
                                        .replace(/\[\/i\]/g, "</i>")
                                        : null
  
  return (
    <div className="container mx-auto px-4 py-8">
      {profile && (
        <SchemaMarkup 
          type="person" 
          data={profile} 
        />
      )}
      <SchemaMarkup 
        type="breadcrumb" 
        data={[
          { name: "Home", url: "https://cam4.xxx/" },
          { name: profile?.username || username, url: `https://cam4.xxx/${username}/` }
        ]} 
      />
      <h1 className="text-2xl lg:text-4xl font-bold mb-6">{profile.username}&#39;s Live Sex Cam</h1>
      
      {/* Mobile layout - stacked */}
      <div className="block lg:hidden">
        {/* Full width embed for mobile */}
        <div className="relative aspect-video rounded-lg overflow-hidden mb-6 bg-black">
          <iframe 
            id="embed-player" 
            src={`https://demo1.cam4pays.com/en/embed/${username}?hideui=1`} 
            width="100%" 
            height="100%" 
            className="w-full h-full"
            allow="autoplay; encrypted-media"
          />
        </div>
        
        {/* Chat button for mobile */}
        <div className="flex justify-center mb-8">
          {profile.link ? (
            <a href={profile.link} target="_blank" rel="noopener noreferrer" className="w-full max-w-md">
              <Button variant="default" size="lg" className="w-full text-lg py-6">
                <MessageCircleIcon className="mr-2 h-5 w-5" />
                Chat Now with {profile.username}
              </Button>
            </a>
          ) : (
            <Button variant="default" disabled size="lg" className="w-full max-w-md text-lg py-6">
              <MessageCircleIcon className="mr-2 h-5 w-5" />
              Chat Now with {profile.username}
            </Button>
          )}
        </div>
      </div>

      {/* Desktop layout - 2 columns */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-8">
        {/* Left column - Video embed */}
        <div className="lg:col-span-2">
          <div className="relative aspect-video rounded-lg overflow-hidden mb-6 bg-black">
            <iframe 
              id="embed-player" 
              src={`https://demo1.cam4pays.com/en/embed/${username}?hideui=1`} 
              width="100%" 
              height="100%" 
              className="w-full h-full"
              allow="autoplay; encrypted-media"
            />
          </div>
          
          {/* Chat button aligned to video width */}
          <div className="mb-6">
            {profile.link ? (
              <a href={profile.link} target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="default" size="lg" className="w-full text-lg py-6">
                  <MessageCircleIcon className="mr-2 h-5 w-5" />
                  Chat Now with {profile.username}
                </Button>
              </a>
            ) : (
              <Button variant="default" disabled size="lg" className="w-full text-lg py-6">
                <MessageCircleIcon className="mr-2 h-5 w-5" />
                Chat Now with {profile.username}
              </Button>
            )}
          </div>
        </div>

        {/* Right column - Profile info */}
        <div className="lg:col-span-1">
          {/* About section with profile picture - Compressed */}
          <Card className="mb-3">
            <CardContent className="p-4">
              {/* Profile picture at the top of About section */}
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 relative rounded-full overflow-hidden border-2 border-primary">
                  <Image 
                    src={profile.profile_pic || (profile.photos && profile.photos.length > 0 ? profile.photos[0].full : "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800")}
                    alt={`${profile.username} - ${profile.gender || 'adult'} webcam performer from ${getCountryName(profile.country || '')}${profile.age ? `, ${profile.age} years old` : ''}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyEkJyTjvzRQVhuwT2O/wArGtUIBUh6T6Hb5l8/cRBTKIWvjFaU4xZB0Pl9o8uo8mN4JKtZRRW0ixF7F6Bfc/P9f/Z"
                  />
                </div>
              </div>

              <h2 className="text-lg font-semibold mb-2 text-center">About {profile.username}</h2>
              
              {/* Bio with hover scroll functionality */}
              {parsedBio && (
                <div className="mb-4">
                  <div 
                    className="text-muted-foreground text-xs whitespace-pre-line max-h-12 overflow-hidden hover:overflow-y-auto hover:max-h-32 transition-all duration-300 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
                    dangerouslySetInnerHTML={{ __html: parsedBio }}
                    style={{
                      lineHeight: '1.3',
                      scrollbarWidth: 'thin',
                      scrollbarColor: 'hsl(var(--muted-foreground)) transparent'
                    }}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">Gender</span>
                  <Badge className="text-xs py-0 h-5">{profile.gender || "Unknown"}</Badge>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">Country</span>
                  <span className="text-xs">{getCountryName(profile.country || "")}</span>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">Age</span>
                  <span className="text-xs">{profile.age || "Unknown"}</span>
                </div>
                
                <Separator />
                
                {profile.body_type && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-xs">Body Type</span>
                      <span className="capitalize text-xs">{profile.body_type || "Unknown"}</span>
                    </div>
                    <Separator />
                  </>
                )}
                
                {profile.height && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-xs">Height</span>
                      <span className="text-xs">{profile.height} cm</span>
                    </div>
                    <Separator />
                  </>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">Ethnicity</span>
                  <span className="capitalize text-xs">{profile.ethnicity || "Unknown"}</span>
                </div>
                
                <Separator />
                
                {profile.sexual_preference && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-xs">Sexual Preference</span>
                      <span className="capitalize text-xs">{profile.sexual_preference}</span>
                    </div>
                    <Separator />
                  </>
                )}
                
                {profile.hair_color && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-xs">Hair Color</span>
                      <span className="capitalize text-xs">{profile.hair_color}</span>
                    </div>
                    <Separator />
                  </>
                )}
                
                {profile.eyes && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-xs">Eyes</span>
                      <span className="capitalize text-xs">{profile.eyes}</span>
                    </div>
                    <Separator />
                  </>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">Status</span>
                  <Badge className="text-xs py-0 h-5" variant={profile.status === "online" ? "default" : "secondary"}>
                    {profile.status || "offline"}
                  </Badge>
                </div>
              </div>
              
              {profile.languages && profile.languages.length > 0 && (
                <div className="mt-3">
                  <h3 className="font-medium mb-1 text-xs">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((lang) => (
                      <Badge key={lang} variant="secondary" className="text-xs py-0 h-4">
                        {getLanguageName(lang)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Broadcast History section in right column */}
          {profile.broadcast_history && (
            <Card>
              <CardContent className="p-4">
                <h2 className="text-sm font-semibold mb-2">Broadcast History</h2>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-xs">Average Stream Length</span>
                    <span className="text-xs">{profile.broadcast_history.averageBroadcastLength} min</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-xs">Average Viewers</span>
                    <span className="text-xs">{profile.broadcast_history.averageViewers}</span>
                  </div>
                  
                  <Separator />
                  
                  <h3 className="font-medium text-xs">Most Active Days</h3>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {profile.broadcast_history.days.map((dayData) => (
                      <div key={dayData.day} className="text-[10px]">
                        <div className="font-medium">{dayData.day.substring(0, 3)}</div>
                        <div className={`h-8 relative mt-1 bg-muted ${
                          dayData.broadcastsPerHours.some(h => h > 0) ? 'opacity-100' : 'opacity-40'
                        }`}>
                          <div 
                            className="absolute bottom-0 w-full bg-primary"
                            style={{ 
                              height: `${Math.min(100, 
                                (dayData.broadcastsPerHours.reduce((a, b) => a + b, 0) / 
                                Math.max(...profile.broadcast_history!.days.map(d => 
                                  d.broadcastsPerHours.reduce((a, b) => a + b, 0)
                                ))) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Full width sections for both mobile and desktop */}
      <div className="w-full">
        {/* Mobile About section (hidden on desktop) */}
        <div className="block lg:hidden">
          <Card className="mb-8">
            <CardContent className="p-4">
              {/* Profile picture at the top of About section - Mobile */}
              <div className="flex justify-center mb-3">
                <div className="w-20 h-20 relative rounded-full overflow-hidden border-2 border-primary">
                  <Image 
                    src={profile.profile_pic || (profile.photos && profile.photos.length > 0 ? profile.photos[0].full : "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800")}
                    alt={`${profile.username} - ${profile.gender || 'adult'} webcam performer from ${getCountryName(profile.country || '')}${profile.age ? `, ${profile.age} years old` : ''}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyEkJyTjvzRQVhuwT2O/wArGtUIBUh6T6Hb5l8/cRBTKIWvjFaU4xZB0Pl9o8uo8mN4JKtZRRW0ixF7F6Bfc/P9f/Z"
                  />
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-4">About {profile.username}</h2>
              
              {/* Bio with hover scroll functionality - Mobile */}
              {parsedBio && (
                <div className="mb-4">
                  <div 
                    className="text-muted-foreground text-sm whitespace-pre-line max-h-12 overflow-hidden hover:overflow-y-auto hover:max-h-32 transition-all duration-300 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
                    dangerouslySetInnerHTML={{ __html: parsedBio }}
                    style={{
                      lineHeight: '1.3',
                      scrollbarWidth: 'thin',
                      scrollbarColor: 'hsl(var(--muted-foreground)) transparent'
                    }}
                  />
                </div>
              )}
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Gender</span>
                  <Badge className="text-xs py-0 h-5">{profile.gender || "Unknown"}</Badge>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Country</span>
                  <span className="text-sm">{getCountryName(profile.country || "")}</span>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Age</span>
                  <span className="text-sm">{profile.age || "Unknown"}</span>
                </div>
                
                <Separator />
                
                {profile.body_type && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Body Type</span>
                      <span className="capitalize text-sm">{profile.body_type || "Unknown"}</span>
                    </div>
                    <Separator />
                  </>
                )}
                
                {profile.height && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Height</span>
                      <span className="text-sm">{profile.height} cm</span>
                    </div>
                    <Separator />
                  </>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Ethnicity</span>
                  <span className="capitalize text-sm">{profile.ethnicity || "Unknown"}</span>
                </div>
                
                <Separator />
                
                {profile.sexual_preference && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Sexual Preference</span>
                      <span className="capitalize text-sm">{profile.sexual_preference}</span>
                    </div>
                    <Separator />
                  </>
                )}
                
                {profile.hair_color && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Hair Color</span>
                      <span className="capitalize text-sm">{profile.hair_color}</span>
                    </div>
                    <Separator />
                  </>
                )}
                
                {profile.eyes && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Eyes</span>
                      <span className="capitalize text-sm">{profile.eyes}</span>
                    </div>
                    <Separator />
                  </>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Status</span>
                  <Badge className="text-xs py-0 h-5" variant={profile.status === "online" ? "default" : "secondary"}>
                    {profile.status || "offline"}
                  </Badge>
                </div>
              </div>
              
              {profile.languages && profile.languages.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2 text-sm">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((lang) => (
                      <Badge key={lang} variant="secondary" className="text-xs py-0 h-4">
                        {getLanguageName(lang)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Mobile Broadcast History (hidden on desktop) */}
        <div className="block lg:hidden">
          {profile.broadcast_history && (
            <Card className="mb-8">
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-3">Broadcast History</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">Average Stream Length</span>
                    <span className="text-sm">{profile.broadcast_history.averageBroadcastLength} min</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">Average Viewers</span>
                    <span className="text-sm">{profile.broadcast_history.averageViewers}</span>
                  </div>
                  
                  <Separator />
                  
                  <h3 className="font-medium text-sm">Most Active Days</h3>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {profile.broadcast_history.days.map((dayData) => (
                      <div key={dayData.day} className="text-[10px]">
                        <div className="font-medium">{dayData.day.substring(0, 3)}</div>
                        <div className={`h-8 relative mt-1 bg-muted ${
                          dayData.broadcastsPerHours.some(h => h > 0) ? 'opacity-100' : 'opacity-40'
                        }`}>
                          <div 
                            className="absolute bottom-0 w-full bg-primary"
                            style={{ 
                              height: `${Math.min(100, 
                                (dayData.broadcastsPerHours.reduce((a, b) => a + b, 0) / 
                                Math.max(...profile.broadcast_history!.days.map(d => 
                                  d.broadcastsPerHours.reduce((a, b) => a + b, 0)
                                ))) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
          
      {/* Photos section - full width for both mobile and desktop */}
      <div className="w-full">
          {profile.photos && profile.photos.length > 0 && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Photos</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {profile.photos.map((photo, index) => (
                    <div 
                      key={index} 
                      className="relative aspect-square rounded-md overflow-hidden cursor-pointer"
                      onClick={() => handlePhotoClick(photo.full)}
                    >
                      <Image
                        src={photo.thumb}
                        alt={`${profile.username} photo ${index + 1} - ${profile.gender || 'adult'} webcam performer from ${getCountryName(profile.country || '')}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-200"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyEkJyTjvzRQVhuwT2O/wArGtUIBUh6T6Hb5l8/cRBTKIWvjFaU4xZB0Pl9o8uo8mN4JKtZRRW0ixF7F6Bfc/P9f/Z"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
      </div>
          
      {/* Related Performers section - full width for both mobile and desktop */}
      <div className="w-full">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Related Sex Cams</h2>
              {loadingRelated ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : relatedPerformers.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {relatedPerformers.map((cam) => (
                    <CamCard key={cam.id} cam={cam} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No related performers found
                </p>
              )}
            </CardContent>
          </Card>
      </div>
      
      {/* Full-size photo modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={closePhotoModal}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <Image
              src={selectedPhoto}
              alt={`${profile.username} full size photo - ${profile.gender || 'adult'} webcam performer`}
              fill
              className="object-contain"
              sizes="100vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyEkJyTjvzRQVhuwT2O/wArGtUIBUh6T6Hb5l8/cRBTKIWvjFaU4xZB0Pl9o8uo8mN4JKtZRRW0ixF7F6Bfc/P9f/Z"
            />
            <Button 
              className="absolute top-2 right-2" 
              size="icon" 
              variant="secondary" 
              onClick={closePhotoModal}
              aria-label="Close full size photo"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Script for handling iframe messages */}
      <script dangerouslySetInnerHTML={{
        __html: `
          window.addEventListener('message', e => {
            const data = e.message || e.data;
            
            if('after_purchase'){
              //cross-browser way of reloading the iframe
              document.getElementById('embed-player').src = document.getElementById('embed-player').src;
            }
          }, false);
        `
      }} />
    </div>
  )
}