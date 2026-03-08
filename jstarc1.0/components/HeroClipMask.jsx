"use client";

import { useEffect } from "react";
import { useLoading } from "@/contexts/LoadingContext";
import { motion } from "framer-motion";
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
            {/* Mobile Hero Image with Intro Animation */}
            <div className="w-full h-full md:hidden flex items-center justify-center bg-[#eaeaea] relative">
                <div className="absolute inset-0 w-full h-full">
                    <img src="/assets/mobile-hero.png" alt="" className="w-full h-full object-cover blur-xl opacity-50 scale-110" />
                </div>
                <motion.img
                    src="/assets/mobile-hero.png"
                    alt="JSTARC Mobile"
                    className="w-full h-auto max-h-[90%] object-contain relative z-10"
                    initial={{ opacity: 0, scale: 1.05, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                />
            </div>
            {/* Desktop Hero Image */}
            <div className="w-full h-full hidden md:block">
                <img
                    src="/assets/1.jpg"
                    alt="JSTARC Desktop"
                    className="w-full h-full object-cover"
                />
            </div>
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
