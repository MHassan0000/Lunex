import React from 'react';
import { Loader2 } from 'lucide-react';

interface RPGButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    glow?: boolean;
}

export const RPGButton = React.forwardRef<HTMLButtonElement, RPGButtonProps>(
    ({ className = '', variant = 'primary', size = 'md', isLoading, glow = true, children, disabled, ...props }, ref) => {

        const baseStyles = "relative inline-flex items-center justify-center font-rajdhani font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--color-dark-950]";

        const variants = {
            primary: "bg-[--color-neon-purple] text-white hover:bg-[#9333ea] border border-transparent",
            secondary: "bg-[--color-neon-blue] text-[--color-dark-950] hover:bg-[#0284c7] border border-transparent",
            outline: "bg-transparent border border-[--color-neon-purple] text-[--color-neon-purple] hover:bg-[--color-neon-purple]/10",
            ghost: "bg-transparent text-[--color-light-200] hover:text-white hover:bg-[--color-light-200]/10",
            danger: "bg-[--color-neon-red] text-white hover:bg-[#be123c] border border-transparent",
        };

        const sizes = {
            sm: "h-8 px-4 text-xs",
            md: "h-10 px-6 text-sm",
            lg: "h-12 px-8 text-base",
            icon: "h-10 w-10 p-2",
        };

        const glowStyles = glow && variant !== 'ghost' && variant !== 'outline'
            ? "shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]"
            : "";

        const blueGlow = glow && variant === 'secondary'
            ? "shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)]"
            : "";

        return (
            <button
                ref={ref}
                className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${variant === 'secondary' ? blueGlow : glowStyles}
          ${className}
        `}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}

                {/* Decorative corner accents for primary/outline */}
                {(variant === 'primary' || variant === 'outline') && (
                    <>
                        <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30" />
                        <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30" />
                    </>
                )}
            </button>
        );
    }
);

RPGButton.displayName = 'RPGButton';
