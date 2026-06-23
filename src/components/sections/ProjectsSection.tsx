import React, { useState } from 'react';
import { Project } from '../../types/profile';
import { useEditMode } from '../../hooks/useEditMode';
import { Plus, Edit2, Trash2, Star, Grid, List, ExternalLink, Image } from 'lucide-react';

interface ProjectsSectionProps {
  projects: Project[] | any; // ✅ قبول Array أو Object
  isOwner: boolean;
  editMode: boolean;
  onUpdate: (projects: Project[]) => void;
  title?: string;
  onTitleChange?: (title: string) => void;
}

// ✅ دالة مساعدة لتحويل Object إلى Array
const toArray = (data: any): Project[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'object') {
    return Object.values(data).map((item: any) => ({
      ...item,
      id: item._id || item.id || `project-${Date.now()}`,
      links: item.links || [],
      stars: item.stars || 0,
    }));
  }
  return [];
};

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects: projectsProp,
  isOwner,
  editMode,
  onUpdate,
  title = 'Projects',
  onTitleChange,
}) => {
  // ✅ تحويل البيانات إلى Array
  const projects = toArray(projectsProp);
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    description: '',
    stars: 0,
    links: [],
  });
  const [editingProject, setEditingProject] = useState<Partial<Project>>({});
  const [localTitle, setLocalTitle] = useState(title);

  const handleAdd = () => {
    if (newProject.title) {
      const project: Project = {
        id: Date.now().toString(),
        title: newProject.title,
        description: newProject.description || '',
        stars: newProject.stars || 0,
        links: newProject.links || [],
        image: newProject.image || '',
      };
      onUpdate([...projects, project]);
      setNewProject({ title: '', description: '', stars: 0, links: [] });
      setIsAdding(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      onUpdate(projects.filter(p => p.id !== id));
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id || null);
    setEditingProject({ ...project });
  };

  const handleSaveEdit = () => {
    if (editingId && editingProject.title) {
      const updated = projects.map(p =>
        p.id === editingId ? { ...p, ...editingProject } : p
      );
      onUpdate(updated);
      setEditingId(null);
    }
  };

  const handleTitleSave = () => {
    if (onTitleChange) onTitleChange(localTitle);
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const hasProjects = projects.length > 0;

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        {editMode ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              type="text"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
              className="font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none"
            />
          </div>
        ) : (
          <span>{localTitle}</span>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1 rounded transition ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
            aria-label="Grid view"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1 rounded transition ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
          {isOwner && editMode && (
            <button
              onClick={() => setIsAdding(true)}
              className="text-blue-500 hover:text-blue-600 transition"
              aria-label="Add project"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="card-content">
        {!hasProjects ? (
          <p className="text-gray-500 text-sm">
            {isOwner ? 'Click + to add your projects' : 'No projects added'}
          </p>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}>
            {projects.map((project) => (
              <div
                key={project.id}
                className={`bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden transition hover:shadow-md ${
                  viewMode === 'list' ? 'flex gap-4 p-3' : ''
                }`}
              >
                {editingId === project.id ? (
                  <div className="p-4 space-y-3 w-full">
                    <input
                      type="text"
                      value={editingProject.title || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg font-semibold dark:bg-gray-600 dark:border-gray-500"
                      placeholder="Project title"
                      autoFocus
                    />
                    <textarea
                      value={editingProject.description || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                      placeholder="Description"
                    />
                    <input
                      type="text"
                      value={editingProject.image || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                      placeholder="Image URL"
                    />
                    <input
                      type="number"
                      value={editingProject.stars || 0}
                      onChange={(e) => setEditingProject({ ...editingProject, stars: parseInt(e.target.value) || 0 })}
                      className="w-24 px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                      min="0"
                      max="5"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {project.image && viewMode === 'grid' && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    <div className={`${viewMode === 'grid' ? 'p-3' : 'flex-1'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {project.title}
                          </h4>
                          {viewMode === 'list' && project.image && (
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-16 h-16 rounded-lg object-cover mt-1"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          )}
                        </div>
                        {isOwner && editMode && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEdit(project)}
                              className="p-1 text-blue-500 hover:text-blue-600 transition"
                              aria-label="Edit project"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(project.id!)}
                              className="p-1 text-red-500 hover:text-red-600 transition"
                              aria-label="Delete project"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center flex-wrap gap-2 mt-2">
                        <div className="flex">{renderStars(project.stars || 0)}</div>
                        {project.links?.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1 transition"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3 h-3" />
                            {link.option}
                          </a>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Form */}
        {isAdding && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            <div className="space-y-3">
              <input
                type="text"
                value={newProject.title || ''}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                placeholder="Project title"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <textarea
                value={newProject.description || ''}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Description"
              />
              <input
                type="text"
                value={newProject.image || ''}
                onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Image URL (optional)"
              />
              <input
                type="number"
                value={newProject.stars || 0}
                onChange={(e) => setNewProject({ ...newProject, stars: parseInt(e.target.value) || 0 })}
                className="w-24 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                min="0"
                max="5"
                placeholder="Stars"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Add Project
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsSection;