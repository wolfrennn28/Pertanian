import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'elevated' | 'bordered';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
        const variants = {
            default: 'bg-white shadow-soft',
            glass: 'bg-white/80 backdrop-blur-lg border border-white/20 shadow-soft',
            elevated: 'bg-white shadow-lg hover:shadow-xl transition-shadow duration-300',
            bordered: 'bg-white border border-gray-200',
        };

        const paddings = {
            none: '',
            sm: 'p-3',
            md: 'p-4 sm:p-6',
            lg: 'p-6 sm:p-8',
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-2xl',
                    variants[variant],
                    paddings[padding],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> { }

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('flex flex-col space-y-1.5 pb-4', className)}
            {...props}
        >
            {children}
        </div>
    )
);

CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ className, as: Component = 'h3', children, ...props }, ref) => (
        <Component
            ref={ref}
            className={cn('text-lg font-semibold text-gray-900', className)}
            {...props}
        >
            {children}
        </Component>
    )
);

CardTitle.displayName = 'CardTitle';

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> { }

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
    ({ className, children, ...props }, ref) => (
        <p
            ref={ref}
            className={cn('text-sm text-gray-500', className)}
            {...props}
        >
            {children}
        </p>
    )
);

CardDescription.displayName = 'CardDescription';

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> { }

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
    ({ className, children, ...props }, ref) => (
        <div ref={ref} className={cn('', className)} {...props}>
            {children}
        </div>
    )
);

CardContent.displayName = 'CardContent';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> { }

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('flex items-center pt-4 border-t border-gray-100', className)}
            {...props}
        >
            {children}
        </div>
    )
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
