import React, { createContext, useState, useCallback } from 'react';
import { Section } from '../types/section';

interface EditModeContextType {
  editMode: boolean;
  toggleEditMode: () => void;
  setEditMode: (mode: boolean) => void;
  sections: Section[];
  setSections: (sections: Section[]) => void;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  saveLayout: () => Promise<boolean>;
  resetLayout: () => Promise<boolean>;
}

export const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export const EditModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [editMode, setEditMode] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [history, setHistory] = useState<{ sections: Section[] }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const toggleEditMode = useCallback(() => {
    setEditMode(prev => !prev);
  }, []);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const undo = useCallback(() => {
    if (canUndo) {
      setHistoryIndex(prev => prev - 1);
      setSections(history[historyIndex - 1].sections);
    }
  }, [canUndo, history, historyIndex]);

  const redo = useCallback(() => {
    if (canRedo) {
      setHistoryIndex(prev => prev + 1);
      setSections(history[historyIndex + 1].sections);
    }
  }, [canRedo, history, historyIndex]);

  const saveLayout = useCallback(async (): Promise<boolean> => {
    // Implement save logic
    return true;
  }, []);

  const resetLayout = useCallback(async (): Promise<boolean> => {
    // Implement reset logic
    return true;
  }, []);

  return (
    <EditModeContext.Provider
      value={{
        editMode,
        toggleEditMode,
        setEditMode,
        sections,
        setSections,
        canUndo,
        canRedo,
        undo,
        redo,
        saveLayout,
        resetLayout,
      }}
    >
      {children}
    </EditModeContext.Provider>
  );
};