"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import "./MastersScroll.css";

gsap.registerPlugin(ScrollTrigger);

export const MastersScroll = () => {
    const sectionRefs = useRef([]);
    const wrapperRef = useRef(null);
    const [masters, setMasters] = useState([]);

    useEffect(() => {
        fetch('/api/admin/masters')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Filter to only show Nilesh and Jai on the homepage
                    let homeMasters = data.filter(master =>
                        master.name.toLowerCase().includes('nilesh') ||
                        master.name.toLowerCase().includes('jai')
                    );

                    // Sort so Nilesh comes first
                    homeMasters.sort((a, b) => {
                        if (a.name.toLowerCase().includes('nilesh')) return -1;
                        if (b.name.toLowerCase().includes('nilesh')) return 1;
                        return 0;
                    });

                    setMasters(homeMasters);
                }
            })
            .catch(err => console.error("Failed to fetch masters:", err));
    }, []);

    useEffect(() => {
        if (masters.length === 0) return;

        const timer = setTimeout(() => {
            const ctx = gsap.context(() => {
                // Animate the section header
                const header = wrapperRef.current?.querySelector(".masters-scroll-header");
                if (header) {
                    gsap.fromTo(header,
                        { opacity: 0, y: 40 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 1,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: header,
                                start: "top 85%",
                                end: "top 55%",
                                scrub: 1,
                            },
                        }
                    );
                }

                // Animate each master section
                sectionRefs.current.forEach((section, index) => {
                    if (!section) return;

                    const content = section.querySelector(".ms-content");
                    const imgBox = section.querySelector(".ms-img-box");
                    const isEven = index % 2 === 0;

                    // Text content: slide in from left/right based on index
                    if (content) {
                        gsap.fromTo(content,
                            {
                                opacity: 0,
                                x: isEven ? -80 : 80,
                                y: 30
                            },
                            {
                                opacity: 1,
                                x: 0,
                                y: 0,
                                duration: 1.2,
                                ease: "power3.out",
                                scrollTrigger: {
                                    trigger: section,
                                    start: "top 75%",
                                    end: "top 30%",
                                    scrub: 1,
                                },
                            }
                        );
                    }

                    // Image: slide in from opposite side with scale
                    if (imgBox) {
                        gsap.fromTo(imgBox,
                            {
                                opacity: 0,
                                x: isEven ? 80 : -80,
                                scale: 0.9,
                                rotateY: isEven ? 5 : -5,
                            },
                            {
                                opacity: 1,
                                x: 0,
                                scale: 1,
                                rotateY: 0,
                                duration: 1.2,
                                ease: "power3.out",
                                scrollTrigger: {
                                    trigger: section,
                                    start: "top 75%",
                                    end: "top 30%",
                                    scrub: 1,
                                },
                            }
                        );
                    }

                    // Parallax: Image moves slower than content for depth
                    if (imgBox) {
                        gsap.to(imgBox, {
                            y: -30,
                            ease: "none",
                            scrollTrigger: {
                                trigger: section,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: true,
                            },
                        });
                    }
                });
            }, wrapperRef);

            return () => ctx.revert();
        }, 400);

        return () => clearTimeout(timer);
    }, [masters]);

    return (
        <div className="masters-scroll-wrapper" ref={wrapperRef}>
            {/* Section Header */}
            <div className="masters-scroll-header">
                <span className="masters-scroll-header-tag">OUR MASTERS</span>
                <h2 className="masters-scroll-header-title">Meet The Legends</h2>
            </div>

            {/* Master sections */}
            {masters.map((master, i) => (
                <section
                    key={master.id}
                    className={`masters-scroll-section ${i % 2 !== 0 ? 'ms-reverse' : ''}`}
                    ref={(el) => (sectionRefs.current[i] = el)}
                    aria-label={`${master.name} - ${master.designation}`}
                >
                    {/* Text Content */}
                    <div className="ms-content">
                        <span className="ms-tag">{master.designation}</span>
                        <h3 className="ms-name">{master.name}</h3>
                        <p className="ms-designation">{master.rank}</p>
                        <p className="ms-quote">&ldquo;{master.quote}&rdquo;</p>
                        <Link href="/team" className="ms-cta">
                            View Full Team
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </Link>
                    </div>

                    {/* Image */}
                    <div className="ms-img-box">
                        <img src={master.src} alt={master.name} loading="lazy" />
                    </div>
                </section>
            ))}
        </div>
    );
};
