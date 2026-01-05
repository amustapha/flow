import { ForwardRefExoticComponent, SVGProps, RefAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface IconProps extends SVGProps<SVGSVGElement> {
  icon: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, 'ref'> & {
      title?: string;
      titleId?: string;
    } & RefAttributes<SVGSVGElement>
  >;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export function Icon({ icon: IconComponent, size = 'md', className, ...props }: IconProps) {
  return (
    <IconComponent
      className={cn(sizeMap[size], className)}
      aria-hidden="true"
      {...props}
    />
  );
}
