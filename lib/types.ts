export interface Cam {
  id: number;
  nickname: string;
  gender: string;
  country: string;
  age?: number;
  viewers: number;
  preview_url?: string;
  thumb: string;
  thumb_big: string | null;
  thumb_error: string;
  profile_thumb?: string;
  profile_thumb_sfw?: string;
  sex_preference?: string;
  status: string;
  show_tags: string[];
  languages: string[];
  broadcast_type: string;
  show_type: string;
  daily_award: boolean;
  monthly_award: boolean;
  hd_stream: boolean | null;
  private_room: boolean;
  new_performer: boolean;
  has_shop_content: boolean;
  kiiroo: boolean;
  mobile: boolean;
  goal: number;
  goal_balance: number;
  link?: string;
  blocked_regions?: string[] | null;
  source?: string;
}

export interface CamProfile extends Cam {
  about_me?: string;
  country_name?: string;
  join_date?: string;
  rating?: string;
  body_type?: string;
  ethnicity?: string;
  username?: string;
  avatar_url?: string;
  tags?: string[];
}

export interface DetailedCamProfile {
  link?: string;
  username: string;
  bio?: string;
  dob?: string;
  age?: number;
  tattoos?: boolean;
  piercings?: boolean;
  body_hair?: string;
  facial_hair?: string | null;
  body_type?: string | null;
  breast_size?: string;
  city?: string;
  country?: string;
  drink?: string | null;
  ethnicity?: string;
  eyes?: string;
  gender?: string;
  hair_color?: string;
  hair_length?: string;
  height?: string;
  languages?: string[];
  male_role?: string | null;
  male_type?: string | null;
  female_type?: string | null;
  marital_status?: string | null;
  occupation?: string;
  penis_size?: string | null;
  sexual_preference?: string;
  smoke?: string | null;
  timezone?: string;
  trans_penis_size?: string | null;
  trans_type?: string | null;
  profile_pic?: string;
  videos?: any[];
  photos?: {
    thumb: string;
    full: string;
  }[];
  broadcast_history?: {
    days: {
      day: string;
      broadcastsPerHours: number[];
    }[];
    totalBroadcastsPerHours: number[];
    averageBroadcastLength: number;
    averageViewers: number;
  };
  rank?: number;
  status?: string;
}

export interface ApiResponse {
  cams: Cam[];
}