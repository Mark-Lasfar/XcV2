import { Section, SectionVisibility, SectionStyleSettings } from './section';

export interface ProfileData {
  id: string;
  _id: string;
  username: string;
  nickname?: string;
  email?: string;
  avatar?: string;
  coverImage?: string;
  jobTitle?: string;
  bio?: string;
  phone?: string;
  location?: string;
  gender?: 'male' | 'female' | 'other';
  industry?: string;
  isPublic: boolean;
  isVerified?: boolean;
  status?: 'Available' | 'Busy' | 'Open to Work';
  socialLinks: SocialLinks;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  certificates: Certificate[];
  projects: Project[];
  interests: string[];
  sections: Section[]; // ✅ استخدام النوع الموحد
  sectionVisibility: SectionVisibility;
  sectionNames: Record<string, string>;
  sectionStyleSettings: Record<string, SectionStyleSettings>;
  stats?: ProfileStats;
  theme?: ThemeSettings;
  layout?: LayoutSettings;
  seo?: SeoSettings;
  schema?: SchemaSettings;
  audio?: AudioSettings;
  resumeUrl?: string;
  resumeTitle?: string;
  aiBot?: AISettings;
  createdAt: string;
  updatedAt: string;
}


export interface SocialLinks {
  linkedin?: string;
  github?: string;
  behance?: string;
  whatsapp?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
}

export interface Skill {
  name: string;
  percentage: number;
  icon?: string;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
}

export interface Certificate {
  name: string;
  issuer: string;
  year: string;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  image?: string;
  rating?: string;
  stars: number;
  links: ProjectLink[];
  githubData?: any;
  importedFrom?: string;
  githubId?: string;
}

export interface ProjectLink {
  option: string;
  value: string;
}


export interface ProfileStats {
  posts: number;
  followers: number;
  following: number;
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  borderRadius: string;
}

export interface LayoutSettings {
  type: 'grid' | 'list' | 'masonry';
  columns: number;
  showProjectImages: boolean;
}

export interface SeoSettings {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  nofollow?: boolean;
  twitterCard?: string;
  twitterSite?: string;
}

export interface SchemaSettings {
  type: string;
  name?: string;
  description?: string;
  image?: string;
  jobTitle?: string;
  worksFor?: string;
  alumniOf?: string[];
  knowsAbout?: string[];
  sameAs?: string[];
}

export interface AudioSettings {
  url?: string;
  title?: string;
  delay?: number;
  loop?: boolean;
  volume?: number;
}

export interface AISettings {
  enabled: boolean;
  provider: 'XCV' | 'custom';
  customApiKey?: string;
  customModel?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export type ProfileUpdateData = Partial<ProfileData>;