
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import { toast } from "sonner";

export default function GalleryManager() {
    const [images, setImages] = useState([
        { id: 1, url: "https://images.unsplash.com/photo-1531297461136-82lw9z1.jpg" },
        { id: 2, url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b.jpg" },
        { id: 3, url: "https://images.unsplash.com/photo-1518770660439-4636190af475.jpg" },
    ]);
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (file) => {
        setIsUploading(true);
        // Simulate upload
        setTimeout(() => {
            const newImage = {
                id: Date.now(),
                url: URL.createObjectURL(file)
            };
            setImages([newImage, ...images]);
            setIsUploading(false);
            toast.success("Image uploaded successfully!");
        }, 1500);
    };

    const handleDelete = (id) => {
        setImages(images.filter(img => img.id !== id));
        toast.success("Image deleted");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Gallery Manager</h1>
                    <p className="text-slate-500">Manage images for the homepage marquee.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Section */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-lg font-bold mb-4">Add New Image</h2>
                        <ImageUploader onUpload={handleUpload} isUploading={isUploading} />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm">
                        <p className="font-semibold mb-1">💡 Pro Tip</p>
                        Images should be landscape orientation for best results in the marquee.
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
                        <h2 className="text-lg font-bold mb-4">Current Images ({images.length})</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <AnimatePresence>
                                {images.map((img) => (
                                    <motion.div
                                        key={img.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                                        className="group relative aspect-video rounded-xl overflow-hidden bg-slate-100"
                                    >
                                        <img src={img.url} alt="Gallery" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleDelete(img.id)}
                                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                title="Delete Image"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
