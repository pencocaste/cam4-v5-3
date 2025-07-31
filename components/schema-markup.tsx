interface SchemaMarkupProps {
  type: 'person' | 'website' | 'breadcrumb' | 'itemList';
  data: any;
}

export function SchemaMarkup({ type, data }: SchemaMarkupProps) {
  const getSchema = () => {
    switch (type) {
      case 'person':
        return {
          "@context": "https://schema.org",
          "@type": "Person",
          "name": data.username,
          "nationality": data.country,
          "gender": data.gender,
          "image": data.profile_pic,
          "url": `https://cam4.xxx/${data.username}/`,
          "description": data.bio || `Watch ${data.username}'s live cam show`,
          "birthDate": data.dob,
          "height": data.height,
          "eyeColor": data.eyes,
          "hairColor": data.hair_color,
          "knowsLanguage": data.languages || []
        };
      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "CAM4",
          "url": "https://cam4.xxx",
          "description": "Free adult webcam shows and live sex cams",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://cam4.xxx/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        };
      case 'breadcrumb':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data.map((item: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        };
      case 'itemList':
        return {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": data.title,
          "description": data.description,
          "numberOfItems": data.items?.length || 0,
          "itemListElement": data.items?.map((item: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "Person",
              "name": item.nickname,
              "image": item.thumb_big || item.thumb,
              "url": `https://cam4.xxx/${item.nickname}/`,
              "nationality": item.country,
              "gender": item.gender
            }
          })) || []
        };
      default:
        return null;
    }
  };

  const schema = getSchema();
  
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}