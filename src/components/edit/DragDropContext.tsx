import React, { useState, useCallback } from 'react';
import { Section } from '../../types/section';

interface DragDropContextProps {
  children: React.ReactNode;
  sections: Section[];
  column: 'left' | 'main' | 'right';
  onReorder: (sections: Section[]) => void;
  editMode: boolean;
}

// ✅ تحديث DraggableProps لتشمل كل الخصائص
interface DraggableProps {
  id: string;
  index: number;
  disabled?: boolean;
  children: React.ReactNode;
  // ✅ هذه الخصائص ستُمرر من DragDropContext
  onDragStart?: (id: string, index: number) => void;
  onDrop?: (targetIndex: number) => void;
  isDragging?: boolean;
  draggedId?: string | null;
}

interface DroppableProps {
  children: React.ReactNode;
  className?: string;
}

// ✅ DragDropContext Provider
export const DragDropContext: React.FC<DragDropContextProps> = ({
  children,
  sections,
  column,
  onReorder,
  editMode,
}) => {
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    draggedId: string | null;
    sourceIndex: number | null;
  }>({
    isDragging: false,
    draggedId: null,
    sourceIndex: null,
  });

  const handleDragStart = useCallback((id: string, index: number) => {
    if (!editMode) return;
    setDragState({
      isDragging: true,
      draggedId: id,
      sourceIndex: index,
    });
  }, [editMode]);

  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedId: null,
      sourceIndex: null,
    });
  }, []);

  const handleDrop = useCallback((targetIndex: number) => {
    if (!editMode) return;
    const { draggedId, sourceIndex } = dragState;
    if (draggedId === null || sourceIndex === null || sourceIndex === targetIndex) {
      return;
    }

    const newSections = [...sections];
    const [removed] = newSections.splice(sourceIndex, 1);
    newSections.splice(targetIndex, 0, removed);

    // تحديث الترتيب
    const reordered = newSections.map((section, index) => ({
      ...section,
      order: index,
      column: column,
    }));

    onReorder(reordered);
    handleDragEnd();
  }, [dragState, sections, column, onReorder, handleDragEnd, editMode]);

  return (
    <div 
      className={`drag-drop-context ${editMode ? 'edit-mode-active' : ''}`}
      onDragEnd={handleDragEnd}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement<DraggableProps>(child) && child.type === Draggable) {
          // ✅ تمرير الخصائص بشكل صحيح
          return React.cloneElement(child, {
            onDragStart: handleDragStart,
            onDrop: handleDrop,
            isDragging: dragState.isDragging,
            draggedId: dragState.draggedId,
            disabled: !editMode,
          });
        }
        return child;
      })}
    </div>
  );
};

// ✅ Draggable Component - محدث
export const Draggable: React.FC<DraggableProps> = ({
  id,
  index,
  disabled = false,
  children,
  onDragStart,
  onDrop,
  isDragging = false,
  draggedId = null,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ id, index }));
    if (onDragStart) onDragStart(id, index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data.id !== id && onDrop) {
        onDrop(index);
      }
    } catch (error) {
      console.error('Drop error:', error);
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const isActive = isDragging && draggedId === id;

  return (
    <div
      draggable={!disabled}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`
        draggable-section transition-all duration-200
        ${disabled ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
        ${isActive ? 'opacity-50 scale-95' : ''}
        ${isHovering && !disabled ? 'ring-2 ring-blue-400 ring-opacity-50 rounded-lg' : ''}
        ${!disabled ? 'hover:shadow-md' : ''}
      `}
    >
      {!disabled && (
        <div className="drag-handle flex items-center justify-center p-1 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-8 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>
      )}
      {children}
    </div>
  );
};

// ✅ Droppable Component
export const Droppable: React.FC<DroppableProps> = ({
  children,
  className = '',
}) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
  };

  return (
    <div
      className={`
        droppable-area transition-all duration-200
        ${isOver ? 'ring-2 ring-blue-500 ring-opacity-50 bg-blue-50 dark:bg-blue-900/20 rounded-lg' : ''}
        ${className}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
};

// ✅ Hook للاستخدام السهل
export const useDragDrop = (sections: Section[], setSections: (sections: Section[]) => void) => {
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    draggedId: string | null;
    sourceIndex: number | null;
  }>({
    isDragging: false,
    draggedId: null,
    sourceIndex: null,
  });

  const handleDragStart = useCallback((id: string, index: number) => {
    setDragState({
      isDragging: true,
      draggedId: id,
      sourceIndex: index,
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedId: null,
      sourceIndex: null,
    });
  }, []);

  const handleDrop = useCallback((targetIndex: number, column: 'left' | 'main' | 'right') => {
    const { draggedId, sourceIndex } = dragState;
    if (draggedId === null || sourceIndex === null || sourceIndex === targetIndex) {
      return;
    }

    const newSections = [...sections];
    const [removed] = newSections.splice(sourceIndex, 1);
    const updatedRemoved = { ...removed, column };
    newSections.splice(targetIndex, 0, updatedRemoved);

    const reordered = newSections.map((section, index) => ({
      ...section,
      order: index,
    }));

    setSections(reordered);
    handleDragEnd();
  }, [dragState, sections, setSections, handleDragEnd]);

  return {
    isDragging: dragState.isDragging,
    draggedId: dragState.draggedId,
    sourceIndex: dragState.sourceIndex,
    handleDragStart,
    handleDragEnd,
    handleDrop,
  };
};

export default {
  DragDropContext,
  Draggable,
  Droppable,
  useDragDrop,
};