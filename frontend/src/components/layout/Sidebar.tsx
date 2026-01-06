"use client";

import { BellIcon } from "@heroicons/react/24/outline";
import { Calendar, Button } from "@/components/ui";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { RemindersListView } from "@/components/reminders-list";
import { Reminder } from "@/types";

export interface SidebarProps {
  onCreateReminder?: () => void;
  onOpenSettings?: () => void;
  onReminderClick?: (reminder: Reminder) => void;
}

export function Sidebar({ onCreateReminder, onOpenSettings, onReminderClick }: SidebarProps) {
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

      {/* Reminders List */}
      <div className="mb-6 flex-1 overflow-y-auto">
        <RemindersListView onReminderClick={onReminderClick} />
      </div>

      {/* Action Buttons - at bottom */}
      <div className="mt-auto space-y-3 border-t border-gray-200 pt-4 flex  gap-2">
        <Button variant="primary" onClick={onCreateReminder} className="w-full">
          <BellIcon className="h-5 w-5 mr-2" />
          Create Reminder
        </Button>
        <Button onClick={onOpenSettings} className="w-12" variant="ghost">
          <Cog6ToothIcon className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
