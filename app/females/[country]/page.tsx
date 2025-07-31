import { Suspense } from 'react';
import { ServerCamGrid } from '@/components/server-cam-grid';
import { FilterSidebar } from '@/components/filter-sidebar';
import { PageHeader } from '@/components/page-header';
import { LoadingSpinner } from '@/components/loading-spinner';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// Mapeo de nombres de países a códigos ISO
const COUNTRY_MAPPINGS: Record<string, { code: string; name: string }> = {
  'argentina': { code: 'ar', name: 'Argentina' },
  'brazil': { code: 'br', name: 'Brazil' },
  'colombia': { code: 'co', name: 'Colombia' },
  'mexico': { code: 'mx', name: 'Mexico' },
  'venezuela': { code: 've', name: 'Venezuela' },
  'spain': { code: 'es', name: 'Spain' },
  'italy': { code: 'it', name: 'Italy' },
  'france': { code: 'fr', name: 'France' },
  'germany': { code: 'de', name: 'Germany' },
  'united-kingdom': { code: 'gb', name: 'United Kingdom' },
  'united-states': { code: 'us', name: 'United States' },
  'canada': { code: 'ca', name: 'Canada' },
  'russia': { code: 'ru', name: 'Russia' },
  'ukraine': { code: 'ua', name: 'Ukraine' },
  'poland': { code: 'pl', name: 'Poland' },
  'romania': { code: 'ro', name: 'Romania' },
  'czech': { code: 'cz', name: 'Czech Republic' },
  'hungary': { code: 'hu', name: 'Hungary' },
  'philippines': { code: 'ph', name: 'Philippines' },
  'thailand': { code: 'th', name: 'Thailand' },
  'indonesia': { code: 'id', name: 'Indonesia' },
  'india': { code: 'in', name: 'India' },
  'china': { code: 'cn', name: 'China' },
  'japan': { code: 'jp', name: 'Japan' },
  'korea': { code: 'kr', name: 'South Korea' },
};

interface CountryFemalesPageProps {
  params: {
    country: string;
  };
}

export async function generateMetadata({ params }: CountryFemalesPageProps): Promise<Metadata> {
  const countrySlug = params.country.toLowerCase();
  const countryInfo = COUNTRY_MAPPINGS[countrySlug];
  
  if (!countryInfo) {
    return {
      title: 'Country Not Found - CAM4',
      description: 'The requested country could not be found.'
    };
  }

  return {
    title: `${countryInfo.name} Female Sex Cams on CAM4 - Live Webcam Shows`,
    description: `Browse through female performers from ${countryInfo.name}. Watch live sex cams from ${countryInfo.name} girls broadcasting 24/7.`,
    alternates: {
      canonical: `https://cam4.xxx/females/${countrySlug}/`
    }
  };
}

export default function CountryFemalesPage({ params }: CountryFemalesPageProps) {
  const countrySlug = params.country.toLowerCase();
  const countryInfo = COUNTRY_MAPPINGS[countrySlug];
  
  if (!countryInfo) {
    notFound();
  }

  return (
    <div className="w-full px-0 py-2">
      <div className="max-w-[1800px] mx-auto">
        <PageHeader
          title={`${countryInfo.name} Female Cams on CAM4`}
          description={`Browse through female performers from ${countryInfo.name}`}
          className="px-2 mb-2"
        />
        
        <div className="flex flex-col md:flex-row gap-1">
          <div className="w-full md:w-[150px] px-2">
            <FilterSidebar defaultGender="female" />
          </div>
          
          <div className="w-full md:flex-1">
            <Suspense fallback={
              <LoadingSpinner />
            }>
              <ServerCamGrid 
                defaultGender="female" 
                defaultCountry={countryInfo.code}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}