"use client";

import { motion } from "framer-motion";
import LogoLoop from './LogoLoop';
import { useIsMobile } from "@/hooks/use-mobile";

const brands = [
    "/assets/logos/powerbrand1.jpg",
    "/assets/logos/powerbrand2.jpg",
    "/assets/logos/powerbrand3.jpg",
    "/assets/logos/powerbrand4.png",
    "/assets/logos/powerbrand5.png",
];

export const PowerBrands = () => {
    const isMobile = useIsMobile();

    // Format logos for LogoLoop
    const logoItems = brands.map((src, index) => ({
        src,
        alt: `Powerbrand ${index + 1}`,
        // Add styling for internal logo rendering if needed, 
        // but LogoLoop handles images directly via 'src' prop in items
    }));

    return (
        <section className="py-8 md:py-12 relative border-b border-black/10 bg-[#FFFDF5] isolate z-10">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    className="text-center mb-6 md:mb-8"
                >
                    <h2 className="text-2xl md:text-4xl font-bold text-[#121212] mb-3 md:mb-4">Powerbrands</h2>
                    <div className="w-16 md:w-24 h-1 bg-[#121212] mx-auto" />
                </motion.div>

                <div className="max-w-4xl mx-auto bg-white border-3 border-black shadow-hard p-4 md:p-8 hover:shadow-hard-lg transition-shadow duration-300">
                    <LogoLoop
                        logos={logoItems}
                        speed={100}
                        direction="left"
                        logoHeight={isMobile ? 40 : 80} // Scaled down for mobile
                        gap={isMobile ? 30 : 60}
                        pauseOnHover={true}
                        width="100%" // Container controls width
                        className="opacity-90 hover:opacity-100 transition-all duration-500"
                    />
                </div>
            </div>
        </section>
    );
};
