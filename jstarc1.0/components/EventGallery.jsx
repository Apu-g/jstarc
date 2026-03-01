"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Download, Share2, Loader2, Home } from "lucide-react";

const EventGallery = ({ event, onClose }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            if (!event?.folder) {
                setImages([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const res = await fetch(`/api/events/images?folder=${event.folder}`);
                const data = await res.json();
                if (data.images) {
                    setImages(data.images);
                } else {
                    setImages([]);
                }
            } catch (error) {
                console.error("Failed to load images:", error);
            } finally {
                setLoading(false);
            }
        };

        if (event) {
            document.body.style.overflow = "hidden";
            fetchImages();
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

    if (!event) return null;

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 bg-black/50 z-20">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
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
                    className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Gallery Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-12 h-12 text-neon-purple animate-spin" />
                        <p className="text-slate-400 animate-pulse">Loading gallery...</p>
                    </div>
                ) : images.length > 0 ? (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4 mx-auto max-w-7xl">
                        {images.map((src, index) => (
                            <motion.div
                                key={src}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
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
                    </div>
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
                            className="absolute top-4 right-4 p-3 text-white/70 hover:text-white z-50"
                            onClick={() => setSelectedImageIndex(null)}
                        >
                            <X size={32} />
                        </button>

                        <button 
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-50 md:flex hidden"
                            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                        >
                            <ChevronLeft size={32} />
                        </button>

                        <button 
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-50 md:flex hidden"
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
                            onDragEnd={(e, { offset, velocity }) => {
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
