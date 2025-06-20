// ==============================================================================
// FILE: components/ui/button.tsx
// DESC: Shadcn UI Button component.
// ==============================================================================

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import React from 'react';

const buttonVariants = cva(
    'w-2xs md:w-md inline-flex items-center justify-center rounded-sm text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                primary: 'bg-green-600 text-white hover:bg-green-700/90',
                outline:
                    'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
            },
            size: {
                default: 'h-10 px-4 py-2',
                lg: 'h-12 rounded-sm px-4 text-2xl',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';

        return (
            <Comp
                className={cn(buttonVariants({ variant, size }), className)}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
