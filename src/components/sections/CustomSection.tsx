import React, { useState } from 'react';
import { Section } from '../../types/section';
import { Edit2, Trash2, Check, X } from 'lucide-react';

interface CustomSectionProps {
  section: Section;
  isOwner: boolean;
  editMode: boolean;
  onUpdate: (data: Partial<Section>) => void;
  onDelete: () => void;
}

// ✅ أنواع الأقسام المدعومة في القسم المخصص
type CustomSectionType = 'text' | 'skills' | 'links' | 'gallery' | 'stats' | 'timeline' | 'testimonials' | 'cta';

const CustomSection: React.FC<CustomSectionProps> = ({
  section,
  isOwner,
  editMode,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localName, setLocalName] = useState(section.name);
  const [localContent, setLocalContent] = useState(JSON.stringify(section.content, null, 2));

  const handleSave = () => {
    try {
      const content = JSON.parse(localContent);
      onUpdate({ name: localName, content });
      setIsEditing(false);
    } catch (error) {
      alert('Invalid JSON format. Please check your content.');
    }
  };

  const renderContent = () => {
    const content = section.content;
    const type = section.type as CustomSectionType;

    switch (type) {
      case 'text':
        return <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{content?.text}</p>;

      case 'skills':
        return (
          <div className="flex flex-wrap gap-2">
            {content?.skills?.map((skill: any, i: number) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                {skill.icon && <i className={`bx ${skill.icon} text-blue-500`} />}
                <span>{skill.name}</span>
                <span className="text-xs text-gray-500">{skill.percentage}%</span>
              </div>
            ))}
          </div>
        );

      case 'links':
        return (
          <div className="space-y-2">
            {content?.links?.map((link: any, i: number) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-500 hover:text-blue-600 hover:underline"
              >
                <i className="bx bx-link-alt" />
                {link.title || link.url}
              </a>
            ))}
          </div>
        );

      case 'gallery':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {content?.images?.map((img: any, i: number) => (
              <div key={i} className="relative group">
                <img
                  src={img.url}
                  alt={img.caption || ''}
                  className="w-full h-32 object-cover rounded-lg hover:scale-105 transition duration-300"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
                {img.caption && (
                  <p className="absolute bottom-0 left-0 right-0 p-1 text-xs text-white bg-black/50 rounded-b-lg">
                    {img.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        );

      case 'stats':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {content?.items?.map((item: any, i: number) => (
              <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                {item.icon && <i className={`bx ${item.icon} text-2xl mb-1 block text-blue-500`} />}
                <div className="text-2xl font-bold">{item.value}</div>
                <div className="text-xs text-gray-500">{item.label}</div>
              </div>
            ))}
          </div>
        );

      case 'timeline':
        return (
          <div className="relative border-l-2 border-blue-500 ml-3 pl-6 space-y-6">
            {content?.events?.map((event: any, i: number) => (
              <div key={i} className="relative">
                <div className="absolute -left-8 top-0 w-4 h-4 rounded-full bg-blue-500" />
                <div className="font-semibold">{event.title}</div>
                <div className="text-xs text-gray-500">{event.date}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{event.description}</div>
              </div>
            ))}
          </div>
        );

      case 'testimonials':
        return (
          <div className="space-y-4">
            {content?.testimonials?.map((ts: any, i: number) => (
              <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg italic">
                <p className="text-gray-600 dark:text-gray-300">"{ts.text}"</p>
                <div className="mt-2 text-right">
                  <span className="font-semibold">— {ts.author}</span>
                  {ts.role && <span className="text-xs text-gray-500">, {ts.role}</span>}
                </div>
              </div>
            ))}
          </div>
        );

      case 'cta':
        return (
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">{content?.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{content?.description}</p>
            <a
              href={content?.buttonUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              {content?.buttonText || 'Learn More'}
            </a>
          </div>
        );

      default:
        return <p className="text-gray-500">Unknown section type: {type}</p>;
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
            className="font-semibold bg-transparent border-b border-blue-500 outline-none"
            autoFocus
          />
        ) : (
          <span>{section.name}</span>
        )}
        <div className="flex items-center gap-2">
          {isOwner && editMode && (
            <>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-gray-400 hover:text-blue-500 transition"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="text-gray-400 hover:text-red-500 transition"
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
            <textarea
              value={localContent}
              onChange={(e) => setLocalContent(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border rounded-lg font-mono text-sm dark:bg-gray-700"
              placeholder="Enter content as JSON..."
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={() => {
                  setLocalName(section.name);
                  setLocalContent(JSON.stringify(section.content, null, 2));
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Tip: Use valid JSON format. Available fields depend on section type.
            </p>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default CustomSection;