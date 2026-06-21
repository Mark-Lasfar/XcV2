import React, { useState } from 'react';
import { Link, Github, Linkedin, MessageCircle, Twitter, Instagram, Facebook, Globe, Plus, X } from 'lucide-react';
import { SocialLinks as SocialLinksType } from '../../types/profile';

interface SocialLinksProps {
  links: SocialLinksType;
  isOwner: boolean;
  editMode: boolean;
  onUpdate: (links: SocialLinksType) => void;
}

const SocialLinks: React.FC<SocialLinksProps> = ({
  links,
  isOwner,
  editMode,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localLinks, setLocalLinks] = useState<SocialLinksType>(links || {});

  const socialConfig = [
    { key: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: '#0077b5', placeholder: 'https://linkedin.com/in/username' },
    { key: 'github', icon: Github, label: 'GitHub', color: '#333', placeholder: 'https://github.com/username' },
    { key: 'behance', icon: Globe, label: 'Behance', color: '#1769ff', placeholder: 'https://behance.net/username' },
    { key: 'whatsapp', icon: MessageCircle, label: 'WhatsApp', color: '#25d366', placeholder: '+1234567890' },
    { key: 'twitter', icon: Twitter, label: 'Twitter', color: '#1da1f2', placeholder: 'https://twitter.com/username' },
    { key: 'instagram', icon: Instagram, label: 'Instagram', color: '#e4405f', placeholder: 'https://instagram.com/username' },
    { key: 'facebook', icon: Facebook, label: 'Facebook', color: '#1877f2', placeholder: 'https://facebook.com/username' },
    { key: 'website', icon: Globe, label: 'Website', color: '#6b7280', placeholder: 'https://yourwebsite.com' },
  ];

  const handleSave = () => {
    onUpdate(localLinks);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalLinks(links || {});
    setIsEditing(false);
  };

  const hasLinks = Object.values(links || {}).some((v) => v && v.trim() !== '');

  if (!hasLinks && !isOwner) {
    return null;
  }

  if (isEditing) {
    return (
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border">
        <div className="space-y-3">
          {socialConfig.map((config) => (
            <div key={config.key} className="flex items-center gap-3">
              <config.icon className="w-5 h-5 text-gray-400" style={{ color: config.color }} />
              <input
                type="text"
                value={localLinks[config.key as keyof SocialLinksType] || ''}
                onChange={(e) => {
                  setLocalLinks({
                    ...localLinks,
                    [config.key]: e.target.value,
                  });
                }}
                placeholder={config.placeholder}
                className="flex-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          ))}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
            >
              Save Links
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-3">
          {socialConfig.map((config) => {
            const url = links[config.key as keyof SocialLinksType];
            if (!url || url.trim() === '') return null;
            return (
              <a
                key={config.key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
                title={config.label}
              >
                <config.icon className="w-5 h-5" style={{ color: config.color }} />
              </a>
            );
          })}
        </div>
        {isOwner && editMode && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-blue-500 transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SocialLinks;