'use client';

import { ImgHTMLAttributes, useState, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const avatarVariants = cva(
  'inline-flex items-center justify-center rounded-full bg-gray-200 font-medium text-gray-600 overflow-hidden',
  {
    variants: {
      size: {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface AvatarProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'size'>,
    VariantProps<typeof avatarVariants> {
  name?: string;
  isLoading?: boolean;
}

const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, size, name, src, alt, isLoading, ...props }, ref) => {
    const [hasError, setHasError] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true);

    const getInitials = (name: string) => {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    };

    const showImage = src && !hasError && !isLoading;
    const showInitials = name && (!src || hasError || isLoading);

    return (
      <div className={cn(avatarVariants({ size, className }))}>
        {showImage && (
          <img
            ref={ref}
            src={src}
            alt={alt || name || 'Avatar'}
            className={cn(
              'h-full w-full object-cover',
              isImageLoading && 'opacity-0'
            )}
            onLoad={() => setIsImageLoading(false)}
            onError={() => {
              setHasError(true);
              setIsImageLoading(false);
            }}
            {...props}
          />
        )}
        {showInitials && <span>{getInitials(name)}</span>}
        {isLoading && (
          <div className="animate-pulse bg-gray-300 h-full w-full rounded-full" />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export { Avatar, avatarVariants };
