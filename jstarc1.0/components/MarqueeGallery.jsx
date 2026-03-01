"use client";

import { motion } from "framer-motion";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

// JStarc team photos (Fallback)
const jstarcPhotos = [
    "/assets/jstarc_team/007ed55b-c516-468b-b3d6-9a1c62f5a38d.jpg",
    "/assets/jstarc_team/0e07f5c2-9b97-415a-b0b3-c148dceef470.jpg",
    "/assets/jstarc_team/1578fc6b-e846-4bd8-a5a1-2a6724080abc.jpg",
    "/assets/jstarc_team/238ac687-20db-40d0-9a4a-0414f38c8302.jpg",
    "/assets/jstarc_team/3a920344-a398-47d8-8d16-e6b3e298aa36.jpg",
    "/assets/jstarc_team/3a9679b5-216d-4d52-8e8b-e047de2f69e8.jpg",
    "/assets/jstarc_team/3f17e987-ff28-4cfd-af9c-01d0971af864.jpg",
    "/assets/jstarc_team/423f9d2f-8bb3-4dd5-9f12-2c3e38e6dcf0.jpg",
    "/assets/jstarc_team/4c1e8288-d28a-4995-803b-2ad1c756d8f2.jpg",
    "/assets/jstarc_team/673326a9-2535-46be-ad18-ba5dbada0deb.jpg",
    "/assets/jstarc_team/6d8ead85-30b3-4aec-aa81-599b07296044.jpg",
    "/assets/jstarc_team/6dd5463e-b9cd-4f06-847d-f5a8cae41b3c.jpg",
    "/assets/jstarc_team/776c05b2-5542-4c77-b09c-70bf0d82a0ce.jpg",
    "/assets/jstarc_team/7ef25940-bbd6-43e8-af96-8d0249a502e0.jpg",
    "/assets/jstarc_team/87cd94ec-efac-415e-a146-26a77fa27b2f.jpg",
    "/assets/jstarc_team/8cead97b-d9b7-4774-9805-9c877f79a5c9.jpg",
    "/assets/jstarc_team/91aea6b9-9d87-4e44-a203-c3c780a62a42.jpg",
    "/assets/jstarc_team/9b61a40d-b0f3-4601-ba80-09bbb0a38517.jpg",
    "/assets/jstarc_team/9bd4fa3d-d4dd-442c-b8a6-ca8f86dd5ab5.jpg",
    "/assets/jstarc_team/a875df73-4baf-4592-bb6b-b04368c7cfc4.jpg",
    "/assets/jstarc_team/b047783c-4731-422f-8c57-7175db1cbc88.jpg",
    "/assets/jstarc_team/bca876dc-826f-467a-97fd-c6a6978c611a.jpg",
    "/assets/jstarc_team/bea5f192-72ff-4266-ba95-0e211241b898.jpg",
    "/assets/jstarc_team/bed14831-6427-40b9-ac9a-9c90c0502031.jpg",
    "/assets/jstarc_team/c8f76efd-90f6-46ca-8d46-62715e2f0f46.jpg",
    "/assets/jstarc_team/cdbf6d8f-2313-4b9b-bb70-6937ad54f7c6.jpg",
    "/assets/jstarc_team/d51575c6-358a-417f-8cf1-36a531d647ad.jpg",
    "/assets/jstarc_team/dff84f9c-6d92-4f58-a596-69e116591b26.jpg",
    "/assets/jstarc_team/e0b7fabf-5cbc-493e-b64b-62ac1ff6aba8.jpg",
    "/assets/jstarc_team/ef0785f4-2e6b-4a0d-8f15-668decd3bbf6.jpg",
    "/assets/jstarc_team/f089220e-de6a-483f-a4ef-3358539abfb0.jpg",
    "/assets/jstarc_team/f97ae5b1-aa63-4509-a08c-2913a97af5a9.jpg",
    "/assets/jstarc_team/fc3a60ca-ee90-425a-8050-01c494a9001e.jpg",
];

// Photo card component with enhanced visual effects
const PhotoCard = ({ src, index }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const cardRef = useRef(null);

    // Scroll-triggered zoom animation
    useEffect(() => {
        const currentCard = cardRef.current;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsZoomed(true);
                        setTimeout(() => setIsZoomed(false), 500); // Reset after animation
                    }
                });
            },
            { threshold: 0.7 } // Trigger when 70% visible
        );

        if (currentCard) {
            observer.observe(currentCard);
        }

        return () => {
            if (currentCard) {
                observer.unobserve(currentCard);
            }
        };
    }, []);

    return (
        <div
            ref={cardRef}
            className={cn(
                "photo-card relative h-16 w-20 md:h-44 md:w-72 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg md:rounded-xl group",
                "border border-white/10 bg-black/20",
                "transition-all duration-300 ease-in-out",
                "hover:border-neon-blue/60 hover:shadow-[0_0_15px_rgba(0,243,255,0.3)]",
                "focus:border-neon-blue/80 focus:shadow-[0_0_20px_rgba(0,243,255,0.4)]",
                "shadow-lg"
            )}
            onMouseEnter={() => setIsFocused(true)}
            onMouseLeave={() => setIsFocused(false)}
            onClick={() => setIsFocused(!isFocused)}
            tabIndex={0}
        >
            {/* Refined border glow effect */}
            <div className={cn(
                "absolute inset-0 rounded-xl border-2 pointer-events-none",
                "transition-all duration-300 ease-in-out",
                "border-transparent group-hover:border-neon-blue/40 group-focus:border-neon-blue/60",
                "shadow-[0_0_8px_rgba(0,243,255,0.2)] group-hover:shadow-[0_0_12px_rgba(0,243,255,0.3)]",
                "group-focus:shadow-[0_0_16px_rgba(0,243,255,0.4)]"
            )} />
            
            <img
                src={src}
                alt={`JStarc Team ${index + 1}`}
                className={cn(
                    "h-full w-full object-cover transition-all duration-300 ease-in-out",
                    "filter brightness-90 group-hover:brightness-110",
                    "transform-gpu will-change-transform",
                    {
                        "scale-110": isZoomed, // 10% zoom on scroll trigger
                        "scale-105": isFocused && !isZoomed // Subtle zoom on focus
                    }
                )}
                style={{
                    filter: isFocused ? 'brightness(110%)' : 'brightness(90%) blur(0px)',
                    willChange: 'transform, filter'
                }}
            />
            
            {/* Focus indicator */}
            {isFocused && (
                <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 via-transparent to-neon-purple/10 pointer-events-none" />
            )}
        </div>
    );
};

export const MarqueeGallery = () => {
    const [firstRow, setFirstRow] = useState([]);
    const [secondRow, setSecondRow] = useState([]);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const res = await fetch("/api/marquee", { cache: "no-store" });
                const data = await res.json();
                
                let photosToUse = [];
                if (data.files && data.files.length > 0) {
                    photosToUse = data.files.map(f => f.src);
                } else {
                    photosToUse = jstarcPhotos; // Fallback
                }

                const mid = Math.ceil(photosToUse.length / 2);
                setFirstRow(photosToUse.slice(0, mid));
                setSecondRow(photosToUse.slice(mid));
            } catch (e) {
                console.error("Failed to fetch marquee photos", e);
                // Fallback on error
                const mid = Math.ceil(jstarcPhotos.length / 2);
                setFirstRow(jstarcPhotos.slice(0, mid));
                setSecondRow(jstarcPhotos.slice(mid));
            }
        };

        fetchPhotos();
        const interval = setInterval(fetchPhotos, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-12 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-4 text-glow">
                        Award Winning <span className="text-neon-blue text-glow-blue">Demonstration Team</span>
                    </h2>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                        Our elite team showcasing precision, power, and passion in every performance.
                    </p>
                </motion.div>
            </div>

            {/* Marquee Photo Gallery */}
            <div className="gallery-container relative flex w-full flex-col items-center justify-center gap-4 md:gap-6 overflow-hidden py-4 md:py-8">
                {/* First Row - Scrolls Left (default direction) */}
                <Marquee pauseOnHover className="[--duration:40s] md:[--duration:60s] [--gap:0.75rem] md:[--gap:1.5rem]">
                    {firstRow.map((photo, index) => (
                        <PhotoCard key={`row1-${index}`} src={photo} index={index} />
                    ))}
                </Marquee>

                {/* Second Row - Scrolls Right (reverse direction) */}
                <Marquee reverse pauseOnHover className="[--duration:40s] md:[--duration:60s] [--gap:0.75rem] md:[--gap:1.5rem]">
                    {secondRow.map((photo, index) => (
                        <PhotoCard key={`row2-${index}`} src={photo} index={index + 17} />
                    ))}
                </Marquee>

                {/* Edge fade gradients */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10"></div>
            </div>
        </section>
    );
};
