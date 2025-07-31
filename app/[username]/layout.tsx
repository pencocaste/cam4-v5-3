import { Metadata } from "next"
import { fetchCamProfileDetail } from "@/lib/api"
import { getCountryName } from "@/lib/utils"

interface CamProfilePageProps {
  params: {
    username: string
  }
}

export async function generateMetadata({ params }: CamProfilePageProps): Promise<Metadata> {
  try {
    const profile = await fetchCamProfileDetail(params.username);
    
    if (!profile) {
      return {
        title: 'Performer Not Found - CAM4',
        description: 'The requested performer could not be found.'
      };
    }

    const countryName = getCountryName(profile.country || "");
    const profileImage = profile.profile_pic || (profile.photos && profile.photos.length > 0 ? profile.photos[0].full : null);
    
    return {
      title: `${profile.username} ´s Live Sex Cam & Chat Room | CAM4`,
      description: `Watch ${profile.username}'s Sex Cam show for FREE.❤️ ${profile.gender} Webcam model from ${countryName}. Join now for Sex Chat.`,
      openGraph: {
        title: `${profile.username} - Live Sex Cam`,
        description: `Watch ${profile.username}'s live cam show`,
        images: profileImage ? [profileImage] : [],
        type: 'profile',
        url: `https://cam4.xxx/${profile.username}/`
      },
      twitter: {
        card: 'summary_large_image',
        title: `${profile.username} - Live Sex Cam`,
        description: `Watch ${profile.username}'s live cam show`,
        images: profileImage ? [profileImage] : []
      },
      alternates: {
        canonical: `https://cam4.xxx/${profile.username}/`
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'CAM4 - Live Sex Cams',
      description: 'Watch live sex cams and adult webcam shows for free.'
    };
  }
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}