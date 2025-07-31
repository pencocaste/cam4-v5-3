"use client"

import Link from "next/link"
import { VideoIcon, HomeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const genderNavItems = [
    { label: "Females", href: "/females/" },
    { label: "Males", href: "/males/" },
    { label: "Couples", href: "/couples/" },
    { label: "Trans", href: "/trans/" }
  ]

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-200",
      scrolled 
        ? "bg-background/80 backdrop-blur-md shadow-sm" 
        : "bg-background"
    )}>
      {/* Main header with logo and sign in */}
      <div className="w-full px-4 flex h-12 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <VideoIcon className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold">CAM4</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <Button size="sm" className="h-7 text-xs">Sign In</Button>
        </div>
      </div>
      
      {/* Gender navigation menu below the main header */}
      <div className="border-b border-border">
        <div className="w-full px-4 py-0.5">
          <div className="flex items-center space-x-0.5 overflow-x-auto scrollbar-hide">
            {/* Home button at the beginning */}
            <Link href="/">
              <Button 
                variant={pathname === "/" || pathname === "" ? "default" : "ghost"}
                size="sm"
                className="font-medium whitespace-nowrap h-7 px-2 text-xs"
              >
                <HomeIcon className="h-3.5 w-3.5" />
              </Button>
            </Link>
            
            {genderNavItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button 
                  variant={pathname === item.href || pathname === item.href.slice(0, -1) ? "default" : "ghost"}
                  size="sm"
                  className="font-medium whitespace-nowrap h-7 px-2 text-xs"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}