"use client"

import { useState } from "react"
import { useEffect } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Metadata } from "next"
import { fetchCamProfile } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"
import { Suspense } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { VideoPlayer } from "@/components/video-player"
import ReactPlayer from "react-player"
import {
  EyeIcon, 
  HeartIcon, 
  MessageCircleIcon, 
  MapPinIcon, 
  CalendarIcon,
  VideoIcon,
  StarIcon,
  ChevronLeftIcon,
  VolumeX,
  Volume2,
  ExpandIcon,
  MinimizeIcon
} from "lucide-react"
import Link from "next/link"
import { LoadingSpinner } from "@/components/loading-spinner"
import { getCountryName } from "@/lib/utils"

interface CamProfilePageProps {
  params: {
    username: string
  }
}

export default function CamProfilePage({ params }: CamProfilePageProps) {
  const username = params.username
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await fetchCamProfile(username)
        
        if (!profileData) {
          setError("Profile not found")
          return
        }
        
        setProfile(profileData)
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
    return <LoadingSpinner />
  }
  
  if (error || !profile) {
    return notFound()
  }
  
  const joinDate = profile.join_date 
    ? formatDistanceToNow(new Date(profile.join_date), { addSuffix: true })
    : "Unknown"
  
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="flex items-center mb-6 text-muted-foreground hover:text-foreground">
        <ChevronLeftIcon className="w-5 h-5 mr-1" />
        Back to all performers
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
            {profile.preview_url ? (
              <div className="w-full h-full relative">
                <ReactPlayer
                  url={profile.preview_url}
                  width="100%"
                  height="100%"
                  playing={isPlaying}
                  muted={isMuted}
                  controls={false}
                  config={{
                    file: {
                      forceHLS: true,
                    }
                  }}
                  style={{ backgroundColor: 'black' }}
                  className="aspect-video"
                />
                
                {/* Video Controls Overlay */}
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  {/* Top Bar */}
                  <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                    <h3 className="text-white font-medium">Live Stream</h3>
                  </div>
                  
                  {/* Bottom Bar */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-t from-black/80 to-transparent">
                    <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/20">
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                  <Button size="lg" disabled>
                    <VideoIcon className="mr-2 h-4 w-4" />
                    Stream Not Available
                  </Button>
                </div>
                
                <Suspense fallback={<LoadingSpinner />}>
                  <Image 
                    src={profile.thumb_big || profile.preview_url || "https://images.pexels.com/photos/3394658/pexels-photo-3394658.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"} 
                    alt={profile.nickname} 
                    fill
                    className="object-cover"
                    priority
                  />
                </Suspense>
              </>
            )}
            
            <div className="absolute top-3 left-3 flex items-center space-x-2 z-10">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </div>
              <Badge variant="secondary" className="bg-black/60">Live</Badge>
            </div>
            
            <div className="absolute top-3 right-3 z-10">
              <Badge variant="secondary" className="bg-black/60">
                <EyeIcon className="h-3.5 w-3.5 mr-1" />
                {profile.viewers || Math.floor(Math.random() * 1000) + 50} watching
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">{profile.nickname}</h1>
              <div className="flex items-center mt-1 text-muted-foreground">
                <MapPinIcon className="h-4 w-4 mr-1" />
                <span>{getCountryName(profile.country) || profile.country_name || "Unknown Location"}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              {profile.link ? (
                <a href={profile.link} target="_blank" rel="noopener noreferrer">
                  <Button variant="default">
                    <MessageCircleIcon className="mr-2 h-4 w-4" />
                    Chat Now
                  </Button>
                </a>
              ) : (
                <Button variant="default" disabled>
                  <MessageCircleIcon className="mr-2 h-4 w-4" />
                  Chat Now
                </Button>
              )}
              <Button variant="outline">
                <HeartIcon className="mr-2 h-4 w-4 text-primary" />
                Follow
              </Button>
            </div>
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">About Me</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {profile.about_me || profile.status || "This performer hasn't added a bio yet."}
              </p>
              
              {profile.show_tags && profile.show_tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">My Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.show_tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div>
          <Card className="mb-6 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <Image 
                  src={profile.profile_thumb || profile.thumb_big || profile.thumb || "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800"} 
                  alt={profile.nickname} 
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Gender</span>
                  <Badge>{profile.gender || "Unknown"}</Badge>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Age</span>
                  <span>{profile.age || "Unknown"}</span>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Body Type</span>
                  <span className="capitalize">{profile.body_type || "Unknown"}</span>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Ethnicity</span>
                  <span className="capitalize">{profile.ethnicity || "Unknown"}</span>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Languages</span>
                  <div className="flex items-center">
                    {profile.languages && profile.languages.length > 0 ? (
                      <span>{profile.languages.map((lang: string) => lang.toUpperCase()).join(', ')}</span>
                    ) : (
                      <span>Unknown</span>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 mr-1 text-yellow-400" />
                    <span>{profile.rating || "4.8"} / 5</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Related Performers</h2>
              <div className="space-y-2">
                <p className="text-center text-muted-foreground py-4">
                  Related performers will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}