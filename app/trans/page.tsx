import { Suspense } from 'react';
import { ServerCamGrid } from '@/components/server-cam-grid';
import { FilterSidebar } from '@/components/filter-sidebar';
import { PageHeader } from '@/components/page-header';
import { LoadingSpinner } from '@/components/loading-spinner';
import { SchemaMarkup } from '@/components/schema-markup';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trans Sex Cams on CAM4 - Live Shemale Webcam Shows',
  description: 'Explore CAM4s extensive collection of free trans sex cams featuring beautiful transgender and shemale performers broadcasting live 24/7.',
  alternates: {
    canonical: 'https://cam4.xxx/trans/'
  }
};

export default function TransPage() {
  return (
    <div className="w-full px-0 py-2">
      <SchemaMarkup 
        type="breadcrumb" 
        data={[
          { name: "Home", url: "https://cam4.xxx/" },
          { name: "Trans Cams", url: "https://cam4.xxx/trans/" }
        ]} 
      />
      <div className="max-w-[1800px] mx-auto">
        <PageHeader
          title="Trans Sex Cams on CAM4"
          description="Browse through thousands of trans performers from around the world"
          className="px-2 mb-2"
        />
        
        <div className="flex flex-col md:flex-row gap-1">
          <div className="w-full md:w-[150px] px-2">
            <FilterSidebar defaultGender="shemale" />
          </div>
          
          <div className="w-full md:flex-1">
            <Suspense fallback={
              <LoadingSpinner />
            }>
              <ServerCamGrid defaultGender="shemale" />
            </Suspense>
            
            {/* SEO Content Section */}
            <div className="mt-8 px-2">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <h2 className="text-xl font-bold mb-4">Free Trans Sex Cams - Live Shemale Webcam Shows</h2>
                <p className="mb-4">
                  Explore CAM4&#39;s extensive collection of free trans sex cams featuring beautiful transgender and 
                  shemale performers. Our platform hosts stunning trans models from around the world who broadcast 
                  live webcam shows 24/7. Watch gorgeous trans performers, chat with them live, and enjoy HD quality 
                  streams completely free.
                </p>
                
                <h3 className="text-lg font-semibold mb-3">Trans Cam Highlights</h3>
                <ul className="list-disc list-inside mb-4 space-y-1">
                  <li>Beautiful transgender and shemale performers</li>
                  <li>Live interactive chat and private show options</li>
                  <li>HD quality trans webcam broadcasts</li>
                  <li>Diverse performers from different backgrounds</li>
                  <li>Free viewing and registration</li>
                </ul>
                
                <h3 className="text-lg font-semibold mb-3">International Trans Community</h3>
                <p className="mb-4">
                  Our trans cam section features gorgeous transgender performers from Colombia, Brazil, Thailand, 
                  Philippines, and other countries known for their beautiful trans community. Each performer brings 
                  their unique charm and personality to create memorable live webcam experiences.
                </p>
                
                <h3 className="text-lg font-semibold mb-3">Join Our Trans Community</h3>
                <p>
                  Start exploring our free trans sex cams today. Click on any trans performer to enter their live 
                  chat room, interact with them directly, and enjoy premium transgender webcam entertainment. Our 
                  trans models are available 24/7 to provide you with the most exciting live cam experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}