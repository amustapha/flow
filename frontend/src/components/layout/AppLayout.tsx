'use client';

import { useState, ReactNode } from 'react';
import { CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

export function AppLayout({ children, sidebar }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:z-30',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile close button */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 lg:hidden">
          <span className="text-lg font-semibold text-gray-900">Menu</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeSidebar}
            aria-label="Close sidebar"
            className="h-12 w-12 p-0"
          >
            <XMarkIcon className="h-12 w-12" />
          </Button>
        </div>

        {/* Sidebar content */}
        <div className="h-full overflow-y-auto px-4 py-6 lg:py-8">
          {sidebar}
        </div>
      </aside>

      {/* Main content area */}
      <div className="lg:pl-80">
        {/* Top navigation bar for mobile */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            aria-label="Open sidebar"
            className="h-12 w-12 p-0"
          >
            <CalendarIcon className="h-12 w-12" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Flow</h1>
        </header>

        {/* Main content */}
        <main className="min-h-[calc(100vh-4rem)] p-4 lg:min-h-screen lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
