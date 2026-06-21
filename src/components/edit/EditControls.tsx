import React, { useState } from 'react';
import { 
  Plus, Save, Layout, Download, RefreshCw, X,
  Eye, EyeOff, Settings, Palette, Columns, Grid
} from 'lucide-react';
import { useEditMode } from '../../hooks/useEditMode';
import { useTheme } from '../../hooks/useTheme';
import { useProfile } from '../../hooks/useProfile';

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
  const { editMode, toggleEditMode, sectionOrder, sections } = useEditMode();
  const { theme, setTheme, themes } = useTheme();
  const { profile } = useProfile();
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showLayoutOptions, setShowLayoutOptions] = useState(false);

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
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 p-2 min-w-[200px]">
              <button
                onClick={onSaveLayout}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Layout
              </button>
              <button
                onClick={onResetLayout}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2 text-red-500"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Layout
              </button>
              <button
                onClick={onExport}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Profile
              </button>
              <div className="border-t dark:border-gray-700 my-1" />
              <button
                onClick={() => {
                  // Toggle sections visibility
                  const allVisible = sections.every(s => s.visible !== false);
                  sections.forEach(s => {
                    // Update visibility
                  });
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Toggle All Sections
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
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 p-3 min-w-[300px]">
              <div className="grid grid-cols-4 gap-2">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t)}
                    className={`p-2 rounded-lg border-2 transition ${
                      theme.id === t.id ? 'border-blue-500' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: t.colors.primary }}
                  >
                    <div className="w-full h-8 rounded" style={{ backgroundColor: t.colors.primary }} />
                    <div className="w-full h-2 mt-1 rounded" style={{ backgroundColor: t.colors.secondary }} />
                    <span className="text-xs text-center block mt-1 text-gray-700 dark:text-gray-300">
                      {t.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />

        {/* Preview Mode */}
        <button
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          title="Preview Mode"
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