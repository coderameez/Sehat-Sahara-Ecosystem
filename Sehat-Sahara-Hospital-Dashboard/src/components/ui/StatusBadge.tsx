import { cn } from '../../lib/utils';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'info';

interface StatusBadgeProps {
  variant?: BadgeVariant;
  status?: string;
  children?: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger:  'bg-rose-50 text-rose-700 border-rose-200',
  neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  info:    'bg-blue-50 text-blue-700 border-blue-200',
};

const dotColors: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger:  'bg-rose-500',
  neutral: 'bg-slate-400',
  info:    'bg-blue-500',
};

// Internal helper for resolving generic statuses
function resolveBadgeVariant(status: string): BadgeVariant {
  switch (status?.toUpperCase()) {
    case 'CONFIRMED':
    case 'COMPLETED':
    case 'SIGNED':
      return 'success';
    case 'PENDING':
    case 'IN_PROGRESS':
    case 'WAITING':
    case 'DRAFT':
    case 'NOW SERVING':
      return 'warning';
    case 'CANCELLED':
    case 'REVOKED':
    case 'NO SHOW':
      return 'danger';
    default:
      return 'neutral';
  }
}

export function StatusBadge({ variant, status, children, className, dot }: StatusBadgeProps) {
  const displayVariant = variant || (status ? resolveBadgeVariant(status) : 'neutral');
  const displayText = children || status;
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold',
        variantStyles[displayVariant],
        className
      )}
    >
      {dot && (
        <span className={cn('h-1.5 w-1.5 rounded-full', dotColors[displayVariant])} />
      )}
      {displayText}
    </span>
  );
}

// Helper to map booking status to badge variant
export function getBookingBadgeVariant(
  status: string
): BadgeVariant {
  switch (status) {
    case 'CONFIRMED':
    case 'COMPLETED':
      return 'success';
    case 'PENDING':
    case 'IN_PROGRESS':
      return 'warning';
    case 'CANCELLED':
      return 'danger';
    default:
      return 'neutral';
  }
}
