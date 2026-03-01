"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import FocusModeOverlay from "@/components/FocusModeOverlay";
import { SparklesText } from "@/components/ui/sparkles-text";

const beltColors = {
    "White": "#e5e7eb",
    "Yellow": "#facc15",
    "Green": "#22c55e",
    "Blue": "#3b82f6",
    "Red": "#ef4444",
    "Black": "#1a1a1a",
    "Black Belt": "#1a1a1a",
    "Red Belt": "#ef4444"
};

const getBeltColor = (rank) => {
    if (!rank) return beltColors["Black"];
    for (const key of Object.keys(beltColors)) {
        if (rank.includes(key)) return beltColors[key];
    }
    return beltColors["Black"];
};

const ParticleDust = () => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const newParticles = Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 1,
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 10,
            opacity: Math.random() * 0.3 + 0.1
        }));
        setTimeout(() => setParticles(newParticles), 0);
    }, []);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-gray-300 will-change-transform"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        opacity: p.opacity
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [p.opacity, p.opacity * 1.2, p.opacity],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    );
};

const ConstellationNode = ({ member, xPos, yPos, isActive, onFocus }) => {
    const color = getBeltColor(member.rank);
    const [isHovered, setIsHovered] = useState(false);
    const [isSparkling, setIsSparkling] = useState(false);

    // Active state is either scrolled-to (isActive) or hovered
    const isActiveState = isActive || isHovered;

    // Determine info panel position: if node is on right (xPos > 0), show panel on left. And vice versa.
    const isRightSide = xPos > 0;

    useEffect(() => {
        if (isActive) {
            const startTimer = setTimeout(() => setIsSparkling(true), 0);
            const endTimer = setTimeout(() => setIsSparkling(false), 1500);
            return () => {
                clearTimeout(startTimer);
                clearTimeout(endTimer);
            };
        }
    }, [isActive]);

    const handleClick = () => {
        setIsSparkling(true);
        setTimeout(() => setIsSparkling(false), 1500);
        onFocus(member);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        setIsSparkling(true);
        setTimeout(() => setIsSparkling(false), 1500);
    };

    return (
        <motion.div
            className="absolute w-full flex justify-center will-change-transform z-20"
            style={{ top: yPos }}
            initial={{ opacity: 0 }}
            animate={{
                opacity: 1,
                zIndex: isHovered ? 50 : (isActive ? 40 : 20)
            }}
            transition={{ duration: 0.5 }}
        >
            <div
                className="relative flex items-center justify-center"
                style={{
                    transform: `translateX(${xPos}px)`,
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Node Container */}
                <motion.div
                    className="relative group cursor-pointer will-change-transform"
                    onClick={handleClick}
                    animate={{
                        scale: isActiveState ? 1.2 : 1,
                    }}
                    whileHover={{ scale: 1.25 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    {/* Pulsing Glow (Active/Hovered) */}
                    {isActiveState && (
                        <motion.div
                            className="absolute -inset-8 rounded-full blur-xl opacity-40 pointer-events-none"
                            style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}
                            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    )}

                    {/* Sparkles Effect */}
                    {isSparkling && (
                        <div className="absolute inset-[-40%] z-50 pointer-events-none">
                            <SparklesText sparklesCount={8} colors={{ first: "#333", second: "#666" }} className="w-full h-full" />
                        </div>
                    )}

                    {/* Node Image Circle */}
                    <div
                        className="relative w-24 h-24 md:w-32 md:h-32 rounded-full p-[2px] transition-all duration-300 bg-gray-100 overflow-hidden"
                        style={{
                            boxShadow: isActiveState ? `0 0 20px rgba(0,0,0,0.2), 0 0 40px rgba(0,0,0,0.1)` : '0 0 15px rgba(0,0,0,0.05)',
                            border: `4px solid ${isActiveState ? '#1a1a1a' : 'rgba(0,0,0,0.15)'}`
                        }}
                    >
                        <motion.img
                            layoutId={`image-${member.id}`}
                            src={member.img}
                            alt={member.name}
                            className="w-full h-full object-cover transition-all duration-500"
                            style={{
                                filter: isActiveState ? "grayscale(0%)" : "grayscale(100%) brightness(0.85)",
                                objectPosition: member.facePos || "center top"
                            }}
                            transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
                        />
                    </div>
                </motion.div>

                {/* Occurrence Indicator / Info Panel */}
                <AnimatePresence>
                    {isActiveState && (
                        <>
                            {/* Desktop Info Panel */}
                            <motion.div
                                initial={{ opacity: 0, x: isRightSide ? 20 : -20, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: isRightSide ? 20 : -20, scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                onClick={handleClick}
                                className={cn(
                                    "absolute top-1/2 -translate-y-1/2 w-64 pointer-events-none md:pointer-events-auto hidden md:block cursor-pointer transition-colors",
                                    isRightSide ? "right-full mr-6 text-right" : "left-full ml-6 text-left"
                                )}
                            >
                                <h4 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h4>
                                <p className="text-sm uppercase tracking-[0.2em] font-bold opacity-90" style={{ color }}>{member.rank}</p>
                                {member.desc && <p className="text-gray-600 text-sm mt-2 font-medium opacity-80">{member.desc}</p>}
                            </motion.div>

                            {/* Mobile Info Panel (Below the Node) */}
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                onClick={handleClick}
                                className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-64 text-center md:hidden pointer-events-auto z-50 bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-gray-200 shadow-lg"
                            >
                                <h4 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h4>
                                <p className="text-xs uppercase tracking-[0.2em] font-bold opacity-90" style={{ color }}>{member.rank}</p>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export const ConstellationTeam = ({ members }) => {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 1000, height: 800 });
    const [activeIndex, setActiveIndex] = useState(0);
    const [focusedMember, setFocusedMember] = useState(null);

    // Spacing configuration
    const NODE_SPACING = 300;
    const TOTAL_HEIGHT = members.length * NODE_SPACING + 400;

    // Update dimensions on resize
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: TOTAL_HEIGHT
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, [TOTAL_HEIGHT]);

    // Calculate node positions (Sine Wave)
    const nodePositions = useMemo(() => {
        return members.map((_, i) => {
            const isDesktop = dimensions.width > 768;
            const baseAmp = isDesktop ? Math.min(dimensions.width * 0.18, 220) : Math.min(dimensions.width * 0.14, 110);
            const side = i % 2 === 0 ? -1 : 1;
            const wobble = Math.sin(i * 0.9) * (baseAmp * 0.18);
            const x = side * baseAmp + wobble;
            const y = i * NODE_SPACING + 200; // Start offset
            return { x, y };
        });
    }, [members, dimensions, NODE_SPACING]);

    // Generate SVG Path
    const pathD = useMemo(() => {
        if (nodePositions.length === 0) return "";
        let d = `M ${dimensions.width / 2 + nodePositions[0].x} ${nodePositions[0].y}`;
        for (let i = 0; i < nodePositions.length - 1; i++) {
            const curr = nodePositions[i];
            const next = nodePositions[i + 1];
            const p1 = { x: dimensions.width / 2 + curr.x, y: curr.y };
            const p2 = { x: dimensions.width / 2 + next.x, y: next.y };
            const cp1 = { x: p1.x, y: (p1.y + p2.y) / 2 };
            const cp2 = { x: p2.x, y: (p1.y + p2.y) / 2 };
            d += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${p2.x} ${p2.y}`;
        }
        return d;
    }, [nodePositions, dimensions]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Sync active index with scroll
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const scrollPx = latest * (TOTAL_HEIGHT - window.innerHeight);
        const centerOffset = window.innerHeight / 2;
        const currentY = scrollPx + centerOffset;

        let closestIndex = 0;
        let minDiff = Infinity;

        nodePositions.forEach((pos, index) => {
            const diff = Math.abs(pos.y - currentY);
            if (diff < minDiff) {
                minDiff = diff;
                closestIndex = index;
            }
        });

        if (closestIndex !== activeIndex) {
            setActiveIndex(closestIndex);
        }
    });

    const focusedIndex = focusedMember ? members.findIndex(m => m.id === focusedMember.id) : -1;

    return (
        <section
            className="relative w-full bg-transparent"
            style={{ height: TOTAL_HEIGHT }}
        >
            <AnimatePresence>
                {focusedMember && (
                    <FocusModeOverlay
                        member={focusedMember}
                        index={focusedIndex}
                        onClose={() => setFocusedMember(null)}
                    />
                )}
            </AnimatePresence>

            {/* Background Layers - Seamless Blend */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-100/40 to-transparent pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* Top and Bottom Feathering for extra smoothness */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-transparent to-transparent z-10 pointer-events-none" />

            <ParticleDust />

            <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden">
                {/* Header */}
                <div className="absolute top-20 left-0 w-full text-center z-20 pointer-events-none">
                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter mb-2">
                        Black Belts
                    </h2>
                    <p className="text-gray-500 uppercase tracking-[0.3em] text-sm font-light">
                        Rising Stars
                    </p>
                </div>

                {/* SVG Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <defs>
                        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="transparent" />
                            <stop offset="10%" stopColor="rgba(0, 0, 0, 0.2)" />
                            <stop offset="50%" stopColor="rgba(0, 0, 0, 0.5)" />
                            <stop offset="90%" stopColor="rgba(0, 0, 0, 0.2)" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                        <filter id="glowLine">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Background Trace Line */}
                    <path
                        d={pathD}
                        fill="none"
                        stroke="rgba(0, 0, 0, 0.08)"
                        strokeWidth="1"
                    />

                    {/* Animated Drawing Line - Synced with scroll */}
                    <motion.path
                        d={pathD}
                        fill="none"
                        stroke="url(#pathGradient)"
                        strokeWidth="3"
                        filter="url(#glowLine)"
                        style={{ pathLength: scrollYProgress }}
                        strokeLinecap="round"
                    />
                </svg>

                {/* Nodes */}
                {members.map((member, index) => (
                    <ConstellationNode
                        key={member.id}
                        member={member}
                        xPos={nodePositions[index]?.x || 0}
                        yPos={nodePositions[index]?.y || 0}
                        isActive={index === activeIndex}
                        onFocus={setFocusedMember}
                    />
                ))}
            </div>
        </section>
    );
};

export default ConstellationTeam;