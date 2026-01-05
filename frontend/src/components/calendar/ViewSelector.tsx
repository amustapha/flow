'use client';

import { cn } from '@/lib/utils';

export type CalendarView = 'day' | 'week';

export interface ViewSelectorProps {
  /**
   * Currently active view
   */
  activeView: CalendarView;
  /**
   * Callback when view changes
   */
  onViewChange: (view: CalendarView) => void;
}

export function ViewSelector({ activeView, onViewChange }: ViewSelectorProps) {
  const views: { value: CalendarView; label: string }[] = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
  ];

  return (
    <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
      {views.map((view) => (
        <button
          key={view.value}
          onClick={() => onViewChange(view.value)}
          className={cn(
            'px-4 py-2 text-sm font-medium transition-colors rounded-md',
            activeView === view.value
              ? 'bg-purple-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          )}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}
