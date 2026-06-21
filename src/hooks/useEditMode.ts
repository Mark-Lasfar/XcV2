import { useState, useEffect, useCallback } from 'react';
import { Section } from '../types/section';
import { profileService } from '../services/profileService';

interface EditModeState {
  editMode: boolean;
  sections: Section[];
  sectionOrder: { id: string; column: string; order: number }[];
  history: { sections: Section[]; order: any[] }[];
  historyIndex: number;
}

// ✅ تعريف الأقسام الافتراضية
const DEFAULT_SECTIONS: Section[] = [
  // About Section
  {
    id: 'about-section',
    type: 'about',
    name: 'About',
    column: 'main',
    order: 0,
    visible: true,
    content: { text: '' },
  },
  // Experience Section
  {
    id: 'experience-section',
    type: 'experience',
    name: 'Experience',
    column: 'main',
    order: 1,
    visible: true,
    content: { items: [] },
  },
  // Education Section
  {
    id: 'education-section',
    type: 'education',
    name: 'Education',
    column: 'main',
    order: 2,
    visible: true,
    content: { items: [] },
  },
  // Certificates Section
  {
    id: 'certificates-section',
    type: 'certificates',
    name: 'Licenses & Certificates',
    column: 'main',
    order: 3,
    visible: true,
    content: { items: [] },
  },
  // Skills Section
  {
    id: 'skills-section',
    type: 'skills',
    name: 'Skills & Expertise',
    column: 'left',
    order: 0,
    visible: true,
    content: { items: [] },
  },
  // Projects Section
  {
    id: 'projects-section',
    type: 'projects',
    name: 'Projects',
    column: 'main',
    order: 4,
    visible: true,
    content: { items: [] },
  },
  // Interests Section
  {
    id: 'interests-section',
    type: 'interests',
    name: 'Interests',
    column: 'left',
    order: 1,
    visible: true,
    content: { items: [] },
  },
  // Contact Info Section
  {
    id: 'contact-info-section',
    type: 'about',
    name: 'Contact Info',
    column: 'left',
    order: 2,
    visible: true,
    content: { text: '' },
  },
  // Social Links Section
  {
    id: 'social-links-section',
    type: 'about',
    name: 'Social Links',
    column: 'left',
    order: 3,
    visible: true,
    content: { text: '' },
  },
  // Activity Feed Section
  {
    id: 'activity-section',
    type: 'about',
    name: 'Activity',
    column: 'main',
    order: 5,
    visible: true,
    content: { text: '' },
  },
  // Contribution Graph Section
  {
    id: 'contribution-graph-section',
    type: 'about',
    name: 'Contributions',
    column: 'right',
    order: 0,
    visible: true,
    content: { text: '' },
  },
  // People Suggestions Section
  {
    id: 'people-suggestions-section',
    type: 'about',
    name: 'People You May Know',
    column: 'right',
    order: 1,
    visible: true,
    content: { text: '' },
  },
  // Pages Suggestions Section
  {
    id: 'pages-suggestions-section',
    type: 'about',
    name: 'You Might Like',
    column: 'right',
    order: 2,
    visible: true,
    content: { text: '' },
  },
];

// ✅ الترتيب الافتراضي للأقسام حسب الأعمدة
const DEFAULT_ORDER = [
  // Left column
  { id: 'skills-section', column: 'left', order: 0 },
  { id: 'interests-section', column: 'left', order: 1 },
  { id: 'contact-info-section', column: 'left', order: 2 },
  { id: 'social-links-section', column: 'left', order: 3 },
  // Main column
  { id: 'about-section', column: 'main', order: 0 },
  { id: 'experience-section', column: 'main', order: 1 },
  { id: 'education-section', column: 'main', order: 2 },
  { id: 'certificates-section', column: 'main', order: 3 },
  { id: 'projects-section', column: 'main', order: 4 },
  { id: 'activity-section', column: 'main', order: 5 },
  // Right column
  { id: 'contribution-graph-section', column: 'right', order: 0 },
  { id: 'people-suggestions-section', column: 'right', order: 1 },
  { id: 'pages-suggestions-section', column: 'right', order: 2 },
];

export const useEditMode = () => {
  const [state, setState] = useState<EditModeState>({
    editMode: false,
    sections: DEFAULT_SECTIONS,
    sectionOrder: DEFAULT_ORDER,
    history: [],
    historyIndex: -1,
  });

  const toggleEditMode = useCallback(() => {
    setState(prev => {
      const newEditMode = !prev.editMode;
      if (newEditMode) {
        // Save current state to history
        const newHistory = [
          ...prev.history.slice(0, prev.historyIndex + 1),
          { sections: prev.sections, order: prev.sectionOrder },
        ];
        return {
          ...prev,
          editMode: newEditMode,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      }
      return { ...prev, editMode: newEditMode };
    });
  }, []);

  const setSections = useCallback((sections: Section[]) => {
    setState(prev => {
      // Save to history if in edit mode
      if (prev.editMode) {
        const newHistory = [
          ...prev.history.slice(0, prev.historyIndex + 1),
          { sections, order: prev.sectionOrder },
        ];
        return {
          ...prev,
          sections,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      }
      return { ...prev, sections };
    });
  }, []);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex > 0) {
        const newIndex = prev.historyIndex - 1;
        const historyItem = prev.history[newIndex];
        return {
          ...prev,
          sections: historyItem.sections,
          sectionOrder: historyItem.order,
          historyIndex: newIndex,
        };
      }
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex < prev.history.length - 1) {
        const newIndex = prev.historyIndex + 1;
        const historyItem = prev.history[newIndex];
        return {
          ...prev,
          sections: historyItem.sections,
          sectionOrder: historyItem.order,
          historyIndex: newIndex,
        };
      }
      return prev;
    });
  }, []);

  const saveLayout = useCallback(async () => {
    try {
      await profileService.updateSectionOrder(state.sectionOrder);
      await profileService.updateSections(state.sections);
      return true;
    } catch (error) {
      console.error('Failed to save layout:', error);
      return false;
    }
  }, [state.sections, state.sectionOrder]);

  const resetLayout = useCallback(async () => {
    try {
      // Reset to default layout
      await profileService.updateSections(DEFAULT_SECTIONS);
      await profileService.updateSectionOrder(DEFAULT_ORDER);
      setSections(DEFAULT_SECTIONS);
      setState(prev => ({
        ...prev,
        sectionOrder: DEFAULT_ORDER,
      }));
      return true;
    } catch (error) {
      console.error('Failed to reset layout:', error);
      return false;
    }
  }, [setSections]);

  const addSection = useCallback((section: Section) => {
    setState(prev => {
      const newSections = [...prev.sections, section];
      const newOrder = [
        ...prev.sectionOrder,
        { id: section.id, column: section.column, order: prev.sectionOrder.length },
      ];
      
      // Save to history
      const newHistory = [
        ...prev.history.slice(0, prev.historyIndex + 1),
        { sections: newSections, order: newOrder },
      ];
      
      return {
        ...prev,
        sections: newSections,
        sectionOrder: newOrder,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  const removeSection = useCallback((sectionId: string) => {
    setState(prev => {
      const newSections = prev.sections.filter(s => s.id !== sectionId);
      const newOrder = prev.sectionOrder.filter(o => o.id !== sectionId);
      
      // Save to history
      const newHistory = [
        ...prev.history.slice(0, prev.historyIndex + 1),
        { sections: newSections, order: newOrder },
      ];
      
      return {
        ...prev,
        sections: newSections,
        sectionOrder: newOrder,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  const updateSection = useCallback((sectionId: string, updates: Partial<Section>) => {
    setState(prev => {
      const newSections = prev.sections.map(s =>
        s.id === sectionId ? { ...s, ...updates } : s
      );
      
      // Save to history
      const newHistory = [
        ...prev.history.slice(0, prev.historyIndex + 1),
        { sections: newSections, order: prev.sectionOrder },
      ];
      
      return {
        ...prev,
        sections: newSections,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  const moveSection = useCallback((sectionId: string, newColumn: 'left' | 'main' | 'right', newOrder: number) => {
    setState(prev => {
      // Find the section
      const section = prev.sections.find(s => s.id === sectionId);
      if (!section) return prev;

      // Update section column
      const updatedSection = { ...section, column: newColumn };
      const newSections = prev.sections.map(s =>
        s.id === sectionId ? updatedSection : s
      );

      // Update order
      const oldOrder = prev.sectionOrder.find(o => o.id === sectionId);
      if (!oldOrder) return prev;

      const newOrderList = prev.sectionOrder
        .filter(o => o.id !== sectionId)
        .map(o => ({ ...o }));
      
      // Insert at new position
      newOrderList.splice(newOrder, 0, { id: sectionId, column: newColumn, order: newOrder });

      // Renumber orders
      const renumberedOrder = newOrderList.map((o, index) => ({
        ...o,
        order: index,
      }));

      // Save to history
      const newHistory = [
        ...prev.history.slice(0, prev.historyIndex + 1),
        { sections: newSections, order: renumberedOrder },
      ];

      return {
        ...prev,
        sections: newSections,
        sectionOrder: renumberedOrder,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  return {
    editMode: state.editMode,
    sections: state.sections,
    sectionOrder: state.sectionOrder,
    canUndo: state.historyIndex > 0,
    canRedo: state.historyIndex < state.history.length - 1,
    toggleEditMode,
    setSections,
    setSectionOrder: (order: any[]) => setState(prev => ({ ...prev, sectionOrder: order })),
    undo,
    redo,
    saveLayout,
    resetLayout,
    addSection,
    removeSection,
    updateSection,
    moveSection,
  };
};