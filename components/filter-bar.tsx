"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const AGE_OPTIONS = [
  { value: "all", label: "All Ages" },
  { value: "18-24", label: "18-24" },
  { value: "25-34", label: "25-34" },
  { value: "35-44", label: "35-44" },
  { value: "45-100", label: "45+" }
]

const BODY_OPTIONS = [
  { value: "all", label: "All Body Types" },
  { value: "athletic", label: "Athletic" },
  { value: "bbw", label: "BBW" },
  { value: "curvy", label: "Curvy" },
  { value: "petite", label: "Petite" }
]

const ETHNICITY_OPTIONS = [
  { value: "all", label: "All Ethnicities" },
  { value: "arab", label: "Arab" },
  { value: "asian", label: "Asian" },
  { value: "ebony", label: "Ebony" },
  { value: "hispanic", label: "Hispanic" },
  { value: "caucasian", label: "Caucasian" }
]

interface FilterBarProps {
  defaultGender?: string;
}

export function FilterBar({ defaultGender }: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Get current filter values from URL
  const currentAge = searchParams.get("age") || "all"
  const currentBody = searchParams.get("body") || "all"
  const currentEthnicity = searchParams.get("ethnicity") || "all"
  
  // Helper to create URL with updated search params
  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value === "all") {
      params.delete(name)
    } else {
      params.set(name, value)
    }
    
    return params.toString()
  }
  
  // Apply a filter and navigate
  const applyFilter = (filterName: string, value: string) => {
    const queryString = createQueryString(filterName, value)
    router.push(`${pathname}?${queryString}`)
  }
  
  return (
    <>
      {/* Desktop Filter Bar */}
      <div className="hidden md:grid md:grid-cols-3 gap-0.5">
        <Select 
          value={currentAge} 
          onValueChange={(value) => applyFilter("age", value)}
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue placeholder="Select Age" />
          </SelectTrigger>
          <SelectContent>
            {AGE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-xs">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select 
          value={currentBody} 
          onValueChange={(value) => applyFilter("body", value)}
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue placeholder="Body Type" />
          </SelectTrigger>
          <SelectContent>
            {BODY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-xs">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select 
          value={currentEthnicity} 
          onValueChange={(value) => applyFilter("ethnicity", value)}
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue placeholder="Ethnicity" />
          </SelectTrigger>
          <SelectContent>
            {ETHNICITY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-xs">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Mobile Filter Bar */}
      <div className="md:hidden grid grid-cols-3 gap-0.5 bg-background/95 sticky top-[100px] z-20 pb-1">
        <Select 
          value={currentAge} 
          onValueChange={(value) => applyFilter("age", value)}
        >
          <SelectTrigger className="border-0 h-6 text-[10px]">
            <SelectValue placeholder="Age" />
          </SelectTrigger>
          <SelectContent>
            {AGE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-xs">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select 
          value={currentBody} 
          onValueChange={(value) => applyFilter("body", value)}
        >
          <SelectTrigger className="border-0 h-6 text-[10px]">
            <SelectValue placeholder="Body" />
          </SelectTrigger>
          <SelectContent>
            {BODY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-xs">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select 
          value={currentEthnicity} 
          onValueChange={(value) => applyFilter("ethnicity", value)}
        >
          <SelectTrigger className="border-0 h-6 text-[10px]">
            <SelectValue placeholder="Ethnicity" />
          </SelectTrigger>
          <SelectContent>
            {ETHNICITY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-xs">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  )
}