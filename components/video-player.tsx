"use client"

import { useState, useEffect, useRef } from "react"
import ReactPlayer from "react-player"
import Hls from "hls.js"
import { Button } from "@/components/ui/button"
import { X, ExpandIcon, MinimizeIcon, VolumeX, Volume2 } from "lucide-react"

interface VideoPlayerProps {
  url: string
  isOpen: boolean
  onClose: () => void
}

export function VideoPlayer({ url, isOpen, onClose }: VideoPlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Check if HLS is supported
    if (!isOpen) return

    const checkHlsSupport = async () => {
      setIsLoading(true)
      
      try {
        // ReactPlayer should handle this internally
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading HLS stream:", error)
        setIsLoading(false)
      }
    }
    
    checkHlsSupport()
    
    return () => {
      // Cleanup
    }
  }, [url, isOpen])
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }
  
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div 
        ref={playerContainerRef} 
        className="relative w-full max-w-5xl max-h-[80vh] rounded-lg overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-96 bg-black">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ReactPlayer
            url={url}
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
        )}
        
        {/* Controls Overlay */}
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
            <h3 className="text-white font-medium">Live Stream</h3>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Bottom Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-t from-black/80 to-transparent">
            <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/20">
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            
            <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
              {isFullscreen ? <MinimizeIcon className="h-5 w-5" /> : <ExpandIcon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}