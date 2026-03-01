"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./StatsSlider.css";

gsap.registerPlugin(ScrollTrigger);

const defaultSlides = [
    {
        number: "25+",
        label: "Years of Operation",
        desc: "Over two decades of shaping champions and transforming lives through the art of Taekwondo.",
        img: "",
    },
    {
        number: "1500+",
        label: "Students Trained",
        desc: "Impacting lives daily — building confident, disciplined, and skilled martial artists across Bengaluru.",
        img: "",
    },
    {
        number: "1000+",
        label: "Medals Won",
        desc: "A legacy of excellence. State, national, and international victories by our dedicated athletes.",
        img: "",
    },
    {
        number: null,
        label: "Discipline",
        desc: "Cultivating focus, self-control, and a strong work ethic through structured training.",
        img: "",
    },
    {
        number: null,
        label: "Respect",
        desc: "Honoring our instructors, fellow students, and the traditions of Taekwondo.",
        img: "",
    },
    {
        number: null,
        label: "Integrity",
        desc: "Upholding honesty and strong moral principles in all our actions.",
        img: "",
    },
];

export const StatsSlider = () => {
    const sectionRef = useRef(null);
    const deckRef = useRef(null);
    const cardRefs = useRef([]);
    const [activeIdx, setActiveIdx] = useState(0);
    const [slides, setSlides] = useState(defaultSlides);

    // Fetch dynamic gallery photos
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await fetch("/api/marquee", { cache: "no-store" });
                const data = await res.json();
                if (data && data.files && data.files.length > 0) {
                    const photos = data.files.map(f => f.src).filter(Boolean);
                    const shuffled = [...photos].sort(() => 0.5 - Math.random());

                    const updatedSlides = defaultSlides.map((slide, i) => ({
                        ...slide,
                        img: shuffled[i % shuffled.length]
                    }));
                    setSlides(updatedSlides);
                }
            } catch (err) {
                console.error("Failed to fetch gallery for StatsSlider:", err);
            }
        };
        fetchImages();
    }, []);

    // Animation Effect
    useEffect(() => {
        if (!sectionRef.current || !deckRef.current || !slides[0].img) return;

        const timer = setTimeout(() => {
            const ctx = gsap.context(() => {
                const cards = cardRefs.current.filter(Boolean);
                const total = cards.length;
                if (total === 0) return;

                cards.forEach((card, i) => {
                    gsap.set(card, {
                        y: -i * 25,
                        scale: 1 - i * 0.04,
                        zIndex: total - i,
                        opacity: 1,
                        transformOrigin: "top center",
                        rotation: 0,
                        x: 0,
                    });
                });

                const totalScrollVh = total * 80;

                ScrollTrigger.create({
                    trigger: sectionRef.current,
                    start: "top top",
                    end: `+=${totalScrollVh}vh`,
                    pin: true,
                    anticipatePin: 1,
                    scrub: 1,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        const segmentSize = 1 / total;
                        const currentCard = Math.min(Math.floor(progress * total), total - 1);

                        setActiveIdx(currentCard);

                        cards.forEach((card, i) => {
                            const cardStart = i * segmentSize;

                            if (i < currentCard) {
                                gsap.set(card, {
                                    y: -window.innerHeight * 1.5,
                                    opacity: 0,
                                    scale: 1.05,
                                });
                            } else if (i === currentCard && i < total - 1) {
                                const localProgress = (progress - cardStart) / segmentSize;
                                const eased = Math.min(localProgress, 1);

                                gsap.set(card, {
                                    y: -window.innerHeight * eased,
                                    opacity: 1 - eased * 0.8,
                                    scale: 1 + eased * 0.05,
                                });

                                cards.slice(i + 1).forEach((nextCard, offset) => {
                                    const origIdx = offset + 1;
                                    const targetIdx = offset;

                                    const currY = -origIdx * 25;
                                    const targY = -targetIdx * 25;

                                    const currScale = 1 - origIdx * 0.04;
                                    const targScale = 1 - targetIdx * 0.04;

                                    gsap.set(nextCard, {
                                        y: currY + (targY - currY) * eased,
                                        scale: currScale + (targScale - currScale) * eased,
                                    });
                                });
                            } else if (i === currentCard && i === total - 1) {
                                gsap.set(card, {
                                    y: 0,
                                    scale: 1,
                                    opacity: 1
                                });
                            } else if (i > currentCard + 1) {
                                gsap.set(card, {
                                    y: -(i - currentCard) * 25,
                                    scale: 1 - (i - currentCard) * 0.04,
                                    opacity: 1,
                                });
                            }
                        });
                    },
                });
            }, sectionRef);

            return () => ctx.revert();
        }, 300);

        return () => clearTimeout(timer);
    }, [slides]);

    return (
        <section className="stats-deck-wrapper" ref={sectionRef} aria-label="JSTARC Statistics">
            <div className="stats-deck-header">
                <span className="stats-deck-tag">BY THE NUMBERS</span>
                <h2 className="stats-deck-title">OUR LEGACY IN ACTION</h2>
            </div>

            <div className="stats-deck-sticky" ref={deckRef}>
                {slides.map((slide, i) => (
                    <div
                        key={i}
                        className="stats-deck-card"
                        ref={(el) => (cardRefs.current[i] = el)}
                    >
                        {slide.img && (
                            <img
                                className="stats-deck-card-bg"
                                src={slide.img}
                                alt={slide.label}
                                loading="lazy"
                            />
                        )}
                        <div className="stats-deck-card-overlay" />
                        <span className="stats-deck-idx">
                            {String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                        </span>
                        <div className="stats-deck-card-content">
                            {slide.number && (
                                <div className="stats-deck-number">{slide.number}</div>
                            )}
                            <div className="stats-deck-label">{slide.label}</div>
                            <p className="stats-deck-desc">{slide.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="stats-deck-progress">
                {slides.map((_, i) => (
                    <span
                        key={i}
                        className={`stats-deck-dot ${activeIdx >= i ? "active" : ""}`}
                    />
                ))}
            </div>

            <div className="stats-deck-subtitle">
                <p>Impacting lives daily — one kick at a time</p>
            </div>
        </section>
    );
};
