// ==============================================================================
// FILE: components/ui/toggle-group.tsx
// DESC: Shadcn UI Toggle Group component.
// ==============================================================================
import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const toggleGroupVariants = cva(
    'inline-flex items-center justify-center rounded-sm gap-2',
    {
        variants: {
            variant: {
                default: 'bg-muted p-1',
                outline: '',
            },
            size: {
                default: '',
                sm: '',
                lg: '',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

const toggleGroupItemVariants = cva(
    'inline-flex items-center justify-center rounded-sm text-xl font-medium transition-all focus:z-10 focus:outline-none disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-transparent hover:bg-background/50',
                outline:
                    'bg-white border-gray-300 border text-gray-700 hover:bg-gray-50 data-[state=on]:bg-green-600 data-[state=on]:text-white data-[state=on]:border-green-600 data-[state=on]:shadow-lg',
            },
            size: {
                default: 'h-12 px-6',
                sm: 'h-9 px-3',
                lg: 'h-15 px-5',
            },
        },
        defaultVariants: {
            variant: 'outline',
            size: 'default',
        },
    }
);

const ToggleGroupContext = React.createContext<
    VariantProps<typeof toggleGroupItemVariants>
>({
    size: 'default',
    variant: 'outline',
});

const ToggleGroup = React.forwardRef<
    React.ElementRef<typeof ToggleGroupPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
        VariantProps<typeof toggleGroupVariants>
>(({ className, variant, size, children, ...props }, ref) => (
    <ToggleGroupPrimitive.Root
        ref={ref}
        className={cn(toggleGroupVariants({ variant, size }), className)}
        {...props}
    >
        <ToggleGroupContext.Provider value={{ variant, size }}>
            {children}
        </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
));
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef<
    React.ElementRef<typeof ToggleGroupPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
        VariantProps<typeof toggleGroupItemVariants>
>(({ className, children, variant, size, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext);

    return (
        <ToggleGroupPrimitive.Item
            ref={ref}
            className={cn(
                toggleGroupItemVariants({
                    variant: context.variant || variant,
                    size: context.size || size,
                }),
                className
            )}
            {...props}
        >
            {children}
        </ToggleGroupPrimitive.Item>
    );
});
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };
