import { Suspense } from 'react';
import { ServerCamGrid } from '@/components/server-cam-grid';
import { FilterSidebar } from '@/components/filter-sidebar';
import { PageHeader } from '@/components/page-header';
import { LoadingSpinner } from '@/components/loading-spinner';
import { SchemaMarkup } from '@/components/schema-markup';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Couple Sex Cams on CAM4 - Live Webcam Shows for Two',
  description: 'Watch the hottest free couple sex cams featuring real amateur couples performing live sex shows together. Experience authentic couple webcam broadcasts.',
  alternates: {
    canonical: 'https://cam4.xxx/couples/'
  }
};

export default function CouplesPage() {
  return (
    <div className="w-full px-0 py-2">
      <SchemaMarkup 
        type="breadcrumb" 
        data={[
          { name: "Home", url: "https://cam4.xxx/" },
          { name: "Couple Cams", url: "https://cam4.xxx/couples/" }
        ]} 
      />
      <div className="max-w-[1800px] mx-auto">
        <PageHeader
          title="Couple Sex Cams on CAM4"
          description="Browse through thousands of couple performers from around the world"
          className="px-2 mb-2"
        />
        
        <div className="flex flex-col md:flex-row gap-1">
          <div className="w-full md:w-[150px] px-2">
            <FilterSidebar defaultGender="couple" />
          </div>
          
          <div className="w-full md:flex-1">
            <Suspense fallback={
              <LoadingSpinner />
            }>
              <ServerCamGrid defaultGender="couple" />
            </Suspense>
            
            {/* SEO Content Section */}
            <div className="mt-8 px-2">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <h2 className="text-xl font-bold mb-4">Free Couple Sex Cams - Live Webcam Shows for Two</h2>
                <p className="mb-4">
                  Watch the hottest free couple sex cams on CAM4. Our platform features real amateur couples from 
                  around the world performing live sex shows together. Experience authentic couple webcam broadcasts, 
                  interactive chat features, and HD quality streams, all completely free to watch and enjoy.
                </p>
                
                <h3 className="text-lg font-semibold mb-3">Couple Cam Features</h3>
                <ul className="list-disc list-inside mb-4 space-y-1">
                  <li>Real amateur couples performing live together</li>
                  <li>Interactive live chat and tip features</li>
                  <li>HD quality couple webcam shows</li>
                  <li>Diverse couples from different countries</li>
                  <li>Free access with no registration required</li>
                </ul>
                
                <h3 className="text-lg font-semibold mb-3">International Couple Performers</h3>
                <p className="mb-4">
                  Our couples section showcases passionate partners from Colombia, Brazil, Argentina, European 
                  countries, and more. Watch as real couples share intimate moments, perform together, and interact 
                  with viewers in ways that solo performers simply can&#39;t match.
                </p>
                
                <h3 className="text-lg font-semibold mb-3">Experience Couple Cams Now</h3>
                <p>
                  Browse our free couple sex cams and discover your favorite duos. Join their live chat rooms, 
                  interact with both performers, and enjoy unique couple webcam entertainment. Our couples are 
                  broadcasting live shows around the clock for your viewing pleasure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}