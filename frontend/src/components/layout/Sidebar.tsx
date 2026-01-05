'use client';

import { Avatar, Calendar } from '@/components/ui';

export function Sidebar() {

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
