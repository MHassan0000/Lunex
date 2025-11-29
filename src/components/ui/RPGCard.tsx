import React from 'react';

interface RPGCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'neon';
    hoverEffect?: boolean;
}

export const RPGCard = React.forwardRef<HTMLDivElement, RPGCardProps>(
    ({ className = '', variant = 'default', hoverEffect = true, children, ...props }, ref) => {

        const baseStyles = "relative rounded-xl overflow-hidden transition-all duration-300";

        const variants = {
            default: "bg-[--color-dark-800] border border-[--color-dark-700]",
            glass: "glass-panel-rpg",
            neon: "bg-[--color-dark-900] border border-[--color-neon-purple] shadow-[0_0_10px_rgba(168,85,247,0.1)]",
        };

        const hoverStyles = hoverEffect
            ? "hover:translate-y-[-4px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-[--color-neon-purple]/50"
            : "";

        return (
            <div
                ref={ref}
                className={`
          ${baseStyles}
          ${variants[variant]}
          ${hoverStyles}
          ${className}
        `}
                {...props}
            >
                {children}
            </div>
        );
    }
);

RPGCard.displayName = 'RPGCard';
