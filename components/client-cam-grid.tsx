"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useSearchParams } from "next/navigation"
import { fetchCams } from "@/lib/api"
import { type Cam } from "@/lib/types"
import InfiniteScroll from "react-infinite-scroll-component"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { CamCard } from "@/components/cam-card"

interface ClientCamGridProps {
  initialCams: Cam[];
  defaultGender?: string;
  defaultCountry?: string;
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

export function ClientCamGrid({ initialCams, defaultGender, defaultCountry }: ClientCamGridProps) {
  const [cams, setCams] = useState<Cam[]>(() => removeDuplicateCams(initialCams));
  const [page, setPage] = useState(2); // Start at page 2 because page 1 is already loaded
  const [hasMore, setHasMore] = useState(true)
  const [isInfiniteScrollMode, setIsInfiniteScrollMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(initialCams.length === 0)
  const [loadedCamIds] = useState<Set<number>>(() => new Set(initialCams.map(cam => cam.id)));
  
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
    
    // If a default country is provided (for country-specific pages), use it
    if (defaultCountry) {
      params.country = defaultCountry
    } else {
      // Otherwise use the search params country if available
      const country = searchParams.get("country")
      if (country) params.country = country
    }
    
    const age = searchParams.get("age")
    const body = searchParams.get("body")
    const ethnicity = searchParams.get("ethnicity")
    const tag = searchParams.getAll("tag")
    
    if (age) params.age = age
    if (body) params.body = body
    if (ethnicity) params.ethnicity = ethnicity
    if (tag.length > 0) tag.forEach(t => params.tag = t)
    
    return params
  }, [defaultGender, defaultCountry, searchParams])
  
  // Load initial data if not provided
  useEffect(() => {
    if (isInitialLoad) {
      const loadInitialData = async () => {
        setIsLoading(true);
        try {
          const filterParams = getFilterParams();
          filterParams.limit = "36"; // Always load 36 for consistency
          const newCams = await fetchCams(1, filterParams);
          const uniqueCams = removeDuplicateCams(newCams);
          setCams(uniqueCams);
          // Update loaded IDs
          uniqueCams.forEach(cam => loadedCamIds.add(cam.id));
          setIsInitialLoad(false);
          setPage(2);
          setHasMore(uniqueCams.length >= 36);
        } catch (error) {
          console.error('Error loading initial data:', error);
          setError("Failed to load initial data");
          setIsInitialLoad(false);
        } finally {
          setIsLoading(false);
        }
      };
      loadInitialData();
    }
  }, [isInitialLoad, getFilterParams, loadedCamIds]);
  
  const loadMoreCams = useCallback(async (isManualLoad = false) => {
    if (isLoading) {
      console.log('Already loading, skipping request');
      return;
    }
    
    console.log(`Loading more cams - Page: ${page}, Manual: ${isManualLoad}`);
    setIsLoading(true)
    setError(null)
    
    try {
      const filterParams = getFilterParams()
      
      // Always load 36 models per request for consistency
      filterParams.limit = "36";
      
      const newCams = await fetchCams(page, filterParams)
      console.log(`API returned ${newCams.length} cams for page ${page}`);
      
      if (newCams && newCams.length > 0) {
        // Filter out duplicates before merging
        const uniqueNewCams = newCams.filter(cam => !loadedCamIds.has(cam.id));
        console.log(`${uniqueNewCams.length} unique cams after filtering duplicates`);
        
        if (uniqueNewCams.length > 0) {
          setCams(prev => {
            const merged = mergeUniquesCams(prev, uniqueNewCams);
            console.log(`Total cams after merge: ${merged.length}`);
            return merged;
          });
          // Update loaded IDs tracking
          uniqueNewCams.forEach(cam => loadedCamIds.add(cam.id));
        }
        
        // Always increment page based on API response
        setPage(prev => prev + 1)
        
        // Determine if there are more pages based on original API response
        const hasMorePages = newCams.length >= 36;
        setHasMore(hasMorePages);
        console.log(`Has more pages: ${hasMorePages}`);
        
        // If this was a manual load, switch to infinite scroll mode
        if (isManualLoad) {
          setIsInfiniteScrollMode(true);
          console.log('Switched to infinite scroll mode');
        }
      } else {
        console.log('No more cams available');
        setHasMore(false)
      }
    } catch (err) {
      console.error('Error loading more cams:', err);
      setError("Failed to load performers. Please try again.")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load more performers. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, getFilterParams, page, loadedCamIds, toast])
  
  const handleManualLoadMore = () => {
    console.log('Manual load more clicked');
    if (isLoading) {
      console.log('Already loading, ignoring click');
      return;
    }
    loadMoreCams(true); // Pass true to indicate this is a manual load
  }
  
  // Reset when filters change
  useEffect(() => {
    console.log('Filters changed, resetting state');
    const uniqueInitialCams = removeDuplicateCams(initialCams);
    setCams(uniqueInitialCams);
    // Reset loaded IDs tracking
    loadedCamIds.clear();
    uniqueInitialCams.forEach(cam => loadedCamIds.add(cam.id));
    setPage(2);
    setHasMore(true);
    setIsInfiniteScrollMode(false); // Reset to button mode
    setIsLoading(false);
    setIsInitialLoad(uniqueInitialCams.length === 0);
  }, [initialCams, searchParams, getFilterParams, defaultCountry, loadedCamIds]);
  
  // Don't render anything if we're in initial load state
  if (isInitialLoad && isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error && cams.length === 0) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }
  
  // Show manual load button if not in infinite scroll mode and there are more cams
  if (!isInfiniteScrollMode && hasMore) {
    return (
      <div className="flex justify-center mt-4 mb-2">
        <Button 
          onClick={handleManualLoadMore}
          size="sm"
          disabled={isLoading}
          className="px-4 py-0 h-7 text-xs"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2"></div>
              Loading...
            </>
          ) : (
            "More webcams"
          )}
        </Button>
      </div>
    )
  }
  
  // Show infinite scroll mode if activated
  if (isInfiniteScrollMode) {
    const additionalCams = cams.slice(initialCams.length);
    
    return (
      <div>
        <InfiniteScroll
          dataLength={additionalCams.length}
          next={() => loadMoreCams(false)} // false = not manual load
          hasMore={hasMore}
          loader={
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-1 mt-1">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={`skeleton-${index}`} className="aspect-[4/3] bg-muted animate-pulse rounded"></div>
              ))}
            </div>
          }
          endMessage={
            <p className="text-center text-muted-foreground py-4 text-xs">
              No more performers to show
            </p>
          }
          scrollThreshold={0.8}
          className="pb-4"
        >
          {/* Additional grid for newly loaded cams */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-1 mt-1">
            {additionalCams.map((cam) => (
              <CamCard 
                key={cam.id} 
                cam={cam}
              />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    )
  }
  
  // Show end message if no more cams and not in infinite scroll mode
  if (!hasMore) {
    return (
      <p className="text-center text-muted-foreground py-4 text-xs">
        No more performers to show
      </p>
    )
  }
  
  // Fallback - shouldn't reach here normally
  return null;
}