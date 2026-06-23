import React, { useEffect, useState } from 'react';
import { profileService } from '../../services/profileService';

// ✅ استخدم userId (ObjectId) وليس nickname
interface ContributionGraphProps {
  userId: string;  // ✅ ObjectId من البروفايل
  isOwner: boolean;
  year?: number;
}

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  activities?: any[];
}

interface ContributionWeek {
  days: ContributionDay[];
}

interface ContributionData {
  weeks: ContributionWeek[];
  total: number;
  weekDays: string[];
  months: string[];
}

const ContributionGraph: React.FC<ContributionGraphProps> = ({
  userId,
  isOwner,
  year = new Date().getFullYear(),
}) => {
  const [data, setData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(year);

  useEffect(() => {
    loadContributions();
  }, [userId, selectedYear]);

  const loadContributions = async () => {
    setLoading(true);
    try {
      const result = await profileService.getContributions(userId, selectedYear);
      
      if (result && result.weeks) {
        setData(result);
      } else {
        setData(null);
      }
    } catch (error) {
      console.error('Error loading contributions:', error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: number) => {
    const colors = {
      0: 'bg-gray-200 dark:bg-gray-700',
      1: 'bg-green-200 dark:bg-green-900',
      2: 'bg-green-400 dark:bg-green-700',
      3: 'bg-green-600 dark:bg-green-500',
      4: 'bg-green-800 dark:bg-green-300',
    };
    return colors[level as keyof typeof colors] || colors[0];
  };

  const getTooltip = (day: ContributionDay) => {
    let tooltip = `${day.date}: ${day.count} contributions`;
    if (day.activities && day.activities.length > 0) {
      tooltip += `\n${day.activities.length} activities`;
    }
    return tooltip;
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">Contribution Graph</div>
        <div className="card-content">
          <div className="flex items-center justify-center py-8">
            <div className="loader-spinner" />
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.weeks || data.weeks.length === 0) {
    return (
      <div className="card">
        <div className="card-header">Contribution Graph</div>
        <div className="card-content">
          <p className="text-gray-500 text-center py-4">No contribution data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        <span>Contribution Graph</span>
        <div className="flex items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-2 py-1 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          >
            {[2026, 2025, 2024, 2023, 2022].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          {isOwner && (
            <span className="text-xs text-gray-500">Your contributions</span>
          )}
        </div>
      </div>

      <div className="card-content">
        <div className="contribution-graph-container">
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm font-medium dark:text-white">
              {data.total || 0} contributions in {selectedYear}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <span>Less</span>
              {[0, 1, 2, 3, 4].map((level) => (
                <span
                  key={level}
                  className={`inline-block w-3 h-3 rounded-sm ${getLevelColor(level)}`}
                />
              ))}
              <span>More</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="flex">
              <div
                className="flex flex-col justify-around text-xs text-gray-500 pr-2"
                style={{ height: '120px' }}
              >
                {data.weekDays && data.weekDays.map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>
              <div className="flex gap-1">
                {data.weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.days && week.days.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={`w-3 h-3 ${getLevelColor(day.level)} rounded-sm cursor-pointer hover:scale-110 hover:ring-1 hover:ring-blue-500 transition-all`}
                        title={getTooltip(day)}
                        onClick={() => {
                          if (day.activities && day.activities.length > 0) {
                            showActivitiesModal(day.date, day.activities);
                          }
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between text-xs text-gray-500 mt-2">
            {data.months && data.months.map((month) => (
              <div key={month}>{month}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for activities modal
const showActivitiesModal = (date: string, activities: any[]) => {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]';
  modal.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
      <div class="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <h3 class="text-lg font-semibold">Activities on ${date}</h3>
        <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
      </div>
      <div class="p-4 overflow-y-auto max-h-[60vh] space-y-2">
        ${activities.map((activity) => `
          <div class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition"
               onclick="window.location.href='${getActivityUrl(activity)}'; this.closest('.fixed').remove()">
            <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <i class="bx ${getActivityIcon(activity)} text-blue-600 dark:text-blue-400 text-xl"></i>
            </div>
            <div class="flex-1">
              <p class="font-medium text-sm">${getActivityText(activity)}</p>
              <p class="text-xs text-gray-500">${activity.type ? activity.type.replace('_', ' ') : 'Activity'}</p>
            </div>
            <i class="bx bx-chevron-right text-gray-400"></i>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  document.body.appendChild(modal);
};

const getActivityIcon = (activity: any) => {
  const icons: Record<string, string> = {
    post: 'bx-news',
    comment: 'bx-comment',
    like: 'bx-heart',
    share: 'bx-share',
    job_application: 'bx-briefcase',
  };
  return icons[activity.type] || 'bx-calendar';
};

const getActivityText = (activity: any) => {
  const texts: Record<string, string> = {
    post: 'Created a post',
    comment: 'Commented on a project',
    like: 'Liked a post',
    share: 'Shared a post',
    job_application: 'Applied for a job',
  };
  return texts[activity.type] || 'Activity';
};

const getActivityUrl = (activity: any) => {
  const urls: Record<string, string> = {
    post: `/post.html?id=${activity.id}`,
    comment: `/project.html?id=${activity.projectId}&comment=${activity.id}`,
    like: `/post.html?id=${activity.postId}`,
    share: `/post.html?id=${activity.postId}`,
    job_application: `/job-details.html?id=${activity.jobId}`,
  };
  return urls[activity.type] || '#';
};

export default ContributionGraph;