"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ScrambledText from "@/components/ui/scrambled-text";

// Center image - the girl doing the kick
const centerImage = "/assets/central-master-kick.png";

// Single orbiting satellite component with 3D depth effect
const OrbitingSatellite = ({ image, index, total, angle, radius }) => {
    // Calculate position based on current angle
    const itemAngle = angle + (index / total) * Math.PI * 2;

    // X position on the ellipse
    const x = Math.cos(itemAngle) * radius;

    // Y position - compressed for 3D perspective effect
    const y = Math.sin(itemAngle) * (radius * 0.35);

    // Z-depth simulation: items at top of orbit (sin > 0) are "behind", bottom are "in front"
    const depth = Math.sin(itemAngle);

    // Scale based on depth - larger when in front (bottom), smaller when behind (top)
    const scale = 0.6 + (depth + 1) * 0.3; // Range: 0.6 to 1.2

    // Opacity based on depth - more visible in front, fade when behind
    const opacity = 0.3 + (depth + 1) * 0.35; // Range: 0.3 to 1.0

    // Z-index: items in front should be on top
    const zIndex = Math.round((depth + 1) * 10) + 10;

    return (
        <motion.div
            className="absolute rounded-full overflow-hidden border-2 border-gray-300 bg-gray-100"
            style={{
                width: 70,
                height: 70,
                left: "50%",
                top: "50%",
                x: x - 35,
                y: y - 35,
                scale,
                opacity,
                zIndex,
            }}
        >
            <img
                src={image}
                alt={`Team member ${index + 1}`}
                className="w-full h-full object-cover"
            />
        </motion.div>
    );
};

export const DemoTeam = () => {
    const [angle, setAngle] = useState(0);
    const [dynamicOrbitImages, setDynamicOrbitImages] = useState([]);
    const [radius, setRadius] = useState(200);

    useEffect(() => {
        fetch('/api/marquee')
            .then(res => res.json())
            .then(data => {
                if (data?.files?.length > 0) {
                    const photos = data.files.map(f => f.src).filter(Boolean);
                    // Shuffle and select up to 8 random photos
                    const shuffled = [...photos].sort(() => 0.5 - Math.random());
                    setDynamicOrbitImages(shuffled.slice(0, 8));
                }
            })
            .catch(err => console.error("Failed to load demo team photos", err));

        // Responsive Radius Support
        const handleResize = () => setRadius(window.innerWidth < 768 ? 140 : 200);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Continuous rotation animation
    useEffect(() => {
        const duration = 20000; // 20 seconds for full rotation
        let startTime = Date.now();
        let animationFrame;

        const animateOrbit = () => {
            const elapsed = Date.now() - startTime;
            const progress = (elapsed % duration) / duration;
            setAngle(progress * Math.PI * 2);
            animationFrame = requestAnimationFrame(animateOrbit);
        };

        animationFrame = requestAnimationFrame(animateOrbit);

        return () => cancelAnimationFrame(animationFrame);
    }, []);

    return (
        <section className="py-12 md:py-20 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Content - Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-gray-900 leading-[0.9] mb-6">
                            <ScrambledText text="JSTARC" as="span" className="block" />
                            <ScrambledText text="BENGALURU" as="span" className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-gray-900 to-gray-700" />
                            <ScrambledText text="DEMONSTRATION" as="span" className="block" />
                            <ScrambledText text="TEAM" as="span" className="block" />
                        </h2>
                        <p className="text-xl text-gray-600 max-w-lg mb-8 border-l-4 border-gray-900 pl-6">
                            Mastery, Discipline, and the Future of Martial Arts.
                        </p>
                    </motion.div>

                    {/* Right Content - Electron Orbit Animation */}
                    <div className="relative flex items-center justify-center min-h-[500px]">

                        {/* Center Image - The Girl */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                            className="relative z-30 w-52 h-52 md:w-72 md:h-72 rounded-full border-4 border-gray-200 shadow-2xl overflow-hidden"
                            style={{
                                boxShadow: "0 0 60px rgba(0,0,0,0.08), 0 0 100px rgba(239,68,68,0.05)"
                            }}
                        >
                            <img
                                src={centerImage}
                                alt="Demo Team Center"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>

                        {/* Orbiting Satellites */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {dynamicOrbitImages.map((img, index) => (
                                <OrbitingSatellite
                                    key={index}
                                    image={img}
                                    index={index}
                                    total={dynamicOrbitImages.length}
                                    angle={angle}
                                    radius={radius}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
