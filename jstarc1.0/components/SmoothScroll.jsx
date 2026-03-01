"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
    const lenisRef = useRef(null);

    useEffect(() => {
        let lenis;
        let animId;

        const init = async () => {
            try {
                const Lenis = (await import("lenis")).default;
                lenis = new Lenis({
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    orientation: "vertical",
                    gestureOrientation: "vertical",
                    smoothWheel: true,
                    wheelMultiplier: 1,
                    touchMultiplier: 2,
                });

                lenisRef.current = lenis;

                // Connect Lenis to GSAP ScrollTrigger
                lenis.on("scroll", ScrollTrigger.update);

                gsap.ticker.add((time) => {
                    lenis.raf(time * 1000);
                });
                gsap.ticker.lagSmoothing(0);

            } catch (e) {
                // Lenis not installed, fall back to native scroll
                console.warn("Lenis not available, using native scroll");
            }
        };

        init();

        return () => {
            if (animId) cancelAnimationFrame(animId);
            if (lenis) lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
