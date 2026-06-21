export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`;
  if (diff < 2419200000) return `${Math.floor(diff / 604800000)}w`;
  return d.toLocaleDateString();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const getAvatarUrl = (avatar?: string, name?: string): string => {
  if (avatar) return avatar;
  if (name) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&size=128`;
  return '/assets/img/default-avatar.png';
};

export const getCoverUrl = (cover?: string): string => {
  return cover || '/assets/img/default-cover.png';
};

export const getIconClass = (skillName: string): string => {
  const iconMap: Record<string, string> = {
    react: 'bxl-react',
    python: 'bxl-python',
    javascript: 'bxl-javascript',
    typescript: 'bxl-typescript',
    nodejs: 'bxl-nodejs',
    mongodb: 'bxl-mongodb',
    html: 'bxl-html5',
    css: 'bxl-css3',
    git: 'bxl-git',
    github: 'bxl-github',
    docker: 'bxl-docker',
    aws: 'bxl-aws',
    figma: 'bxl-figma',
    php: 'bxl-php',
    postgresql: 'bxl-postgresql',
  };
  
  const lowerName = skillName.toLowerCase();
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lowerName.includes(key)) return icon;
  }
  return 'bx-code-alt';
};