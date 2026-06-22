import React, { useState } from 'react';
import { 
  Plus, Save, Layout, Download, RefreshCw, X,
  Eye, EyeOff, Settings, Palette
} from 'lucide-react';
import { useEditMode } from '../../hooks/useEditMode';

interface EditControlsProps {
  onAddSection: () => void;
  onResetLayout: () => void;
  onSaveLayout: () => void;
  onExport: () => void;
}

const EditControls: React.FC<EditControlsProps> = ({
  onAddSection,
  onResetLayout,
  onSaveLayout,
  onExport,
}) => {
  const { editMode, toggleEditMode } = useEditMode();
  const [showLayoutOptions, setShowLayoutOptions] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // ✅ تعريف الثيمات المدمجة
  const themes = [
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
  ];
  
  const [currentTheme, setCurrentTheme] = useState(themes[0]);

  // ✅ تطبيق الثيم
  const applyTheme = (theme: typeof themes[0]) => {
    setCurrentTheme(theme);
    document.documentElement.style.setProperty('--profile-primary', theme.colors.primary);
    document.documentElement.style.setProperty('--profile-secondary', theme.colors.secondary);
  };

  // ✅ تبديل وضع المعاينة
  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
    document.body.classList.toggle('preview-mode');
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-full shadow-2xl border dark:border-gray-700 px-4 py-2 flex items-center gap-2">
        
        {/* Toggle Edit Mode */}
        <button
          onClick={toggleEditMode}
          className={`p-2 rounded-full transition ${
            editMode 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
          title={editMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
        >
          <Settings className="w-5 h-5" />
        </button>

        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />

        {/* Add Section */}
        <button
          onClick={onAddSection}
          className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
          title="Add Section"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Layout Options */}
        <div className="relative">
          <button
            onClick={() => setShowLayoutOptions(!showLayoutOptions)}
            className="p-2 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition"
            title="Layout Options"
          >
            <Layout className="w-5 h-5" />
          </button>
          
          {showLayoutOptions && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 p-2 min-w-[200px] z-50">
              <button
                onClick={() => { onSaveLayout(); setShowLayoutOptions(false); }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Layout
              </button>
              <button
                onClick={() => { onResetLayout(); setShowLayoutOptions(false); }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2 text-red-500"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Layout
              </button>
              <button
                onClick={() => { onExport(); setShowLayoutOptions(false); }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Profile
              </button>
            </div>
          )}
        </div>

        {/* Theme Selector */}
        <div className="relative">
          <button
            onClick={() => setShowThemeSelector(!showThemeSelector)}
            className="p-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition"
            title="Themes"
          >
            <Palette className="w-5 h-5" />
          </button>
          
          {showThemeSelector && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 p-3 min-w-[200px] z-50">
              <div className="space-y-1">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { applyTheme(t); setShowThemeSelector(false); }}
                    className={`w-full px-4 py-2 text-left rounded-lg transition flex items-center gap-3 ${
                      currentTheme.id === t.id 
                        ? 'bg-blue-500 text-white' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-gray-200 dark:border-gray-600"
                      style={{ backgroundColor: t.colors.primary }}
                    />
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />

        {/* Preview Mode */}
        <button
          onClick={togglePreviewMode}
          className={`p-2 rounded-full transition ${
            isPreviewMode
              ? 'bg-yellow-500 text-white hover:bg-yellow-600'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
          title={isPreviewMode ? 'Exit Preview Mode' : 'Preview Mode'}
        >
          <EyeOff className="w-5 h-5" />
        </button>

        {/* Close */}
        <button
          onClick={toggleEditMode}
          className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default EditControls;