// components/common/Skeleton.tsx
import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
  );
};

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="card">
      <div className="h-32 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="px-4 pb-4 -mt-12">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse border-4 border-white" />
        </div>
        <div className="text-center mt-3">
          <div className="h-6 w-32 mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-24 mx-auto mt-1 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-16 w-full mt-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export const SectionSkeleton: React.FC = () => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
      <div className="card-content space-y-2">
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    </div>
  );
};