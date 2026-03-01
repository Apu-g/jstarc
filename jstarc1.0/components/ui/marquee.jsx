"use client";

import { cn } from "@/lib/utils";

const Marquee = ({
    className,
    reverse = false,
    pauseOnHover = false,
    children,
    ...props
}) => {
    return (
        <div
            {...props}
            className={cn(
                "group flex overflow-hidden [--gap:1rem] gap-[var(--gap)]",
                className
            )}
        >
            {/* First copy */}
            <div
                className={cn(
                    "flex shrink-0 gap-[var(--gap)]",
                    reverse ? "animate-marquee-reverse" : "animate-marquee",
                    pauseOnHover && "group-hover:[animation-play-state:paused]"
                )}
            >
                {children}
            </div>
            {/* Second copy for seamless loop */}
            <div
                className={cn(
                    "flex shrink-0 gap-[var(--gap)]",
                    reverse ? "animate-marquee-reverse" : "animate-marquee",
                    pauseOnHover && "group-hover:[animation-play-state:paused]"
                )}
                aria-hidden="true"
            >
                {children}
            </div>
        </div>
    );
};

export { Marquee };
