import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, FileText, TrendingUp } from 'lucide-react';

interface ProfileStatsProps {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  viewsCount?: number;
  className?: string;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  postsCount,
  followersCount,
  followingCount,
  viewsCount = 0,
  className = '',
}) => {
  const navigate = useNavigate();

  const stats = [
    {
      label: 'Posts',
      value: postsCount,
      icon: FileText,
      onClick: () => navigate('/feed?filter=user'),
    },
    {
      label: 'Followers',
      value: followersCount,
      icon: Users,
      onClick: () => navigate('/network?tab=followers'),
    },
    {
      label: 'Following',
      value: followingCount,
      icon: UserPlus,
      onClick: () => navigate('/network?tab=following'),
    },
  ];

  return (
    <div className={`stats-row ${className}`}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="stat-item group"
          onClick={stat.onClick}
        >
          <div className="stat-number">{stat.value.toLocaleString()}</div>
          <div className="stat-label flex items-center justify-center gap-1">
            <stat.icon className="w-3 h-3" />
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;