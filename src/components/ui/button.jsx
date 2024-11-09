import { clsx } from 'clsx';
import { Slot } from '@radix-ui/react-slot';
import { twMerge } from 'tailwind-merge';

export const buttonVariants = {
    icon: 'p-2 hover:bg-gray-100 rounded-md'
};

const Button = ({ children, className, variant, ...props }) => {
    const classes = twMerge(
        variant === 'icon'
            ? buttonVariants.icon
            : 'inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700',
        className
    );

    return (
        <button className={classes} {...props}>{children}</button>
    );
};

export { Button };