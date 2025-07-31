"use client"

import { useEffect, useState, useCallback } from "react"
import { CamCard } from "@/components/cam-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useSearchParams } from "next/navigation"
import { fetchCams } from "@/lib/api"
import { type Cam } from "@/lib/types"
import InfiniteScroll from "react-infinite-scroll-component"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CamGridProps {
  defaultGender?: string;
}

// Utility function to remove duplicates based on cam ID
const removeDuplicateCams = (cams: Cam[]): Cam[] => {
  const seenIds = new Set<number>();
  return cams.filter(cam => {
    if (seenIds.has(cam.id)) {
      return false;
    }
    seenIds.add(cam.id);
    return true;
  });
};

// Utility function to merge new cams with existing ones, avoiding duplicates
const mergeUniquesCams = (existingCams: Cam[], newCams: Cam[]): Cam[] => {
  const existingIds = new Set(existingCams.map(cam => cam.id));
  const uniqueNewCams = newCams.filter(cam => !existingIds.has(cam.id));
  return [...existingCams, ...uniqueNewCams];
};
export function CamGrid({ defaultGender }: CamGridProps) {
  const [cams, setCams] = useState<Cam[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const [showInfiniteScroll, setShowInfiniteScroll] = useState(false)
  const [loadedCamIds] = useState<Set<number>>(new Set());
  
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const getFilterParams = useCallback(() => {
    const params: Record<string, string> = {}
    
    // If a default gender is provided (for gender-specific pages), use it
    if (defaultGender) {
      params.gender = defaultGender
    } else {
      // Otherwise use the search params gender if available
      const gender = searchParams.get("gender")
      if (gender) params.gender = gender
    }
    
    const age = searchParams.get("age")
    const country = searchParams.get("country")
    const body = searchParams.get("body")
    const ethnicity = searchParams.get("ethnicity")
    const tag = searchParams.getAll("tag")
    
    if (age) params.age = age
    if (country) params.country = country
    if (body) params.body = body
    if (ethnicity) params.ethnicity = ethnicity
    if (tag.length > 0) tag.forEach(t => params.tag = t)
    
    return params
  }, [searchParams, defaultGender])
  
  const loadCams = useCallback(async (resetCams = false) => {
    // Prevent duplicate loading requests
    if (isLoading && !resetCams) return;
    
    setIsLoading(true)
    setError(null)
    
    try {
      const pageToLoad = resetCams ? 1 : page
      const filterParams = getFilterParams()
      
      // Always request 36 items for initial load, 24 for subsequent loads
      const itemsPerPage = resetCams ? 36 : 24
      
      // Add items_per_page parameter
      filterParams.items_per_page = itemsPerPage.toString()
      
      const newCams = await fetchCams(pageToLoad, filterParams)
      
      if (resetCams) {
        // Reset tracking and remove duplicates
        loadedCamIds.clear();
        const uniqueCams = removeDuplicateCams(newCams);
        setCams(uniqueCams)
        uniqueCams.forEach(cam => loadedCamIds.add(cam.id));
        setCams(newCams)
        setPage(prevPage => 2)
        setHasMore(uniqueCams.length >= itemsPerPage)
      } else {
        // Filter out duplicates before merging
        const uniqueNewCams = newCams.filter(cam => !loadedCamIds.has(cam.id));
        
        if (uniqueNewCams.length > 0) {
          setCams(prev => mergeUniquesCams(prev, uniqueNewCams))
          uniqueNewCams.forEach(cam => loadedCamIds.add(cam.id));
        }
        
        // Always increment page and check hasMore based on original API response
        setPage(prevPage => prevPage + 1)
        // Use original newCams length to determine if there are more pages
        setHasMore(newCams.length >= itemsPerPage)
        
        // If all returned cams were duplicates but API returned full batch, try next page
        if (uniqueNewCams.length === 0 && newCams.length >= itemsPerPage && pageToLoad < 10) {
          setTimeout(() => loadCams(false), 100);
        }
      }
      
      
      if (initialLoad && resetCams) {
        setInitialLoad(prevInitialLoad => false)
      }
      
      if (resetCams && (newCams.length === 0 || cams.length === 0)) {
        setError("No results found for your search criteria.")
      }
    } catch (err) {
      setError("Failed to load performers. Please try again.")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load performers. Please try again.",
      })
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [getFilterParams, page, initialLoad, isLoading, toast, loadedCamIds, cams.length])
  
  const handleLoadMore = () => {
    if (isLoading) return;
    setShowInfiniteScroll(true)
    loadCams(false)
  }
  
  useEffect(() => {
    loadCams(true)
    setShowInfiniteScroll(false)
  }, [loadCams, setShowInfiniteScroll])
  
  if (isLoading && cams.length === 0) {
    return <LoadingSpinner />
  }
  
  if (error && cams.length === 0) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }
  
  // Only display the first 36 items if we're still in initial load mode (before "More webcams" click)
  const displayCams = !showInfiniteScroll ? cams.slice(0, 36) : cams
  
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-1">
        {displayCams.map((cam) => (
          <CamCard key={cam.id} cam={cam} />
        ))}
      </div>
      
      {!showInfiniteScroll && hasMore ? (
        <div className="flex justify-center mt-8 mb-6">
          <Button 
            onClick={handleLoadMore}
            size="lg"
            disabled={isLoading}
            className="px-8"
          >
            {isLoading ? "Loading..." : "More webcams"}
          </Button>
        </div>
      ) : showInfiniteScroll ? (
        <InfiniteScroll
          dataLength={cams.length}
          next={() => {
            if (!isLoading) loadCams(false);
          }}
          hasMore={hasMore}
          loader={<div className="py-4"><LoadingSpinner /></div>}
          endMessage={
            <p className="text-center text-muted-foreground py-8">
              No more performers to show
            </p>
          }
          scrollThreshold={0.8}
          className="pb-8"
        >
          {/* This is just a placeholder for InfiniteScroll to attach to */}
        </InfiniteScroll>
      ) : (
        <p className="text-center text-muted-foreground py-8">
          No more performers to show
        </p>
      )}
    </div>
  )
}