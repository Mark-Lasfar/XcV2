import React from 'react';
import { toast, Toaster as HotToaster } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export const Toaster: React.FC = () => {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--profile-card-bg)',
          color: 'var(--profile-text)',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
      }}
    />
  );
};

// ✅ إضافة دالة showToast مباشرة للتوافق مع الاستخدام القديم
export const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
  switch (type) {
    case 'success':
      toast.success(message, {
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      });
      break;
    case 'error':
      toast.error(message, {
        icon: <XCircle className="w-5 h-5 text-red-500" />,
      });
      break;
    case 'warning':
      toast(message, {
        icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
        style: {
          background: '#fef3c7',
          color: '#92400e',
        },
      });
      break;
    case 'info':
      toast(message, {
        icon: <Info className="w-5 h-5 text-blue-500" />,
        style: {
          background: '#eff6ff',
          color: '#1e40af',
        },
      });
      break;
    default:
      toast(message);
  }
};

// ✅ دالة toastSuccess للاستخدام البديل
export const toastSuccess = (message: string) => {
  toast.success(message, {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
  });
};

// ✅ دالة toastError للاستخدام البديل
export const toastError = (message: string) => {
  toast.error(message, {
    icon: <XCircle className="w-5 h-5 text-red-500" />,
  });
};

// ✅ دالة toastWarning للاستخدام البديل
export const toastWarning = (message: string) => {
  toast(message, {
    icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    style: {
      background: '#fef3c7',
      color: '#92400e',
    },
  });
};

// ✅ دالة toastInfo للاستخدام البديل
export const toastInfo = (message: string) => {
  toast(message, {
    icon: <Info className="w-5 h-5 text-blue-500" />,
    style: {
      background: '#eff6ff',
      color: '#1e40af',
    },
  });
};

// ✅ كائن showToast للاستخدام ككائن (مثل ما كان)
export const toastObj = {
  success: toastSuccess,
  error: toastError,
  warning: toastWarning,
  info: toastInfo,
};

// ✅ تصدير كل شيء للتوافق
export default {
  Toaster,
  showToast,
  toastSuccess,
  toastError,
  toastWarning,
  toastInfo,
  toastObj,
};