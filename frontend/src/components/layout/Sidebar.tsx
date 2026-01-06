'use client';

import { Calendar, Button } from '@/components/ui';

export interface SidebarProps {
  onCreateReminder?: () => void;
}

export function Sidebar({ onCreateReminder }: SidebarProps) {

  return (
    <div className="flex h-full flex-col">
      {/* Logo/Brand - hidden on mobile */}
      <div className="mb-6 hidden lg:block">
        <h1 className="text-xl font-bold text-purple-600">Flow</h1>
        <p className="text-xs text-gray-500">Voice Reminders</p>
      </div>

      {/* Calendar */}
      <div className="mb-6">
        <Calendar />
      </div>

      {/* Create Reminder Button - at bottom */}
      <div className="mt-auto border-t border-gray-200 pt-4">
        <Button
          variant="primary"
          onClick={onCreateReminder}
          className="w-full"
        >
          + Create Reminder
        </Button>
      </div>
    </div>
  );
}
