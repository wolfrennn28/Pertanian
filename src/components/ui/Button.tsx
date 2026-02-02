import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles = cn(
            'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
            'rounded-xl'
        );

        const variants = {
            primary: cn(
                'bg-gradient-to-r from-primary-500 to-primary-600 text-white',
                'hover:from-primary-600 hover:to-primary-700',
                'shadow-md hover:shadow-lg hover:shadow-primary-500/25',
                'active:scale-[0.98]'
            ),
            secondary: cn(
                'bg-gray-100 text-gray-900',
                'hover:bg-gray-200',
                'active:scale-[0.98]'
            ),
            outline: cn(
                'border-2 border-primary-500 text-primary-600 bg-transparent',
                'hover:bg-primary-50',
                'active:scale-[0.98]'
            ),
            ghost: cn(
                'text-gray-600 bg-transparent',
                'hover:bg-gray-100 hover:text-gray-900',
                'active:scale-[0.98]'
            ),
            destructive: cn(
                'bg-gradient-to-r from-red-500 to-red-600 text-white',
                'hover:from-red-600 hover:to-red-700',
                'shadow-md hover:shadow-lg hover:shadow-red-500/25',
                'active:scale-[0.98]'
            ),
        };

        const sizes = {
            sm: 'h-8 px-3 text-sm',
            md: 'h-10 px-4 text-sm',
            lg: 'h-12 px-6 text-base',
            icon: 'h-10 w-10',
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    leftIcon
                )}
                {children}
                {!isLoading && rightIcon}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button };
