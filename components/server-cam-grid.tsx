import { fetchCams } from "@/lib/api";
import { CamCard } from "@/components/cam-card";
import { type Cam } from "@/lib/types";
import { ClientCamGrid } from "@/components/client-cam-grid";
import { LoadingSpinner } from "@/components/loading-spinner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { SchemaMarkup } from "@/components/schema-markup";
import { ImagePreloader } from "@/components/image-preloader";

interface ServerCamGridProps {
  defaultGender?: string;
  defaultCountry?: string;
}

export async function ServerCamGrid({ defaultGender, defaultCountry }: ServerCamGridProps) {
  // Configurar los filtros iniciales
  const filterParams: Record<string, string> = {};
  
  if (defaultGender) {
    filterParams.gender = defaultGender;
  }
  
  if (defaultCountry) {
    filterParams.country = defaultCountry;
  }
  
  // Reduced initial load for faster performance
  filterParams.limit = "36";
  
  // Obtener los datos de forma asíncrona en el servidor
  let initialCams: Cam[] = [];
  let isLoading = true;
  
  try {
    initialCams = await fetchCams(1, filterParams);
    isLoading = false;
  } catch (error) {
    console.error('Error fetching initial cams:', error);
    // Return empty array on error but still show skeleton
    initialCams = [];
    isLoading = false;
  }
  
  // Always show skeleton if no initial data - don't delegate to client
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // If we have no data after successful load, show skeleton with client loading
  if (initialCams.length === 0) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="px-0">
      {/* Preload critical images */}
      <ImagePreloader 
        images={initialCams.slice(0, 12).map(cam => 
          cam.thumb_big || cam.thumb || cam.thumb_error
        ).filter(Boolean)} 
        priority={true}
      />
      
      {/* Schema markup for the cam list */}
      <SchemaMarkup 
        type="itemList" 
        data={{
          title: `Live ${defaultGender ? defaultGender.charAt(0).toUpperCase() + defaultGender.slice(1) : ''} Webcam Shows`,
          description: `Browse live ${defaultGender || 'adult'} webcam performers`,
          items: initialCams.slice(0, 12) // Limit schema to first 12 items for performance
        }} 
      />
      {/* Renderizado del lado del servidor para SEO */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-1">
        {initialCams.slice(0, 24).map((cam, index) => (
          <CamCard 
            key={cam.id} 
            cam={cam} 
            priority={index < 6} // Priority loading for first 6 images
            loading={index < 12 ? "eager" : "lazy"} // Eager loading for first 12
          />
        ))}
      </div>
      
      {/* Componente cliente para manejo de estado y carga infinita */}
      <ClientCamGrid 
        initialCams={initialCams} 
        defaultGender={defaultGender}
        defaultCountry={defaultCountry}
      />
    </div>
  );
}