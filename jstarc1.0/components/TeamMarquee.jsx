"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./TeamMarquee.css";

gsap.registerPlugin(ScrollTrigger);

// Fallback images if API fails or is empty
const fallbackImages = [
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
];

const TeamMarquee = () => {
    const sectionRef = useRef(null);
    const [teamImages, setTeamImages] = useState(fallbackImages);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                // Fetch from marquee gallery as requested
                const res = await fetch("/api/marquee", { cache: "no-store" });
                const data = await res.json();

                if (data && data.files && data.files.length > 0) {
                    const photos = data.files.map(f => f.src).filter(Boolean);
                    if (photos.length >= 12) {
                        // Use only the first 12 for the marquee to maintain the 3-row layout structure
                        setTeamImages(photos.slice(0, 12));
                    } else if (photos.length > 0) {
                        // pad with fallbacks if we don't have enough to fill the layout properly
                        setTeamImages([...photos, ...fallbackImages].slice(0, 12));
                    }
                }
            } catch (e) {
                console.error("Failed to fetch team marquee photos", e);
            }
        };

        fetchPhotos();
    }, []);

    useEffect(() => {
        if (!sectionRef.current || teamImages.length === 0) return;

        const containers = sectionRef.current.querySelectorAll(".team-marquee-container");

        // Animate each marquee row
        const animations = [];
        containers.forEach((container, index) => {
            let start = "0%";
            let end = "-15%";

            if (index % 2 === 0) {
                start = "0%";
                end = "10%";
            }

            const marquee = container.querySelector(".team-marquee-inner");
            const textElements = container.querySelectorAll(".team-marquee-item h1");

            // Horizontal scroll animation
            const scrollAnim = gsap.fromTo(
                marquee,
                { x: start },
                {
                    x: end,
                    scrollTrigger: {
                        trigger: container,
                        start: "top bottom",
                        end: "150% top",
                        scrub: true,
                    },
                }
            );
            animations.push(scrollAnim);

            // Variable font weight animation for each text
            textElements.forEach((textEl) => {
                // Split text into characters manually
                const text = textEl.textContent;
                textEl.innerHTML = "";
                const chars = [];
                for (let c = 0; c < text.length; c++) {
                    const span = document.createElement("span");
                    span.textContent = text[c];
                    span.style.display = "inline-block";
                    span.style.fontFamily = '"Big Shoulders Display", sans-serif';
                    span.style.fontWeight = "100";
                    textEl.appendChild(span);
                    chars.push(span);
                }

                const reverse = index % 2 !== 0;
                const staggerOptions = {
                    each: 0.35,
                    from: reverse ? "start" : "end",
                    ease: "linear",
                };

                const charAnim = gsap.fromTo(
                    chars,
                    { fontWeight: 100 },
                    {
                        fontWeight: 900,
                        duration: 1,
                        ease: "none",
                        stagger: staggerOptions,
                        scrollTrigger: {
                            trigger: container,
                            start: "50% bottom",
                            end: "top top",
                            scrub: true,
                        },
                    }
                );
                animations.push(charAnim);
            });
        });

        return () => {
            animations.forEach((anim) => {
                if (anim.scrollTrigger) anim.scrollTrigger.kill();
                anim.kill();
            });
        };
    }, [teamImages]);

    // 3 marquee rows with dynamic images layered in
    const marqueeRows = [
        {
            id: "team-marquee-1",
            text: "TEAM",
            images: teamImages.slice(0, 4),
            textPosition: 1,
        },
        {
            id: "team-marquee-2",
            text: "JSTARC",
            images: teamImages.slice(4, 8),
            textPosition: 3,
        },
        {
            id: "team-marquee-3",
            text: "BENGALURU",
            images: teamImages.slice(8, 12),
            textPosition: 1,
        },
    ];

    return (
        <section className="team-marquees-section" ref={sectionRef}>
            {marqueeRows.map((row, rowIndex) => (
                <div className="team-marquee-container" id={row.id} key={row.id}>
                    <div className="team-marquee-inner">
                        {row.images.map((img, imgIndex) => {
                            const items = [];
                            // Insert text at the specified position
                            if (imgIndex === row.textPosition) {
                                items.push(
                                    <div className="team-marquee-item with-text" key={`text-${rowIndex}`}>
                                        <h1>{row.text}</h1>
                                    </div>
                                );
                            }
                            items.push(
                                <div className="team-marquee-item" key={`img-${rowIndex}-${imgIndex}`}>
                                    <img
                                        src={img}
                                        alt={`JSTARC team member ${imgIndex + 1}`}
                                        loading="lazy"
                                    />
                                </div>
                            );
                            return items;
                        })}
                    </div>
                </div>
            ))}
        </section>
    );
};

export default TeamMarquee;
