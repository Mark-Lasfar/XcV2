import React, { useState } from 'react';
import { Section } from '../../types/section';
import { Edit2, Trash2, Check, X, ChevronDown, ChevronUp } from 'lucide-react';

interface CustomSectionProps {
  section: Section;
  isOwner: boolean;
  editMode: boolean;
  onUpdate: (data: Partial<Section>) => void;
  onDelete: () => void;
}

// ✅ أنواع الأقسام المدعومة في القسم المخصص
type CustomSectionType = 'text' | 'skills' | 'links' | 'gallery' | 'stats' | 'timeline' | 'testimonials' | 'cta' | 'contact';

// ✅ دالة مساعدة لتحويل Object إلى Array
const toArray = <T,>(data: any): T[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'object') {
    return Object.values(data);
  }
  return [];
};

const CustomSection: React.FC<CustomSectionProps> = ({
  section,
  isOwner,
  editMode,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [localName, setLocalName] = useState(section.name);
  const [localContent, setLocalContent] = useState(JSON.stringify(section.content, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleSave = () => {
    try {
      const content = JSON.parse(localContent);
      setJsonError(null);
      onUpdate({ name: localName, content });
      setIsEditing(false);
    } catch (error: any) {
      setJsonError(error.message || 'Invalid JSON format');
    }
  };

  const renderContent = () => {
    const content = section.content;
    const type = section.type as CustomSectionType;

    // ✅ معالجة البيانات من Object إلى Array
    const items = content?.items ? toArray(content.items) : [];
    const skills = content?.skills ? toArray(content.skills) : [];
    const links = content?.links ? toArray(content.links) : [];
    const images = content?.images ? toArray(content.images) : [];
    const events = content?.events ? toArray(content.events) : [];
    const testimonials = content?.testimonials ? toArray(content.testimonials) : [];

    switch (type) {
      case 'text':
        return (
          <div className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {content?.text || 'No content provided'}
          </div>
        );

      case 'skills':
        if (skills.length === 0) {
          return <p className="text-gray-500 text-sm">No skills added</p>;
        }
        return (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: any, i: number) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                {skill.icon && <i className={`bx ${skill.icon} text-blue-500`} />}
                <span>{skill.name}</span>
                <span className="text-xs text-gray-500">{skill.percentage || 0}%</span>
              </div>
            ))}
          </div>
        );

      case 'links':
        if (links.length === 0) {
          return <p className="text-gray-500 text-sm">No links added</p>;
        }
        return (
          <div className="space-y-2">
            {links.map((link: any, i: number) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-500 hover:text-blue-600 hover:underline transition"
              >
                <i className="bx bx-link-alt" />
                {link.title || link.url}
              </a>
            ))}
          </div>
        );

      case 'gallery':
        if (images.length === 0) {
          return <p className="text-gray-500 text-sm">No images added</p>;
        }
        const displayImages = isContentExpanded ? images : images.slice(0, 6);
        return (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {displayImages.map((img: any, i: number) => (
                <div key={i} className="relative group overflow-hidden rounded-lg">
                  <img
                    src={img.url}
                    alt={img.caption || ''}
                    className="w-full h-32 object-cover hover:scale-105 transition duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  {img.caption && (
                    <p className="absolute bottom-0 left-0 right-0 p-1 text-xs text-white bg-black/50 backdrop-blur-sm">
                      {img.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
            {images.length > 6 && (
              <button
                onClick={() => setIsContentExpanded(!isContentExpanded)}
                className="mt-3 text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1 transition"
              >
                {isContentExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Show less ({images.length - 6} hidden)
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show more (+{images.length - 6})
                  </>
                )}
              </button>
            )}
          </div>
        );

      case 'stats':
        if (items.length === 0) {
          return <p className="text-gray-500 text-sm">No stats added</p>;
        }
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {items.map((item: any, i: number) => (
              <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition">
                {item.icon && <i className={`bx ${item.icon} text-2xl mb-1 block text-blue-500`} />}
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</div>
                <div className="text-xs text-gray-500">{item.label}</div>
              </div>
            ))}
          </div>
        );

      case 'timeline':
        if (events.length === 0) {
          return <p className="text-gray-500 text-sm">No timeline events</p>;
        }
        return (
          <div className="relative border-l-2 border-blue-500 ml-3 pl-6 space-y-6">
            {events.map((event: any, i: number) => (
              <div key={i} className="relative">
                <div className="absolute -left-8 top-0.5 w-4 h-4 rounded-full bg-blue-500 border-2 border-white dark:border-gray-800" />
                <div className="font-semibold text-gray-900 dark:text-white">{event.title}</div>
                <div className="text-xs text-gray-500">{event.date}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{event.description}</div>
              </div>
            ))}
          </div>
        );

      case 'testimonials':
        if (testimonials.length === 0) {
          return <p className="text-gray-500 text-sm">No testimonials</p>;
        }
        return (
          <div className="space-y-4">
            {testimonials.map((ts: any, i: number) => (
              <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg italic hover:bg-gray-100 dark:hover:bg-gray-600/50 transition">
                <p className="text-gray-600 dark:text-gray-300">"{ts.text}"</p>
                <div className="mt-2 text-right">
                  <span className="font-semibold text-gray-900 dark:text-white">— {ts.author}</span>
                  {ts.role && <span className="text-xs text-gray-500">, {ts.role}</span>}
                </div>
              </div>
            ))}
          </div>
        );

      case 'cta':
        return (
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {content?.title || 'Call to Action'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {content?.description || 'Learn more about this'}
            </p>
            <a
              href={content?.buttonUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-md hover:shadow-lg"
            >
              {content?.buttonText || 'Learn More'}
            </a>
          </div>
        );

      case 'contact':
        const contactItems = items.length > 0 ? items : [];
        return (
          <div className="space-y-2">
            {contactItems.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition">
                {item.icon && <i className={`bx ${item.icon} text-blue-500 text-xl`} />}
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="text-gray-500 text-sm">
            <p>Unknown section type: {type}</p>
            <p className="text-xs mt-1">Supported types: text, skills, links, gallery, stats, timeline, testimonials, cta, contact</p>
          </div>
        );
    }
  };

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        {editMode && isEditing ? (
          <input
            type="text"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            className="font-semibold bg-transparent border-b-2 border-blue-500 outline-none text-gray-900 dark:text-white"
            autoFocus
          />
        ) : (
          <span className="font-medium text-gray-900 dark:text-white">{section.name}</span>
        )}
        <div className="flex items-center gap-1">
          {isOwner && editMode && (
            <>
              <button
                onClick={() => {
                  setIsEditing(!isEditing);
                  if (!isEditing) {
                    setLocalContent(JSON.stringify(section.content, null, 2));
                  }
                  setJsonError(null);
                }}
                className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                aria-label="Edit custom section"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete "${section.name}" section?`)) {
                    onDelete();
                  }
                }}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                aria-label="Delete custom section"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="card-content">
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 font-medium">Section Name</label>
              <input
                type="text"
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Content (JSON)</label>
              <textarea
                value={localContent}
                onChange={(e) => {
                  setLocalContent(e.target.value);
                  setJsonError(null);
                }}
                rows={8}
                className={`w-full px-3 py-2 border rounded-lg font-mono text-sm dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  jsonError ? 'border-red-500 ring-2 ring-red-500' : ''
                }`}
                placeholder="Enter content as JSON..."
              />
              {jsonError && (
                <p className="text-xs text-red-500 mt-1">⚠️ {jsonError}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={() => {
                  setLocalName(section.name);
                  setLocalContent(JSON.stringify(section.content, null, 2));
                  setIsEditing(false);
                  setJsonError(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                💡 <span className="font-medium">Tip:</span> Use valid JSON format.
                <br />
                Available fields depend on section type:
                <br />
                • <span className="font-mono">text</span>: {'{ "text": "Your content here" }'}
                <br />
                • <span className="font-mono">skills</span>: {'{ "skills": [{"name": "React", "percentage": 90}] }'}
                <br />
                • <span className="font-mono">links</span>: {'{ "links": [{"title": "GitHub", "url": "https://..."}] }'}
                <br />
                • <span className="font-mono">gallery</span>: {'{ "images": [{"url": "https://...", "caption": "..."}] }'}
                <br />
                • <span className="font-mono">stats</span>: {'{ "items": [{"value": "10+", "label": "Projects", "icon": "bx-code"}] }'}
                <br />
                • <span className="font-mono">timeline</span>: {'{ "events": [{"title": "Event", "date": "2024", "description": "..."}] }'}
                <br />
                • <span className="font-mono">testimonials</span>: {'{ "testimonials": [{"text": "...", "author": "Name", "role": "..."}] }'}
                <br />
                • <span className="font-mono">cta</span>: {'{ "title": "...", "description": "...", "buttonText": "...", "buttonUrl": "..." }'}
                <br />
                • <span className="font-mono">contact</span>: {'{ "items": [{"label": "Email", "value": "email@example.com", "icon": "bx-envelope"}] }'}
              </p>
            </div>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default CustomSection;