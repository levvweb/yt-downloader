import { useState, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    icon?: React.ReactNode;
}

export function Input({ className, error, icon, ...props }: InputProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative">
            <div
                className={cn(
                    "relative flex items-center w-full overflow-hidden rounded-md border bg-[#272727] transition-colors",
                    isFocused ? "border-red-500/50" : "border-white/5",
                    error ? "border-red-500/50" : "",
                    className
                )}
            >
                {icon && (
                    <div className={cn(
                        "pl-3 transition-colors",
                        isFocused ? "text-red-400" : "text-white/30"
                    )}>
                        {icon}
                    </div>
                )}
                <input
                    className={cn(
                        "flex h-10 w-full bg-transparent px-3 text-sm text-white placeholder:text-white/30 outline-none disabled:cursor-not-allowed disabled:opacity-50",
                        icon ? "pl-2" : ""
                    )}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
            </div>
            {error && (
                <span className="absolute left-0 top-full mt-1 text-[10px] text-red-400">
                    {error}
                </span>
            )}
        </div>
    );
}
