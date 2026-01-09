import { type ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children?: ReactNode;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
}

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    children,
    onClick,
    disabled
}: ButtonProps) {

    const variants = {
        primary: "bg-white text-black hover:bg-white/90 border-transparent",
        secondary: "bg-white/10 text-white hover:bg-white/15 border-transparent",
        outline: "border-white/10 bg-transparent hover:bg-white/5 text-white",
        ghost: "bg-transparent text-white hover:bg-white/5 border-transparent"
    };

    const sizes = {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-8 text-base"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={cn(
                "relative flex items-center justify-center rounded-xl font-medium transition-colors border",
                variants[variant],
                sizes[size],
                (isLoading || disabled) && "opacity-70 cursor-not-allowed",
                className
            )}
            disabled={isLoading || disabled}
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Processing...</span>
                </div>
            ) : children}
        </motion.button>
    );
}
