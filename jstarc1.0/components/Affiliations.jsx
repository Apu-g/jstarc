"use client";

import { motion } from "framer-motion";

const affiliations = [
    "/assets/logos/affiliated1.jpg",
    "/assets/logos/affiliated2.jpg",
    "/assets/logos/affiliated3.jpg",
    "/assets/logos/affiliated4.jpg",
];

export const Affiliations = () => {
    return (
        <section className="py-8 md:py-12 relative overflow-hidden bg-[#FFFDF5] isolate z-10">
            {/* Background Decoration */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    className="text-center mb-6 md:mb-8"
                >
                    <h2 className="text-2xl md:text-4xl font-bold text-[#121212] mb-3 md:mb-4">Affiliated To</h2>
                    <div className="w-16 md:w-24 h-1 bg-[#121212] mx-auto" />
                </motion.div>

                <div className="flex flex-nowrap justify-between gap-2 md:justify-center md:gap-12 overflow-x-auto md:overflow-visible">
                    {affiliations.map((src, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative w-16 h-16 sm:w-24 sm:h-24 md:w-56 md:h-56 flex-shrink-0 flex items-center justify-center p-1 md:p-6 bg-white border-3 border-black shadow-hard hover:-translate-y-1 hover:shadow-hard-lg transition-all duration-300"
                        >
                            {/* Glass Reflection */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl md:rounded-2xl pointer-events-none" />

                            {/* Logo Container */}
                            <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-white p-1 md:p-4">
                                <img
                                    src={src}
                                    alt={`Affiliation ${index + 1}`}
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
