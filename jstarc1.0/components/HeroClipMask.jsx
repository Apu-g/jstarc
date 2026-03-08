"use client";

import { useEffect } from "react";
import { useLoading } from "@/contexts/LoadingContext";
import "./HeroClipMask.css";

const HeroClipMask = () => {
    const { introShown, loaderDone, markIntroComplete } = useLoading();

    useEffect(() => {
        if (!introShown && loaderDone) {
            markIntroComplete();
        }
    }, [introShown, loaderDone, markIntroComplete]);

    return (
        <div className="w-full h-screen relative overflow-hidden bg-[#111]">
            <img src="/assets/1.jpg" alt="JSTARC" className="w-full h-full object-cover" />
            {/* Subtle top vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />
            {/* Strong bottom fade into dark masters section */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: 'linear-gradient(to bottom, transparent 40%, rgba(17,17,17,0.4) 65%, rgba(17,17,17,0.85) 85%, #111 100%)'
            }} />
            {/* Minimal tagline */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex flex-col items-center gap-2">
                <span className="text-white/50 text-[11px] uppercase tracking-[0.35em] font-light" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    Taekwondo Academy · Bengaluru
                </span>
                <div className="w-8 h-[1px] bg-white/20" />
            </div>
        </div>
    );
};

export default HeroClipMask;
