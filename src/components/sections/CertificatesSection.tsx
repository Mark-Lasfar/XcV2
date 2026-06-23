import React, { useState } from 'react';
import { Certificate } from '../../types/profile';
import { Plus, Edit2, Trash2, Check, X, Award } from 'lucide-react';

interface CertificatesSectionProps {
  certificates: Certificate[] | any; // ✅ قبول Array أو Object
  isOwner: boolean;
  editMode: boolean;
  onUpdate: (certificates: Certificate[]) => void;
  title?: string;
  onTitleChange?: (title: string) => void;
}

// ✅ دالة مساعدة لتحويل Object إلى Array
const toArray = (data: any): Certificate[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'object') {
    return Object.values(data);
  }
  return [];
};

const CertificatesSection: React.FC<CertificatesSectionProps> = ({
  certificates: certificatesProp,
  isOwner,
  editMode,
  onUpdate,
  title = 'Licenses & Certificates',
  onTitleChange,
}) => {
  // ✅ تحويل البيانات إلى Array
  const certificates = toArray(certificatesProp);
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newCert, setNewCert] = useState<Certificate>({ name: '', issuer: '', year: '' });
  const [editingCert, setEditingCert] = useState<Certificate>({ name: '', issuer: '', year: '' });
  const [localTitle, setLocalTitle] = useState(title);

  const handleAdd = () => {
    if (newCert.name && newCert.issuer) {
      onUpdate([...certificates, newCert]);
      setNewCert({ name: '', issuer: '', year: '' });
      setIsAdding(false);
    }
  };

  const handleDelete = (index: number) => {
    if (confirm('Delete this certificate?')) {
      onUpdate(certificates.filter((_, i) => i !== index));
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditingCert({ ...certificates[index] });
  };

  const handleSaveEdit = (index: number) => {
    const updated = [...certificates];
    updated[index] = editingCert;
    onUpdate(updated);
    setEditingIndex(null);
  };

  const handleTitleSave = () => {
    if (onTitleChange) onTitleChange(localTitle);
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= 1970; y--) {
      years.push(y);
    }
    return years;
  };

  const hasCertificates = certificates.length > 0;

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        {editMode ? (
          <div className="flex items-center gap-2 flex-1">
            <Award className="w-5 h-5 text-yellow-500" />
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
          <span className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            {localTitle}
          </span>
        )}
        {isOwner && editMode && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-blue-500 hover:text-blue-600 transition"
            aria-label="Add certificate"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="card-content">
        {!hasCertificates ? (
          <p className="text-gray-500 text-sm">
            {isOwner ? 'Click + to add your certificates' : 'No certificates added'}
          </p>
        ) : (
          <div className="space-y-3">
            {certificates.map((cert, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg group transition hover:bg-gray-100 dark:hover:bg-gray-600/50">
                {editingIndex === index ? (
                  <div className="space-y-3 w-full">
                    <input
                      type="text"
                      value={editingCert.name}
                      onChange={(e) => setEditingCert({ ...editingCert, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Certificate name"
                      autoFocus
                    />
                    <input
                      type="text"
                      value={editingCert.issuer}
                      onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Issuing organization"
                    />
                    <select
                      value={editingCert.year}
                      onChange={(e) => setEditingCert({ ...editingCert, year: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="">Select year</option>
                      {getYearOptions().map((y) => (
                        <option key={y} value={y.toString()}>{y}</option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(index)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {cert.name}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">
                        {cert.issuer}
                      </div>
                      <div className="text-xs text-gray-500">{cert.year}</div>
                    </div>
                    {isOwner && editMode && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => handleEdit(index)}
                          className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                          aria-label="Edit certificate"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                          aria-label="Delete certificate"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
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
                value={newCert.name}
                onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                placeholder="Certificate name"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <input
                type="text"
                value={newCert.issuer}
                onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                placeholder="Issuing organization"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <select
                value={newCert.year}
                onChange={(e) => setNewCert({ ...newCert, year: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Select year</option>
                {getYearOptions().map((y) => (
                  <option key={y} value={y.toString()}>{y}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Add Certificate
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

export default CertificatesSection;