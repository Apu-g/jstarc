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

const MastersGallery3D = () => {
    const canvasRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [masters, setMasters] = useState([]);
    const scrollRef = useRef({ current: 0, target: 0 });
    const mouseRef = useRef({ x: 0, y: 0 });
    const snapTimerRef = useRef(null);
    const autoTimerRef = useRef(null);
    const idleTimerRef = useRef(null);
    const isUserScrolling = useRef(false);

    // Fetch masters from API
    useEffect(() => {
        fetch('/api/admin/masters')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) setMasters(data);
            })
            .catch(err => console.error('Failed to fetch masters:', err));
    }, []);

    const slideCount = masters.length;
    const totalGalleryWidth = slideCount * CONFIG.spacingX;

    const snapToNearest = useCallback(() => {
        const index = Math.round(scrollRef.current.target / CONFIG.spacingX);
        scrollRef.current.target = index * CONFIG.spacingX;
    }, []);

    useEffect(() => {
        if (masters.length === 0) return;
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

export default MastersGallery3D;
