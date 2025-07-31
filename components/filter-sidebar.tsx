"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SlidersHorizontal } from "lucide-react"

const COUNTRIES = [
  { slug: "argentina", name: "Argentina" },
  { slug: "brazil", name: "Brazil" },
  { slug: "colombia", name: "Colombia" },
  { slug: "mexico", name: "Mexico" },
  { slug: "venezuela", name: "Venezuela" },
  { slug: "spain", name: "Spain" },
  { slug: "italy", name: "Italy" },
  { slug: "france", name: "France" },
  { slug: "germany", name: "Germany" },
  { slug: "united-kingdom", name: "United Kingdom" },
  { slug: "united-states", name: "United States" },
  { slug: "canada", name: "Canada" },
  { slug: "ukraine", name: "Ukraine" },
  { slug: "romania", name: "Romania" },  
  { slug: "philippines", name: "Philippines" },
  { slug: "thailand", name: "Thailand" },
  { slug: "indonesia", name: "Indonesia" },
]
interface FilterSidebarProps {
  defaultGender?: string;
}

export function FilterSidebar({ defaultGender }: FilterSidebarProps) {
  const pathname = usePathname()
  
  // Get the base URL for country links
  const getCountryBaseUrl = () => {
    if (defaultGender === "male") return "/males"
    if (defaultGender === "shemale") return "/trans"
    return "/females" // default for female or no gender specified
  }

  const filterContent = (
    <div className="space-y-3 text-xs">
      <div className="text-xs font-medium">Countries</div>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {COUNTRIES.map((country) => (
          <Link 
            key={country.slug} 
            href={`${getCountryBaseUrl()}/${country.slug}/`}
            className="block text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5"
          >
            {country.name}
          </Link>
        ))}
      </div>
    </div>
  )
  
  return (
    <>
      {/* Desktop Filter Sidebar */}
      <div className="hidden md:block sticky top-20">
        {filterContent}
      </div>
      
      {/* Mobile Floating Filter Button */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="default" 
              size="icon"
              className="fixed bottom-4 right-4 z-40 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span className="sr-only">Open filters</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader className="sr-only">
              <SheetTitle>Filter Options</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              {filterContent}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}