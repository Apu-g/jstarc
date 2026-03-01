"use client";

import { motion } from "framer-motion";
import GradientText from "./GradientText";

export const Hero = () => {
    return (
        <section id="home" className="relative w-full h-screen overflow-hidden flex items-center justify-center">

            {/* Main Content */}
            <div className="relative z-30 container mx-auto px-6 text-center">

                <div className="flex flex-col items-center">
                    {/* Innovative Staggered Text */}
                    <div className="mb-6 flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        >
                            <GradientText
                                colors={["#00f3ff", "#bc13fe", "#00f3ff", "#bc13fe"]}
                                animationSpeed={4}
                                showBorder={false}
                                className="text-6xl md:text-8xl font-black drop-shadow-[0_0_15px_rgba(0,243,255,0.3)] uppercase tracking-tight"
                            >
                                JSTARC
                            </GradientText>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                            className="-mt-2 md:-mt-4"
                        >
                            <GradientText
                                colors={["#ffffff", "#94a3b8", "#ffffff", "#94a3b8"]}
                                animationSpeed={6}
                                showBorder={false}
                                className="text-6xl md:text-8xl font-black drop-shadow-sm uppercase tracking-tight text-glow"
                            >
                                BENGALURU
                            </GradientText>
                        </motion.div>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.5, duration: 1.2, ease: "easeOut" }}
                        className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-light tracking-wide mb-10"
                    >
                        Master the Art of <span className="text-neon-blue font-semibold text-glow-blue">Self Defense</span>
                    </motion.p>

                    {/* CTA Button */}
                    <motion.a
                        href="#contact"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.8, duration: 0.8 }}
                        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 243, 255, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        className="relative px-12 py-4 bg-transparent text-white text-lg font-bold rounded-xl border border-neon-blue/50 overflow-hidden group uppercase tracking-widest"
                    >
                        <div className="absolute inset-0 bg-neon-blue/10 group-hover:bg-neon-blue/20 transition-all duration-300"></div>
                        <span className="relative z-10 drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]">Join Today</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    </motion.a>
                </div>
            </div>

            {/* Scroll Down Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 2.5, duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 z-30"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white to-transparent mx-auto" />
                <span className="text-[10px] uppercase tracking-[0.2em] mt-2 block backdrop-blur-sm">Scroll</span>
            </motion.div>

        </section>
    );
};
