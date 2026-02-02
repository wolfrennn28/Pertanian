import React from 'react';
import { cn } from '../../lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    size?: BadgeSize;
    dot?: boolean;
    pulse?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = 'default', size = 'md', dot = false, pulse = false, children, ...props }, ref) => {
        const variants: Record<BadgeVariant, string> = {
            default: 'bg-gray-100 text-gray-700 border-gray-200',
            success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            warning: 'bg-amber-50 text-amber-700 border-amber-200',
            error: 'bg-red-50 text-red-700 border-red-200',
            info: 'bg-sky-50 text-sky-700 border-sky-200',
            primary: 'bg-primary-50 text-primary-700 border-primary-200',
            secondary: 'bg-earth-100 text-earth-700 border-earth-200',
        };

        const dotColors: Record<BadgeVariant, string> = {
            default: 'bg-gray-500',
            success: 'bg-emerald-500',
            warning: 'bg-amber-500',
            error: 'bg-red-500',
            info: 'bg-sky-500',
            primary: 'bg-primary-500',
            secondary: 'bg-earth-500',
        };

        const sizes: Record<BadgeSize, string> = {
            sm: 'text-xs px-2 py-0.5',
            md: 'text-xs px-2.5 py-1',
            lg: 'text-sm px-3 py-1.5',
        };

        return (
            <span
                ref={ref}
                className={cn(
                    'inline-flex items-center gap-1.5 font-medium rounded-full border',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {dot && (
                    <span
                        className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            dotColors[variant],
                            pulse && 'animate-pulse'
                        )}
                    />
                )}
                {children}
            </span>
        );
    }
);

Badge.displayName = 'Badge';

// Pre-styled status badges
interface StatusBadgeProps {
    status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'active' | 'fallow' | 'harvesting' | 'preparation';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const statusConfig: Record<string, { variant: BadgeVariant; label: string; dot?: boolean; pulse?: boolean }> = {
        pending: { variant: 'warning', label: 'Menunggu', dot: true },
        in_progress: { variant: 'info', label: 'Dikerjakan', dot: true, pulse: true },
        completed: { variant: 'success', label: 'Selesai', dot: true },
        overdue: { variant: 'error', label: 'Terlambat', dot: true, pulse: true },
        active: { variant: 'success', label: 'Aktif', dot: true },
        fallow: { variant: 'default', label: 'Bera', dot: true },
        harvesting: { variant: 'primary', label: 'Panen', dot: true, pulse: true },
        preparation: { variant: 'info', label: 'Persiapan', dot: true },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
        <Badge variant={config.variant} dot={config.dot} pulse={config.pulse}>
            {config.label}
        </Badge>
    );
};

// Priority badge
interface PriorityBadgeProps {
    priority: 'low' | 'medium' | 'high' | 'urgent';
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
    const priorityConfig: Record<string, { variant: BadgeVariant; label: string }> = {
        low: { variant: 'default', label: 'Rendah' },
        medium: { variant: 'info', label: 'Sedang' },
        high: { variant: 'warning', label: 'Tinggi' },
        urgent: { variant: 'error', label: 'Mendesak' },
    };

    const config = priorityConfig[priority] || priorityConfig.medium;

    return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
};

// Task type badge
interface TaskTypeBadgeProps {
    type: 'planting' | 'watering' | 'harvesting' | 'monitoring' | 'fertilizing' | 'pest_control';
}

const TaskTypeBadge: React.FC<TaskTypeBadgeProps> = ({ type }) => {
    const typeConfig: Record<string, { variant: BadgeVariant; label: string }> = {
        planting: { variant: 'primary', label: '🌱 Tanam' },
        watering: { variant: 'info', label: '💧 Siram' },
        harvesting: { variant: 'success', label: '🌾 Panen' },
        monitoring: { variant: 'default', label: '👁️ Monitor' },
        fertilizing: { variant: 'secondary', label: '🧪 Pupuk' },
        pest_control: { variant: 'warning', label: '🐛 Hama' },
    };

    const config = typeConfig[type] || typeConfig.monitoring;

    return <Badge variant={config.variant}>{config.label}</Badge>;
};

export { Badge, StatusBadge, PriorityBadge, TaskTypeBadge };
