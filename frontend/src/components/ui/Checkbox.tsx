import { InputHTMLAttributes, forwardRef, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  indeterminate?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, indeterminate, id, ...props }, ref) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const checkboxRef = (ref as any) || internalRef;
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-');

    useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = indeterminate ?? false;
      }
    }, [checkboxRef, indeterminate]);

    return (
      <div className="flex items-center">
        <input
          id={checkboxId}
          type="checkbox"
          ref={checkboxRef}
          className={cn(
            'h-4 w-4 rounded border-gray-300 text-purple-600',
            'focus:ring-2 focus:ring-purple-600 focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={checkboxId}
            className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
