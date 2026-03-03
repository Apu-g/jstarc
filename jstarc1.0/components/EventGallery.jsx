"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Download, Share2, Home } from "lucide-react";

// Taekwondo-themed loading animation
const TaekwondoLoader = () => (
    <div className="h-full flex flex-col items-center justify-center gap-8">
        {/* Animated kicking figure */}
        <div className="relative w-32 h-32">
            {/* Outer ring - spins */}
            <div
                className="absolute inset-0 rounded-full border-[3px] border-transparent"
                style={{
                    borderTopColor: '#FBFF48',
                    borderRightColor: '#FF2A2A',
                    animation: 'spin 1s linear infinite',
                }}
            />
            {/* Inner ring - spins opposite */}
            <div
                className="absolute inset-3 rounded-full border-[3px] border-transparent"
                style={{
                    borderBottomColor: '#3B82F6',
                    borderLeftColor: '#FF70A6',
                    animation: 'spin 0.8s linear infinite reverse',
                }}
            />
            {/* Center icon — 🥋 belt symbol */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl" style={{ animation: 'pulse-scale 1.5s ease-in-out infinite' }}>🥋</span>
            </div>
        </div>

        {/* Text */}
        <div className="text-center">
            <p className="text-white font-bold text-lg tracking-wide mb-2" style={{ animation: 'pulse-opacity 1.5s ease-in-out infinite' }}>
                Loading Gallery
            </p>
            <div className="flex justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#FBFF48]" style={{ animation: 'bounce-dot 1.2s ease-in-out infinite' }} />
                <span className="w-2 h-2 rounded-full bg-[#FF2A2A]" style={{ animation: 'bounce-dot 1.2s ease-in-out 0.2s infinite' }} />
                <span className="w-2 h-2 rounded-full bg-[#3B82F6]" style={{ animation: 'bounce-dot 1.2s ease-in-out 0.4s infinite' }} />
            </div>
        </div>

        {/* Inline keyframes */}
        <style jsx>{`
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            @keyframes pulse-scale {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.15); }
            }
            @keyframes pulse-opacity {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            @keyframes bounce-dot {
                0%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-8px); }
            }
        `}</style>
    </div>
);

// Preload all images and return a promise that resolves when all are loaded
function preloadImages(urls) {
    return Promise.all(
        urls.map(
            (url) =>
                new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => resolve(url);
                    img.onerror = () => resolve(url); // still resolve to show the grid
                    img.src = url;
                })
        )
    );
}

const EventGallery = ({ event, onClose }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    useEffect(() => {
        const fetchAndPreload = async () => {
            if (!event?.folder) {
                setImages([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const res = await fetch(`/api/events/images?folder=${event.folder}`);
                const data = await res.json();
                const urls = data.images || [];

                if (urls.length > 0) {
                    // Preload ALL images before showing
                    await preloadImages(urls);
                    setImages(urls);
                } else {
                    setImages([]);
                }
            } catch {
                setImages([]);
            } finally {
                setLoading(false);
            }
        };

        if (event) {
            document.body.style.overflow = "hidden";
            fetchAndPreload();
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [event]);

    const handleNext = useCallback(() => {
        setSelectedImageIndex((prev) =>
            prev === null ? null : (prev + 1) % images.length
        );
    }, [images.length]);

    const handlePrev = useCallback(() => {
        setSelectedImageIndex((prev) =>
            prev === null ? null : (prev - 1 + images.length) % images.length
        );
    }, [images.length]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedImageIndex === null) {
                if (e.key === "Escape") onClose();
            } else {
                if (e.key === "Escape") setSelectedImageIndex(null);
                if (e.key === "ArrowRight") handleNext();
                if (e.key === "ArrowLeft") handlePrev();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedImageIndex, onClose, handleNext, handlePrev]);

    const scrollAreaRef = useRef(null);

    if (!event) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col"
            onWheel={(e) => {
                // Redirect wheel events to the gallery scroll area
                if (scrollAreaRef.current) {
                    scrollAreaRef.current.scrollTop += e.deltaY;
                }
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 bg-black/50 z-20">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 text-white transition-colors min-h-12 min-w-12"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                            <Home size={12} />
                            <span>/</span>
                            <span>Events</span>
                            <span>/</span>
                            <span className="text-white">{event.title}</span>
                        </div>
                        <h2 className="text-xl font-bold text-white">{event.title}</h2>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/10 text-white transition-colors min-h-12 min-w-12"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Gallery Content — scrollbar hidden but scrollable */}
            <div ref={scrollAreaRef} className="gallery-scroll-area flex-1 overflow-y-scroll p-4 md:p-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style>{`
                    .gallery-scroll-area::-webkit-scrollbar { display: none; }
                `}</style>
                {loading ? (
                    <TaekwondoLoader />
                ) : images.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4 mx-auto max-w-7xl"
                    >
                        {images.map((src, index) => (
                            <motion.div
                                key={src}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.6) }}
                                className="break-inside-avoid relative group rounded-xl overflow-hidden cursor-zoom-in bg-white/5 will-change-transform"
                                onClick={() => setSelectedImageIndex(index)}
                            >
                                <img
                                    src={src}
                                    alt={`Event photo ${index + 1}`}
                                    className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105 will-change-transform"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <p className="text-lg">No photos found for this event.</p>
                        <p className="text-sm opacity-50">Folder: {event.folder}</p>
                    </div>
                )}
            </div>

            {/* Lightbox Overlay */}
            <AnimatePresence>
                {selectedImageIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] bg-black/98 flex items-center justify-center"
                        onClick={() => setSelectedImageIndex(null)}
                    >
                        {/* Lightbox Controls */}
                        <button
                            className="absolute top-4 right-4 p-3 text-white/70 hover:text-white z-50 min-h-12 min-w-12"
                            onClick={() => setSelectedImageIndex(null)}
                        >
                            <X size={32} />
                        </button>

                        <button
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-50 md:flex hidden min-h-12 min-w-12"
                            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                        >
                            <ChevronLeft size={32} />
                        </button>

                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-50 md:flex hidden min-h-12 min-w-12"
                            onClick={(e) => { e.stopPropagation(); handleNext(); }}
                        >
                            <ChevronRight size={32} />
                        </button>

                        {/* Image Container */}
                        <motion.div
                            className="relative max-w-full max-h-full p-4 flex items-center justify-center touch-none"
                            onClick={(e) => e.stopPropagation()}
                            key={selectedImageIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={(e, { offset }) => {
                                const swipe = offset.x;
                                if (swipe < -50) {
                                    handleNext();
                                } else if (swipe > 50) {
                                    handlePrev();
                                }
                            }}
                        >
                            <img
                                src={images[selectedImageIndex]}
                                alt="Full screen preview"
                                className="max-w-[95vw] max-h-[80vh] object-contain rounded-lg shadow-2xl pointer-events-none select-none"
                            />

                            {/* Mobile Hint */}
                            <div className="absolute top-full mt-4 md:hidden text-white/50 text-xs animate-pulse">
                                Swipe to navigate
                            </div>

                            {/* Toolbar */}
                            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                                <a
                                    href={images[selectedImageIndex]}
                                    download
                                    className="p-2 hover:text-neon-blue text-white transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Download size={20} />
                                </a>
                                <button
                                    className="p-2 hover:text-neon-purple text-white transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (navigator.share) {
                                            navigator.share({
                                                title: event.title,
                                                url: window.location.origin + images[selectedImageIndex]
                                            });
                                        }
                                    }}
                                >
                                    <Share2 size={20} />
                                </button>
                                <span className="text-white/50 text-sm border-l border-white/20 pl-4">
                                    {selectedImageIndex + 1} / {images.length}
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default EventGallery;
