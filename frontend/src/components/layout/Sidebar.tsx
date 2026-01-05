'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Checkbox, Avatar } from '@/components/ui';
import { cn } from '@/lib/utils';

function MiniCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const renderDays = () => {
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-6 w-6" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = today.getDate() === day &&
                      today.getMonth() === month &&
                      today.getFullYear() === year;

      days.push(
        <button
          key={day}
          className={cn(
            'h-6 w-6 text-xs flex items-center justify-center rounded-full transition-colors',
            isToday
              ? 'bg-purple-600 text-white font-semibold'
              : 'text-gray-700 hover:bg-gray-100'
          )}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          {monthNames[month]} {year}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={previousMonth}
            className="rounded p-1 hover:bg-gray-100"
            aria-label="Previous month"
          >
            <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={nextMonth}
            className="rounded p-1 hover:bg-gray-100"
            aria-label="Next month"
          >
            <ChevronRightIcon className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dayNames.map(day => (
          <div key={day} className="h-6 w-6 text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
        {renderDays()}
      </div>
    </div>
  );
}

interface CalendarItemProps {
  label: string;
  color: string;
  isChecked: boolean;
  onChange: (checked: boolean) => void;
}

function CalendarItem({ label, color, isChecked, onChange }: CalendarItemProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-gray-50">
      <Checkbox
        checked={isChecked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className={cn('h-2 w-2 rounded-full', color)} />
      <span className="flex-1 text-sm text-gray-700">{label}</span>
    </label>
  );
}

interface CategoryItemProps {
  label: string;
  count?: number;
}

function CategoryItem({ label, count }: CategoryItemProps) {
  return (
    <button className="flex w-full items-center justify-between rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
      <span>{label}</span>
      {count !== undefined && (
        <span className="text-xs text-gray-500">{count}</span>
      )}
    </button>
  );
}

export function Sidebar() {
  const [calendars, setCalendars] = useState({
    reminders: true,
    birthdays: true,
    holidays: false,
  });

  return (
    <div className="flex h-full flex-col">
      {/* Logo/Brand - hidden on mobile */}
      <div className="mb-6 hidden lg:block">
        <h1 className="text-xl font-bold text-purple-600">Flow</h1>
        <p className="text-xs text-gray-500">Voice Reminders</p>
      </div>

      {/* Mini Calendar */}
      <div className="mb-6">
        <MiniCalendar />
      </div>

      {/* My Calendars Section */}
      <div className="mb-6">
        <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          My Calendars
        </h3>
        <div className="space-y-0.5">
          <CalendarItem
            label="Reminders"
            color="bg-purple-500"
            isChecked={calendars.reminders}
            onChange={(checked) => setCalendars({ ...calendars, reminders: checked })}
          />
          <CalendarItem
            label="Birthdays"
            color="bg-green-500"
            isChecked={calendars.birthdays}
            onChange={(checked) => setCalendars({ ...calendars, birthdays: checked })}
          />
          <CalendarItem
            label="Holidays"
            color="bg-blue-500"
            isChecked={calendars.holidays}
            onChange={(checked) => setCalendars({ ...calendars, holidays: checked })}
          />
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-6">
        <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Categories
        </h3>
        <div className="space-y-0.5">
          <CategoryItem label="Personal" count={12} />
          <CategoryItem label="Business" count={8} />
          <CategoryItem label="Events" count={5} />
          <CategoryItem label="Meetings" count={3} />
        </div>
      </div>

      {/* User Avatars - at bottom */}
      <div className="mt-auto border-t border-gray-200 pt-4">
        <div className="flex items-center gap-2">
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=1"
            alt="User 1"
            size="sm"
          />
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=2"
            alt="User 2"
            size="sm"
          />
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=3"
            alt="User 3"
            size="sm"
          />
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=4"
            alt="User 4"
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
