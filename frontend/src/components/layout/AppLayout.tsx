'use client';

import { useState, ReactNode } from 'react';
import { CalendarIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

export function AppLayout({ children, sidebar }: AppLayoutProps) {
  const [showSidebar, setShowSidebar] = useState(true);

  const toggleView = () => setShowSidebar(!showSidebar);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - always visible on desktop, toggle on mobile */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-full lg:w-96 bg-white shadow-lg lg:block',
          showSidebar ? 'block' : 'hidden'
        )}
      >
        {/* Sidebar content */}
        <div className="h-full overflow-y-auto px-4 py-6 lg:py-8">
          {sidebar}
        </div>
      </aside>

      {/* Main content area */}
      <div className="lg:pl-96">
        {/* Top navigation bar for mobile */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleView}
            aria-label="Toggle view"
            className="h-12 w-12 p-0"
          >
            {showSidebar ? (
              <Bars3Icon className="h-12 w-12" />
            ) : (
              <CalendarIcon className="h-12 w-12" />
            )}
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Flow</h1>
        </header>

        {/* Main content - hidden on mobile when sidebar is shown */}
        <main
          className={cn(
            'min-h-[calc(100vh-4rem)] lg:min-h-screen lg:block',
            showSidebar ? 'hidden' : 'block'
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
