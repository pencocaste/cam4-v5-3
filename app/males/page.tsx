import { Suspense } from 'react';
import { ServerCamGrid } from '@/components/server-cam-grid';
import { FilterSidebar } from '@/components/filter-sidebar';
import { PageHeader } from '@/components/page-header';
import { LoadingSpinner } from '@/components/loading-spinner';
import { SchemaMarkup } from '@/components/schema-markup';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Male Sex Cams on CAM4 - Live Gay Webcam Shows',
  description: 'Experience the best free male sex cams featuring handsome male performers and gay cam models from around the world. Watch hot guys perform live for free.',
  alternates: {
    canonical: 'https://cam4.xxx/males/'
  }
};

export default function MalesPage() {
  return (
    <div className="w-full px-0 py-2">
      <SchemaMarkup 
        type="breadcrumb" 
        data={[
          { name: "Home", url: "https://cam4.xxx/" },
          { name: "Male Cams", url: "https://cam4.xxx/males/" }
        ]} 
      />
      <div className="max-w-[1800px] mx-auto">
        <PageHeader
          title="Male Sex Cams on CAM4"
          description="Browse through thousands of male performers from around the world"
          className="px-2 mb-2"
        />
        
        <div className="flex flex-col md:flex-row gap-1">
          <div className="w-full md:w-[150px] px-2">
            <FilterSidebar defaultGender="male" />
          </div>
          
          <div className="w-full md:flex-1">
            <Suspense fallback={
              <LoadingSpinner />
            }>
              <ServerCamGrid defaultGender="male" />
            </Suspense>
            
            {/* SEO Content Section */}
            <div className="mt-8 px-2">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <h2 className="text-xl font-bold mb-4">Free Male Sex Cams - Live Gay Webcam Shows</h2>
                <p className="mb-4">
                  Experience the best free male sex cams on CAM4. Our platform features handsome male performers 
                  and gay cam models from around the world, broadcasting live webcam shows 24/7. Watch hot guys 
                  perform live sex shows, engage in interactive chat, and enjoy high-quality HD streams for free.
                </p>
                
                <h3 className="text-lg font-semibold mb-3">Male Cam Features</h3>
                <ul className="list-disc list-inside mb-4 space-y-1">
                  <li>Handsome male performers and gay cam models</li>
                  <li>Live interactive chat and private shows</li>
                  <li>HD quality male webcam broadcasts</li>
                  <li>Diverse range of body types and ages (18+)</li>
                  <li>Completely free to watch and chat</li>
                </ul>
                
                <h3 className="text-lg font-semibold mb-3">Global Male Performers</h3>
                <p className="mb-4">
                  Our male cam section showcases attractive men from Colombia, Brazil, Argentina, Philippines, 
                  and European countries. Whether you&#39;re looking for muscular guys, twinks, bears, or mature men, 
                  you&#39;ll find the perfect male performer for your preferences.
                </p>
                
                <h3 className="text-lg font-semibold mb-3">Start Watching Male Cams</h3>
                <p>
                  Browse our free male sex cams and discover your favorite performers. Join their live chat rooms, 
                  tip and interact with them, and enjoy premium gay webcam entertainment. Our male cam models are 
                  online around the clock, ready to provide you with exciting live shows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}