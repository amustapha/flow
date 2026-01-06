import { Badge, BadgeProps } from './Badge';
import { ReminderStatus } from '@/types';

const STATUS_VARIANT_MAP: Record<ReminderStatus, BadgeProps['variant']> = {
  Scheduled: 'info',
  Completed: 'success',
  Failed: 'danger',
};

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: ReminderStatus;
}

export function StatusBadge({ status, ...props }: StatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANT_MAP[status]} {...props}>
      {status}
    </Badge>
  );
}
