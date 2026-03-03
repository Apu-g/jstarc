"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import "./MastersGallery3D.css";

const CONFIG = {
    spacingX: 45,
    pWidth: 14,
    pHeight: 18,
    camZ: 30,
    wallAngleY: -0.25,
    snapDelay: 200,
    lerpSpeed: 0.06,
    autoInterval: 1500,
    idleResumeDelay: 4000,
};

// ─── Mobile-only: Clean auto-sliding card view ───
const MastersMobileView = ({ masters }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const touchStartX = useRef(0);
    const autoTimerRef = useRef(null);
    const pauseTimerRef = useRef(null);
    const isPaused = useRef(false);

    // Auto-advance — pauses on manual swipe, resumes after 5s
    useEffect(() => {
        const startAuto = () => {
            if (autoTimerRef.current) clearInterval(autoTimerRef.current);
            autoTimerRef.current = setInterval(() => {
                if (!isPaused.current) {
                    setActiveIndex((prev) => (prev + 1) % masters.length);
                }
            }, 3000);
        };
        startAuto();
        return () => {
            if (autoTimerRef.current) clearInterval(autoTimerRef.current);
            if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
        };
    }, [masters.length]);

    const pauseAutoAndResume = () => {
        isPaused.current = true;
        if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
        pauseTimerRef.current = setTimeout(() => {
            isPaused.current = false;
        }, 5000);
    };

    const goTo = (idx) => {
        setActiveIndex(idx);
        pauseAutoAndResume();
    };

    const goNext = () => {
        setActiveIndex((prev) => (prev + 1) % masters.length);
        pauseAutoAndResume();
    };

    const goPrev = () => {
        setActiveIndex((prev) => (prev - 1 + masters.length) % masters.length);
        pauseAutoAndResume();
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 30) {
            if (diff > 0) {
                goNext(); // Swipe left → next
            } else {
                goPrev(); // Swipe right → prev
            }
        }
    };

    const master = masters[activeIndex];

    return (
        <div className="masters-mobile-wrapper">
            <div className="masters-mobile-title-bar">
                <span className="masters-mobile-tag">Meet Our Masters</span>
            </div>

            <div
                className="masters-mobile-card-area"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{ touchAction: 'pan-y' }}
            >
                {/* Master Photo */}
                <div className="masters-mobile-photo-container" key={activeIndex}>
                    <img
                        src={master.src}
                        alt={master.name}
                        className="masters-mobile-photo"
                        draggable={false}
                    />
                </div>

                {/* Master Info */}
                <div className="masters-mobile-info" key={`info-${activeIndex}`}>
                    <span className="masters-mobile-number">
                        {String(activeIndex + 1).padStart(2, "0")} / {String(masters.length).padStart(2, "0")}
                    </span>
                    <h2 className="masters-mobile-name">{master.name}</h2>
                    <p className="masters-mobile-rank">{master.designation}</p>
                    {master.quote && (
                        <p className="masters-mobile-quote">&ldquo;{master.quote}&rdquo;</p>
                    )}
                </div>
            </div>

            {/* Left / Right arrows + Dots */}
            <div className="masters-mobile-nav">
                <button className="masters-mobile-arrow" onClick={goPrev} aria-label="Previous master">
                    ‹
                </button>
                <div className="masters-mobile-dots">
                    {masters.map((_, i) => (
                        <button
                            key={i}
                            className={`masters-mobile-dot ${i === activeIndex ? "active" : ""}`}
                            onClick={() => goTo(i)}
                            aria-label={`Go to master ${i + 1}`}
                        />
                    ))}
                </div>
                <button className="masters-mobile-arrow" onClick={goNext} aria-label="Next master">
                    ›
                </button>
            </div>

            <p className="masters-mobile-hint">Swipe or tap arrows</p>
        </div>
    );
};

// ─── Desktop: Full 3D Three.js Gallery (unchanged) ───
const MastersDesktopView = ({ masters }) => {
    const canvasRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef({ current: 0, target: 0 });
    const mouseRef = useRef({ x: 0, y: 0 });
    const snapTimerRef = useRef(null);
    const autoTimerRef = useRef(null);
    const idleTimerRef = useRef(null);
    const isUserScrolling = useRef(false);

    const slideCount = masters.length;
    const totalGalleryWidth = slideCount * CONFIG.spacingX;

    const snapToNearest = useCallback(() => {
        const index = Math.round(scrollRef.current.target / CONFIG.spacingX);
        scrollRef.current.target = index * CONFIG.spacingX;
    }, []);

    useEffect(() => {
        const container = canvasRef.current;
        if (!container) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xFFFDF5);
        scene.fog = new THREE.Fog(0xFFFDF5, 10, 110);

        const camera = new THREE.PerspectiveCamera(
            45,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, CONFIG.camZ);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambient);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
        dirLight.position.set(10, 20, 10);
        scene.add(dirLight);

        const galleryGroup = new THREE.Group();
        scene.add(galleryGroup);

        const textureLoader = new THREE.TextureLoader();
        const planeGeo = new THREE.PlaneGeometry(CONFIG.pWidth, CONFIG.pHeight);
        const paintingGroups = [];

        masters.forEach((master, i) => {
            const group = new THREE.Group();
            group.position.set(i * CONFIG.spacingX, 0, 0);

            const mat = new THREE.MeshBasicMaterial({
                map: textureLoader.load(master.src),
                side: THREE.FrontSide,
            });
            const mesh = new THREE.Mesh(planeGeo, mat);

            const edges = new THREE.EdgesGeometry(planeGeo);
            const outline = new THREE.LineSegments(
                edges,
                new THREE.LineBasicMaterial({ color: 0x222222 })
            );

            const shadowGeo = new THREE.PlaneGeometry(CONFIG.pWidth, CONFIG.pHeight);
            const shadowMat = new THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0.15,
            });
            const shadow = new THREE.Mesh(shadowGeo, shadowMat);
            shadow.position.set(0.8, -0.8, -0.5);

            const lineZ = -1;
            const lineLen = CONFIG.spacingX;
            const lineGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-lineLen / 2, 14, lineZ),
                new THREE.Vector3(lineLen / 2, 14, lineZ),
                new THREE.Vector3(-lineLen / 2, -14, lineZ),
                new THREE.Vector3(lineLen / 2, -14, lineZ),
            ]);
            const lines = new THREE.LineSegments(
                lineGeo,
                new THREE.LineBasicMaterial({ color: 0xdddddd })
            );

            group.add(shadow);
            group.add(mesh);
            group.add(outline);
            group.add(lines);
            galleryGroup.add(group);
            paintingGroups.push(group);
        });

        galleryGroup.rotation.y = CONFIG.wallAngleY;
        galleryGroup.position.x = 8;

        const currentSlideCount = masters.length;
        const currentTotalWidth = currentSlideCount * CONFIG.spacingX;

        const startAutoScroll = () => {
            if (autoTimerRef.current) clearInterval(autoTimerRef.current);
            autoTimerRef.current = setInterval(() => {
                if (!isUserScrolling.current) {
                    scrollRef.current.target += CONFIG.spacingX;
                }
            }, CONFIG.autoInterval);
        };

        const pauseAutoScroll = () => {
            isUserScrolling.current = true;
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            idleTimerRef.current = setTimeout(() => {
                isUserScrolling.current = false;
            }, CONFIG.idleResumeDelay);
        };

        startAutoScroll();

        const handleWheel = (e) => {
            pauseAutoScroll();
            scrollRef.current.target += e.deltaY * 0.1;
            if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
            snapTimerRef.current = setTimeout(snapToNearest, CONFIG.snapDelay);
        };

        let touchStart = 0;
        const handleTouchStart = (e) => {
            pauseAutoScroll();
            touchStart = e.touches[0].clientX;
            if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
        };
        const handleTouchMove = (e) => {
            const diff = touchStart - e.touches[0].clientX;
            scrollRef.current.target += diff * 0.6;
            touchStart = e.touches[0].clientX;
            if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
        };
        const handleTouchEnd = () => {
            snapToNearest();
        };
        const handleMouseMove = (e) => {
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };

        container.addEventListener("wheel", handleWheel, { passive: true });
        container.addEventListener("touchstart", handleTouchStart);
        container.addEventListener("touchmove", handleTouchMove);
        container.addEventListener("touchend", handleTouchEnd);
        window.addEventListener("mousemove", handleMouseMove);

        let animId;
        const animate = () => {
            animId = requestAnimationFrame(animate);

            scrollRef.current.current +=
                (scrollRef.current.target - scrollRef.current.current) * CONFIG.lerpSpeed;

            const xMove = scrollRef.current.current * Math.cos(CONFIG.wallAngleY);
            const zMove = scrollRef.current.current * Math.sin(CONFIG.wallAngleY);
            camera.position.x = xMove;
            camera.position.z = CONFIG.camZ - zMove;

            paintingGroups.forEach((group, i) => {
                const originalX = i * CONFIG.spacingX;
                const distFromCam = scrollRef.current.current - originalX;
                const shift =
                    Math.round(distFromCam / currentTotalWidth) * currentTotalWidth;
                group.position.x = originalX + shift;
            });

            camera.rotation.x = mouseRef.current.y * 0.05;
            camera.rotation.y = -mouseRef.current.x * 0.05;

            const rawIndex = Math.round(
                scrollRef.current.current / CONFIG.spacingX
            );
            const safeIndex =
                ((rawIndex % currentSlideCount) + currentSlideCount) % currentSlideCount;
            setActiveIndex(safeIndex);

            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(animId);
            container.removeEventListener("wheel", handleWheel);
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
            container.removeEventListener("touchend", handleTouchEnd);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
            if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
            if (autoTimerRef.current) clearInterval(autoTimerRef.current);
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [masters, snapToNearest]);

    return (
        <div className="masters-gallery-wrapper">
            <div className="masters-gallery-title">Meet Our Masters</div>
            <div ref={canvasRef} style={{ width: "100%", height: "100%" }} />

            {masters.map((master, i) => (
                <div
                    key={master.id}
                    className={`masters-slide-content ${i === activeIndex ? "active" : ""}`}
                >
                    <span className="catalogue-number">
                        {String(i + 1).padStart(2, "0")} / Masters
                    </span>
                    <h1>
                        {master.name.replace("Master ", "").split(" ")[0]}
                        <br />
                        {master.name.replace("Master ", "").split(" ").slice(1).join(" ")}
                    </h1>
                    <div className="description">&ldquo;{master.quote}&rdquo;</div>
                    <div className="meta-grid">
                        <span className="meta-label">Name</span>
                        <span className="meta-value">{master.name}</span>
                        <span className="meta-label">Rank</span>
                        <span className="meta-value">{master.designation}</span>
                    </div>
                </div>
            ))}

            <div className="masters-scroll-hint">Scroll to explore</div>
        </div>
    );
};

// ─── Main Component: switches between mobile/desktop ───
const MastersGallery3D = () => {
    const [masters, setMasters] = useState([]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check screen width
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        const fetchMasters = async () => {
            try {
                const res = await fetch('/api/admin/masters');
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) setMasters(data);
            } catch {
                // Silent fallback
            }
        };
        fetchMasters();
    }, []);

    if (masters.length === 0) {
        return (
            <div className="masters-gallery-wrapper">
                <div className="masters-gallery-title">Meet Our Masters</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
                    Loading masters...
                </div>
            </div>
        );
    }

    // Mobile: clean card slider | Desktop: 3D gallery
    if (isMobile) {
        return <MastersMobileView masters={masters} />;
    }

    return <MastersDesktopView masters={masters} />;
};

export default MastersGallery3D;
