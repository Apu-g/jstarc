"use client";

import { useEffect, useRef, useState } from "react";
import "./HomeMastersSwiper.css";

export const HomeMasters = () => {
    const swiperRef = useRef(null);
    const swiperInstanceRef = useRef(null);
    const [masters, setMasters] = useState([]);

    // Fetch masters from API
    useEffect(() => {
        fetch('/api/admin/masters')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) setMasters(data);
            })
            .catch(err => console.error('Failed to fetch masters:', err));
    }, []);

    // Duplicate for smooth Swiper loop (needs >= slidesPerView * 2 slides)
    const slides = [...masters, ...masters, ...masters];

    useEffect(() => {
        if (masters.length === 0) return;
        let swiper;

        const init = async () => {
            try {
                const SwiperModule = await import("swiper");
                const { Mousewheel, Autoplay } = await import("swiper/modules");
                await import("swiper/css");

                const Swiper = SwiperModule.default;

                swiper = new Swiper(swiperRef.current, {
                    modules: [Mousewheel, Autoplay],
                    loop: true,
                    mousewheel: {
                        sensitivity: 1,
                        releaseOnEdges: false,
                    },
                    slidesPerView: 3,
                    speed: 1500,
                    spaceBetween: 0,
                    autoplay: {
                        delay: 2500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    },
                    grabCursor: true,
                });

                swiperInstanceRef.current = swiper;
            } catch (e) {
                console.warn("Swiper init error:", e);
            }
        };

        init();

        return () => {
            if (swiper) swiper.destroy(true, true);
        };
    }, [masters]);

    return (
        <section className="masters-hero-section">
            {/* Section Title */}
            <div className="masters-hero-header">
                <span className="masters-hero-tag">OUR MASTERS</span>
                <h2 className="masters-hero-title">Meet The Legends</h2>
            </div>

            {/* Swiper */}
            <div ref={swiperRef} className="swiper masters-swiper">
                <div className="swiper-wrapper">
                    {slides.map((master, idx) => (
                        <div key={`${master.id}-${idx}`} className="swiper-slide">
                            {/* Main Image */}
                            <div className="slide-img">
                                <img
                                    src={master.src}
                                    alt={master.name}
                                />
                            </div>

                            {/* Blur Background Image */}
                            <div className="slide-img slide-img-blur">
                                <img
                                    src={master.src}
                                    alt=""
                                    aria-hidden="true"
                                />
                            </div>

                            {/* Slide Content */}
                            <div className="slide-content">
                                <h2>{master.name}</h2>
                                <p className="slide-rank">{master.designation}</p>
                                <p className="slide-quote">&ldquo;{master.quote}&rdquo;</p>
                                <a href="/team" className="slide-cta">
                                    View Full Team
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
