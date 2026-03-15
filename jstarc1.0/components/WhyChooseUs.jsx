"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./TextImageReveal.css";

gsap.registerPlugin(ScrollTrigger);

const defaultLines = [
    {
        before: "Learn",
        after: "Your Way",
        imgH: 120,
        imgW: 250,
    },
    {
        before: "Programs",
        after: "for Everyone",
        imgH: 90,
        imgW: 320,
    },
    {
        before: "Schedule",
        after: "That Fits",
        imgH: 140,
        imgW: 200,
    },
    {
        before: "We Shape",
        after: "Discipline",
        imgH: 80,
        imgW: 350,
    },
    {
        before: "We Build",
        after: "Champions",
        imgH: 130,
        imgW: 220,
    },
];

export const WhyChooseUs = () => {
    const sectionRef = useRef(null);
    const [lines, setLines] = useState(defaultLines);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await fetch("/api/marquee", { cache: "no-store" });
                const data = await res.json();
                if (data && data.files && data.files.length > 0) {
                    const photos = data.files.map(f => f.src).filter(Boolean);

                    // Shuffle photos randomly
                    const shuffled = [...photos].sort(() => 0.5 - Math.random());

                    // Inject into lines
                    const updatedLines = defaultLines.map((line, i) => ({
                        ...line,
                        img: shuffled[i % shuffled.length] // Fallback to wrap around if < 5 photos
                    }));
                    setLines(updatedLines);
                }
            } catch {
                // Silent fallback — default lines remain without images
            }
        };
        fetchImages();
    }, []);

    useEffect(() => {
        if (!lines[0].img) return; // Wait until images are loaded

        const ctx = gsap.context(() => {
            const textLines = sectionRef.current.querySelectorAll(".text-reveal-line");
            
            // --- UNIFIED ANIMATION: Intro & Outro Alternating Flow ---
            textLines.forEach((line, index) => {
                const imgSpan = line.querySelector(".text-reveal-img-span");
                const textGroup = line.querySelector(".text-group");
                const isEven = index % 2 === 0;

                if (imgSpan && textGroup) {
                    // Start states
                    gsap.set([imgSpan, textGroup], { opacity: 0 });
                    gsap.set(imgSpan, { x: isEven ? -40 : 40 });
                    gsap.set(textGroup, { x: isEven ? 40 : -40 });

                    // Scroll trigger handles both intro and outro
                    gsap.to([imgSpan, textGroup], {
                        opacity: 1,
                        x: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: line,
                            start: "top 85%",
                            end: "bottom 30%",
                            toggleActions: "play reverse play reverse",
                        }
                    });
                }
            });

            // Cinematic blur-in for the whole section (Applies globally)
            gsap.fromTo(
                sectionRef.current,
                { filter: "blur(20px)", opacity: 0 },
                {
                    filter: "blur(0px)",
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 85%",
                        end: "top 50%",
                        scrub: 1,
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, [lines]);

    return (
        <section
            ref={sectionRef}
            className="text-reveal-section"
        >
            {/* Intro hint */}
            <div className="text-reveal-intro">
                <span className="text-reveal-intro-tag">WHY JSTARC</span>
            </div>

            {/* Text + Image Lines */}
            <div className="text-reveal-container">
                {lines.map((line, i) => (
                    <div key={i} className="text-reveal-line">
                        <span className="text-reveal-img-span">
                            {line.img && (
                                <img
                                    src={line.img}
                                    alt=""
                                    loading="lazy"
                                />
                            )}
                        </span>
                        
                        <div className="text-group">
                            <span className="text-reveal-word">{line.before}</span>
                            {line.after && <span className="text-reveal-word">{line.after}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
