'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'Scheduled', label: 'Scheduled' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Failed', label: 'Failed' },
] as const;

export function StatusFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get('status') || '';

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-gray-500">Status:</span>
      {STATUS_OPTIONS.map(({ value, label }) => (
        <button
          key={value || 'all'}
          onClick={() => handleStatusChange(value)}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium transition-colors',
            currentStatus === value
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
