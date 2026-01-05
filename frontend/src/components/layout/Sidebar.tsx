'use client';

import { Calendar, Button } from '@/components/ui';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

export interface SidebarProps {
  onCreateReminder?: () => void;
  onOpenSettings?: () => void;
}

export function Sidebar({ onCreateReminder, onOpenSettings }: SidebarProps) {

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

      {/* Action Buttons - at bottom */}
      <div className="mt-auto space-y-3 border-t border-gray-200 pt-4">
        <Button
          variant="primary"
          onClick={onCreateReminder}
          className="w-full"
        >
          + Create Reminder
        </Button>
        <button
          onClick={onOpenSettings}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
        >
          <Cog6ToothIcon className="h-5 w-5" />
          Settings
        </button>
      </div>
    </div>
  );
}
