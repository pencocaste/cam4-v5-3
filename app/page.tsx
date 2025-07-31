import { Suspense } from 'react';
import { ServerCamGrid } from '@/components/server-cam-grid';
import { FilterSidebar } from '@/components/filter-sidebar';
import { PageHeader } from '@/components/page-header';
import { LoadingSpinner } from '@/components/loading-spinner';
import { SchemaMarkup } from '@/components/schema-markup';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Sex Cams on CAM4 - Free Adult Webcam Shows',
  description: 'CAM4 is an adult webcam site where you can watch hot cam models performing live sex cam shows, starring by amateur girls, guys, couples and transsexuals.',
  alternates: {
    canonical: 'https://cam4.xxx/'
  }
};

export default function Home() {
  return (
    <div className="w-full px-0 py-2">
      <SchemaMarkup 
        type="website" 
        data={{}} 
      />
      <div className="max-w-[1800px] mx-auto">
        <PageHeader
          title="Live Sex Cams on CAM4"
          description="CAM4 is an adult webcam site where you can watch hot cam models performing live sex cam shows, starring by amateur girls, guys, couples and transsexuals."
          className="px-2 mb-2"
        />
        
        <div className="flex flex-col md:flex-row gap-1">
          <div className="w-full md:w-[150px] px-2">
            <FilterSidebar />
          </div>
          
          <div className="w-full md:flex-1">
            <Suspense fallback={
              <LoadingSpinner />
            }>
              <ServerCamGrid />
            </Suspense>
            
            {/* SEO Content Section */}
            <div className="mt-8 px-2">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <h2 className="text-xl font-bold mb-4">Free Adult Webcam Shows</h2>
                <p className="mb-4">
                  Welcome to CAM4, the ultimate destination for free adult webcam entertainment. 
                  Our live porn platform features thousands of amateur camgirls from around the world, broadcasting live 
                  sex shows 24/7. Whether you&#39;re looking for female cams, male cams, couple cams, or trans cams, 
                  we have something for everyone.
                </p>
                
                <h2 className="text-lg font-semibold mb-3">Why Choose CAM4 Live Cams?</h2>
                <ul className="list-disc list-inside mb-4 space-y-1">
                  <li>Completely free to watch - no registration required</li>
                  <li>HD quality live streams from amateur performers</li>
                  <li>Interactive sex chat features to connect with cam models</li>
                  <li>Wide variety of webcam girls from different countries</li>
                  <li>Safe and secure platform with privacy protection</li>
                </ul>
                
                <h3 className="text-lg font-semibold mb-3">Live Adult Webcams from Around the World</h3>
                <p className="mb-4">
                  Explore our diverse collection of live sex cams featuring webcam models from countries like 
                  Colombia, Brazil, Argentina, Philippines, Thailand, and many more. Our international community 
                  of cammodels offers unique experiences and cultural diversity that you won&#39;t find anywhere else.
                </p>
                
                <h2 className="text-lg font-semibold mb-3">Start Watching Now</h2>
                <p>
                  Browse through our categories above to find exactly what you&#39;re looking for. All our live sex cams 
                  are completely free to watch, and you can start chatting with live girls right away. Join millions 
                  of viewers who choose CAM4 for their adult webcam entertainment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
