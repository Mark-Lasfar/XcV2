import React, { createContext, useState, useEffect, useCallback } from 'react';

// ✅ تعريف الثيمات المتاحة
export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

interface ThemeContextType {
  theme: 'light' | 'dark';
  currentTheme: Theme;
  themes: Theme[];
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setCurrentTheme: (theme: Theme) => void;
  applyTheme: (theme: Theme) => void;
}

// ✅ الثيمات المدمجة
export const AVAILABLE_THEMES: Theme[] = [
  { 
    id: 'light', 
    name: 'Light', 
    colors: { primary: '#3b82f6', secondary: '#8b5cf6' } 
  },
  { 
    id: 'dark', 
    name: 'Dark', 
    colors: { primary: '#1f2937', secondary: '#4b5563' } 
  },
  { 
    id: 'purple', 
    name: 'Purple', 
    colors: { primary: '#7c3aed', secondary: '#a855f7' } 
  },
  { 
    id: 'blue', 
    name: 'Blue', 
    colors: { primary: '#2563eb', secondary: '#3b82f6' } 
  },
  { 
    id: 'green', 
    name: 'Green', 
    colors: { primary: '#059669', secondary: '#10b981' } 
  },
  { 
    id: 'red', 
    name: 'Red', 
    colors: { primary: '#dc2626', secondary: '#ef4444' } 
  },
  { 
    id: 'orange', 
    name: 'Orange', 
    colors: { primary: '#ea580c', secondary: '#f97316' } 
  },
  { 
    id: 'pink', 
    name: 'Pink', 
    colors: { primary: '#db2777', secondary: '#ec4899' } 
  },
];

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ✅ الثيم الأساسي (فاتح/داكن)
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  // ✅ الثيم الحالي (الألوان)
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('currentThemeId');
    if (savedTheme) {
      const found = AVAILABLE_THEMES.find(t => t.id === savedTheme);
      if (found) return found;
    }
    return AVAILABLE_THEMES[0]; // Light افتراضياً
  });

  // ✅ تطبيق الثيم على المتغيرات
  const applyTheme = useCallback((themeObj: Theme) => {
    setCurrentTheme(themeObj);
    localStorage.setItem('currentThemeId', themeObj.id);
    
    // تطبيق الألوان على CSS variables
    document.documentElement.style.setProperty('--profile-primary', themeObj.colors.primary);
    document.documentElement.style.setProperty('--profile-secondary', themeObj.colors.secondary);
    
    // تطبيق الثيم الأساسي (فاتح/داكن)
    if (themeObj.id === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  // ✅ تبديل الثيم (فاتح/داكن)
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  // ✅ تغيير الثيم الأساسي (فاتح/داكن) مع الحفاظ على الألوان
  const setThemeMode = useCallback((mode: 'light' | 'dark') => {
    setTheme(mode);
    localStorage.setItem('theme', mode);
    
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, []);

  // ✅ تحميل الثيم المحفوظ عند بدء التشغيل
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      }
    }

    const savedThemeId = localStorage.getItem('currentThemeId');
    if (savedThemeId) {
      const found = AVAILABLE_THEMES.find(t => t.id === savedThemeId);
      if (found) {
        setCurrentTheme(found);
        document.documentElement.style.setProperty('--profile-primary', found.colors.primary);
        document.documentElement.style.setProperty('--profile-secondary', found.colors.secondary);
      }
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        currentTheme,
        themes: AVAILABLE_THEMES,
        toggleTheme,
        setTheme: setThemeMode,
        setCurrentTheme,
        applyTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};