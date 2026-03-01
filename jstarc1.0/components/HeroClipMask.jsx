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
        <div className="w-full h-screen relative overflow-hidden bg-black">
            <img src="/assets/1.jpg" alt="JSTARC" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-12 flex justify-center pointer-events-none z-10 willem__h1">
                <span className="willem__letter-white">J</span>
                <span className="willem__letter-white">S</span>
                <span className="willem__letter-white">T</span>
                <span className="willem__letter-white">A</span>
                <span className="willem__letter-white">R</span>
                <span className="willem__letter-white">C</span>
            </div>
        </div>
    );
};

export default HeroClipMask;
