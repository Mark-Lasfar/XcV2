export interface Section {
  id: string;
  _id?: string;
  type: 'about' | 'experience' | 'education' | 'certificates' | 'skills' | 'projects' | 'interests' | 'custom';
  name: string;
  column: 'left' | 'main' | 'right';
  order: number;
  visible: boolean;
  content: any;
  settings?: SectionStyleSettings;
}

export interface SectionStyleSettings {
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  textColor?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  padding?: 'sm' | 'md' | 'lg';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  animation?: 'none' | 'fade-up' | 'fade-down' | 'zoom-in';
  icon?: string;
  titleColor?: string;
  titleSeparator?: boolean;
  customClass?: string;
  customCss?: string;
}

export interface SectionVisibility {
  about?: boolean;
  experience?: boolean;
  education?: boolean;
  certificates?: boolean;
  skills?: boolean;
  projects?: boolean;
  interests?: boolean;
  contactInfo?: boolean;
  socialLinks?: boolean;
  stats?: boolean;
  activity?: boolean;
  contributionGraph?: boolean;
  alsoViewed?: boolean;
  suggestions?: boolean;
  pages?: boolean;
  analytics?: boolean;
  jobApplications?: boolean;
}

export const normalizeSection = (section: any): Section => {
  return {
    id: section.id || section._id || `section-${Date.now()}`,
    _id: section._id || section.id,
    type: section.type as Section['type'],
    name: section.name || 'Untitled Section',
    column: section.column || 'main',
    order: section.order || 0,
    visible: section.visible !== false,
    content: section.content || {},
    settings: section.settings || {},
  };
};

export const normalizeSections = (sections: any[]): Section[] => {
  return sections.map(normalizeSection);
};