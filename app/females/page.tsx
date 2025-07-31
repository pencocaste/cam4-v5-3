import { Suspense } from 'react';
import { ServerCamGrid } from '@/components/server-cam-grid';
import { FilterSidebar } from '@/components/filter-sidebar';
import { PageHeader } from '@/components/page-header';
import { LoadingSpinner } from '@/components/loading-spinner';
import { SchemaMarkup } from '@/components/schema-markup';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Female Sex Cams on CAM4 - Live Girl Webcam Shows',
  description: 'Browse through thousands of female performers from around the world broadcasting live sex shows 24/7. Watch stunning women perform live webcam shows for free.',
  alternates: {
    canonical: 'https://cam4.xxx/females/'
  }
};

export default function FemalesPage() {
  return (
    <div className="w-full px-0 py-2">
      <SchemaMarkup 
        type="breadcrumb" 
        data={[
          { name: "Home", url: "https://cam4.xxx/" },
          { name: "Female Cams", url: "https://cam4.xxx/females/" }
        ]} 
      />
      <div className="max-w-[1800px] mx-auto">
        <PageHeader
          title="Female Sex Cams on CAM4"
          description="Browse through thousands of female performers from around the world"
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
              <ServerCamGrid defaultGender="female" />
            </Suspense>
            
            {/* SEO Content Section */}
            <div className="mt-8 px-2">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <h2 className="text-xl font-bold mb-4">Free Female Sex Cams - Live Girl Webcam Shows</h2>
                <p className="mb-4">
                  Discover thousands of beautiful female performers on CAM4s free live sex cams. Our platform 
                  features amateur girls from around the world broadcasting live webcam shows 24/7. Watch stunning 
                  women perform live sex shows, chat with them directly, and enjoy high-quality HD streams completely free.
                </p>
                
                <h3 className="text-lg font-semibold mb-3">Featured Female Cam Categories</h3>
                <ul className="list-disc list-inside mb-4 space-y-1">
                  <li>Young amateur girls (18+) from various countries</li>
                  <li>Mature women and MILF performers</li>
                  <li>Interactive live chat and private shows</li>
                  <li>HD quality female webcam broadcasts</li>
                  <li>Free registration and viewing</li>
                </ul>
                
                <h3 className="text-lg font-semibold mb-3">International Female Performers</h3>
                <p className="mb-4">
                  Our female cam section features beautiful women from Colombia, Brazil, Argentina, Philippines, 
                  Thailand, Indonesia, and many European countries. Each performer brings her unique personality 
                  and style to create unforgettable live webcam experiences.
                </p>
                
                <h3 className="text-lg font-semibold mb-3">Join the Fun</h3>
                <p>
                  Start exploring our free female sex cams now. Click on any performer to enter their live chat room, 
                  interact with them, and enjoy premium adult entertainment at no cost. Our female performers are 
                  online 24/7, ready to provide you with the best live webcam experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
