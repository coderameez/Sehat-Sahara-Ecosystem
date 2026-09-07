import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export function Card({ children, className, hover = false, padding = 'md', onClick }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-card border border-surface-border shadow-card',
        paddingStyles[padding],
        hover && 'transition-shadow duration-200 hover:shadow-card-hover',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// ───────────── Stat/KPI Card ─────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  iconBg = 'bg-brand-50',
  iconColor = 'text-brand-600',
  trend,
  className,
}: StatCardProps) {
  return (
    <Card hover className={cn('flex items-start gap-4', className)}>
      <div
        className={cn(
          'flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl',
          iconBg,
          iconColor
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-txt-secondary font-medium truncate">{label}</p>
        <p className="text-2xl font-bold text-txt-primary mt-0.5 tracking-tight">{value}</p>
        {trend && (
          <p
            className={cn(
              'text-xs font-medium mt-1',
              trend.positive ? 'text-emerald-600' : 'text-rose-600'
            )}
          >
            {trend.positive ? '↑' : '↓'} {trend.value}
          </p>
        )}
      </div>
    </Card>
  );
}
