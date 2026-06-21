import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Section } from '../../types/section';

interface SectionEditorProps {
  section: Section | null;
  isNew: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onDelete?: () => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({
  section,
  isNew,
  onClose,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('text');
  const [content, setContent] = useState<any>({});
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    if (section && !isNew) {
      setName(section.name || '');
      setType(section.type || 'text');
      setContent(section.content || {});
      setSettings(section.settings || {});
    } else {
      setName('');
      setType('text');
      setContent({});
      setSettings({});
    }
  }, [section, isNew]);

  const typeOptions = [
    { value: 'text', label: '📝 Text', description: 'Rich text content' },
    { value: 'skills', label: '⭐ Skills', description: 'List of skills with percentages' },
    { value: 'links', label: '🔗 Links', description: 'Collection of URLs' },
    { value: 'gallery', label: '🖼️ Gallery', description: 'Image gallery' },
    { value: 'stats', label: '📊 Stats', description: 'Number statistics' },
    { value: 'timeline', label: '📅 Timeline', description: 'Events in chronological order' },
    { value: 'testimonials', label: '💬 Testimonials', description: 'User testimonials' },
    { value: 'cta', label: '🎯 CTA', description: 'Call to action' },
  ];

  const renderContentEditor = () => {
    switch (type) {
      case 'text':
        return (
          <textarea
            value={content.text || ''}
            onChange={(e) => setContent({ ...content, text: e.target.value })}
            rows={6}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="Enter your content here..."
          />
        );

      case 'skills':
        return (
          <div className="space-y-2">
            {content.skills?.map((skill: any, index: number) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={skill.name || ''}
                  onChange={(e) => {
                    const newSkills = [...(content.skills || [])];
                    newSkills[index] = { ...newSkills[index], name: e.target.value };
                    setContent({ ...content, skills: newSkills });
                  }}
                  placeholder="Skill name"
                  className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                <input
                  type="number"
                  value={skill.percentage || 0}
                  onChange={(e) => {
                    const newSkills = [...(content.skills || [])];
                    newSkills[index] = { ...newSkills[index], percentage: parseInt(e.target.value) || 0 };
                    setContent({ ...content, skills: newSkills });
                  }}
                  placeholder="%"
                  className="w-20 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  min="0"
                  max="100"
                />
                <button
                  onClick={() => {
                    const newSkills = (content.skills || []).filter((_: any, i: number) => i !== index);
                    setContent({ ...content, skills: newSkills });
                  }}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newSkills = [...(content.skills || []), { name: '', percentage: 50 }];
                setContent({ ...content, skills: newSkills });
              }}
              className="text-blue-500 hover:text-blue-600 text-sm"
            >
              + Add Skill
            </button>
          </div>
        );

      case 'links':
        return (
          <div className="space-y-2">
            {content.links?.map((link: any, index: number) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={link.title || ''}
                  onChange={(e) => {
                    const newLinks = [...(content.links || [])];
                    newLinks[index] = { ...newLinks[index], title: e.target.value };
                    setContent({ ...content, links: newLinks });
                  }}
                  placeholder="Link title"
                  className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                <input
                  type="url"
                  value={link.url || ''}
                  onChange={(e) => {
                    const newLinks = [...(content.links || [])];
                    newLinks[index] = { ...newLinks[index], url: e.target.value };
                    setContent({ ...content, links: newLinks });
                  }}
                  placeholder="URL"
                  className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                <button
                  onClick={() => {
                    const newLinks = (content.links || []).filter((_: any, i: number) => i !== index);
                    setContent({ ...content, links: newLinks });
                  }}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newLinks = [...(content.links || []), { title: '', url: '' }];
                setContent({ ...content, links: newLinks });
              }}
              className="text-blue-500 hover:text-blue-600 text-sm"
            >
              + Add Link
            </button>
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-2">
            {content.images?.map((img: any, index: number) => (
              <div key={index} className="flex gap-2">
                <input
                  type="url"
                  value={img.url || ''}
                  onChange={(e) => {
                    const newImages = [...(content.images || [])];
                    newImages[index] = { ...newImages[index], url: e.target.value };
                    setContent({ ...content, images: newImages });
                  }}
                  placeholder="Image URL"
                  className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={img.caption || ''}
                  onChange={(e) => {
                    const newImages = [...(content.images || [])];
                    newImages[index] = { ...newImages[index], caption: e.target.value };
                    setContent({ ...content, images: newImages });
                  }}
                  placeholder="Caption"
                  className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                <button
                  onClick={() => {
                    const newImages = (content.images || []).filter((_: any, i: number) => i !== index);
                    setContent({ ...content, images: newImages });
                  }}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newImages = [...(content.images || []), { url: '', caption: '' }];
                setContent({ ...content, images: newImages });
              }}
              className="text-blue-500 hover:text-blue-600 text-sm"
            >
              + Add Image
            </button>
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-2">
            {content.items?.map((item: any, index: number) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item.label || ''}
                  onChange={(e) => {
                    const newItems = [...(content.items || [])];
                    newItems[index] = { ...newItems[index], label: e.target.value };
                    setContent({ ...content, items: newItems });
                  }}
                  placeholder="Label"
                  className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={item.value || ''}
                  onChange={(e) => {
                    const newItems = [...(content.items || [])];
                    newItems[index] = { ...newItems[index], value: e.target.value };
                    setContent({ ...content, items: newItems });
                  }}
                  placeholder="Value"
                  className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={item.icon || ''}
                  onChange={(e) => {
                    const newItems = [...(content.items || [])];
                    newItems[index] = { ...newItems[index], icon: e.target.value };
                    setContent({ ...content, items: newItems });
                  }}
                  placeholder="Icon (bx-*)"
                  className="w-32 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                <button
                  onClick={() => {
                    const newItems = (content.items || []).filter((_: any, i: number) => i !== index);
                    setContent({ ...content, items: newItems });
                  }}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newItems = [...(content.items || []), { label: '', value: '', icon: '' }];
                setContent({ ...content, items: newItems });
              }}
              className="text-blue-500 hover:text-blue-600 text-sm"
            >
              + Add Stat
            </button>
          </div>
        );

      case 'timeline':
        return (
          <div className="space-y-2">
            {content.events?.map((event: any, index: number) => (
              <div key={index} className="space-y-2 p-3 border rounded-lg">
                <input
                  type="text"
                  value={event.title || ''}
                  onChange={(e) => {
                    const newEvents = [...(content.events || [])];
                    newEvents[index] = { ...newEvents[index], title: e.target.value };
                    setContent({ ...content, events: newEvents });
                  }}
                  placeholder="Event title"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={event.date || ''}
                  onChange={(e) => {
                    const newEvents = [...(content.events || [])];
                    newEvents[index] = { ...newEvents[index], date: e.target.value };
                    setContent({ ...content, events: newEvents });
                  }}
                  placeholder="Date"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                <textarea
                  value={event.description || ''}
                  onChange={(e) => {
                    const newEvents = [...(content.events || [])];
                    newEvents[index] = { ...newEvents[index], description: e.target.value };
                    setContent({ ...content, events: newEvents });
                  }}
                  placeholder="Description"
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                <button
                  onClick={() => {
                    const newEvents = (content.events || []).filter((_: any, i: number) => i !== index);
                    setContent({ ...content, events: newEvents });
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                >
                  Remove Event
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newEvents = [...(content.events || []), { title: '', date: '', description: '' }];
                setContent({ ...content, events: newEvents });
              }}
              className="text-blue-500 hover:text-blue-600 text-sm"
            >
              + Add Event
            </button>
          </div>
        );

      case 'testimonials':
        return (
          <div className="space-y-2">
            {content.testimonials?.map((ts: any, index: number) => (
              <div key={index} className="space-y-2 p-3 border rounded-lg">
                <textarea
                  value={ts.text || ''}
                  onChange={(e) => {
                    const newTs = [...(content.testimonials || [])];
                    newTs[index] = { ...newTs[index], text: e.target.value };
                    setContent({ ...content, testimonials: newTs });
                  }}
                  placeholder="Testimonial text"
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={ts.author || ''}
                  onChange={(e) => {
                    const newTs = [...(content.testimonials || [])];
                    newTs[index] = { ...newTs[index], author: e.target.value };
                    setContent({ ...content, testimonials: newTs });
                  }}
                  placeholder="Author name"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={ts.role || ''}
                  onChange={(e) => {
                    const newTs = [...(content.testimonials || [])];
                    newTs[index] = { ...newTs[index], role: e.target.value };
                    setContent({ ...content, testimonials: newTs });
                  }}
                  placeholder="Role (optional)"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                <button
                  onClick={() => {
                    const newTs = (content.testimonials || []).filter((_: any, i: number) => i !== index);
                    setContent({ ...content, testimonials: newTs });
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                >
                  Remove Testimonial
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newTs = [...(content.testimonials || []), { text: '', author: '', role: '' }];
                setContent({ ...content, testimonials: newTs });
              }}
              className="text-blue-500 hover:text-blue-600 text-sm"
            >
              + Add Testimonial
            </button>
          </div>
        );

      case 'cta':
        return (
          <div className="space-y-3">
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => setContent({ ...content, title: e.target.value })}
              placeholder="Title"
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <textarea
              value={content.description || ''}
              onChange={(e) => setContent({ ...content, description: e.target.value })}
              placeholder="Description"
              rows={2}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              type="text"
              value={content.buttonText || ''}
              onChange={(e) => setContent({ ...content, buttonText: e.target.value })}
              placeholder="Button text"
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              type="url"
              value={content.buttonUrl || ''}
              onChange={(e) => setContent({ ...content, buttonUrl: e.target.value })}
              placeholder="Button URL"
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        );

      default:
        return <p className="text-gray-500">No editor available for this type</p>;
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isNew ? 'Add New Section' : 'Edit Section'}
      size="lg"
    >
      <div className="space-y-4">
        {/* Section Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Section Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter section name"
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Section Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Section Type</label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setContent({});
            }}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label} - {opt.description}
              </option>
            ))}
          </select>
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          {renderContentEditor()}
        </div>

        {/* Style Settings (Basic) */}
        <div className="border-t pt-4">
          <details className="text-sm">
            <summary className="cursor-pointer font-medium text-blue-500 hover:text-blue-600">
              ⚙️ Style Settings (Optional)
            </summary>
            <div className="mt-3 space-y-3">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs mb-1">Font Size</label>
                  <select
                    value={settings.fontSize || 'base'}
                    onChange={(e) => setSettings({ ...settings, fontSize: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="xs">Extra Small</option>
                    <option value="sm">Small</option>
                    <option value="base">Medium</option>
                    <option value="lg">Large</option>
                    <option value="xl">Extra Large</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs mb-1">Text Color</label>
                  <input
                    type="color"
                    value={settings.textColor || '#000000'}
                    onChange={(e) => setSettings({ ...settings, textColor: e.target.value })}
                    className="w-full h-10 rounded border cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs mb-1">Background Color</label>
                  <input
                    type="color"
                    value={settings.backgroundColor || '#ffffff'}
                    onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                    className="w-full h-10 rounded border cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs mb-1">Alignment</label>
                  <select
                    value={settings.textAlign || 'left'}
                    onChange={(e) => setSettings({ ...settings, textAlign: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs mb-1">Section Icon (BoxIcons)</label>
                <input
                  type="text"
                  value={settings.icon || ''}
                  onChange={(e) => setSettings({ ...settings, icon: e.target.value })}
                  placeholder="bx bx-star"
                  className="w-full px-3 py-1.5 border rounded-lg text-sm font-mono dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          </details>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={() => onSave({ name, type, content, settings })}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            {isNew ? 'Create Section' : 'Save Changes'}
          </button>
          {!isNew && onDelete && (
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Delete Section
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SectionEditor;