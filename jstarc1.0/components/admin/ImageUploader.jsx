
"use client";

import { useState, useCallback } from "react";
// `react-dropzone` not required: component uses native drag/drop and file input
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageUploader({ onUpload, isUploading = false }) {
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        // Add file validation here if needed
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        // In a real app, we would pass the file to the parent or upload here
        if (onUpload) {
            onUpload(file);
        }
    };

    const clearFile = () => {
        setPreview(null);
    };

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {!preview ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`
                relative h-64 rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out
                flex flex-col items-center justify-center text-center p-6 cursor-pointer
                ${dragActive
                                ? "border-blue-500 bg-blue-50/50 scale-[1.02]"
                                : "border-slate-200 hover:border-blue-400 hover:bg-slate-50"}
                `}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleChange}
                            accept="image/*"
                        />
                        <div className="bg-blue-100 p-4 rounded-full mb-4 text-blue-600">
                            <Upload size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">Click or Drag & Drop to Upload</h3>
                        <p className="text-sm text-slate-400 mt-2">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative h-64 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900"
                    >
                        <img src={preview} alt="Preview" className="w-full h-full object-contain opacity-80" />

                        {isUploading ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm text-white">
                                <Loader2 size={32} className="animate-spin mb-2" />
                                <p className="font-medium">Uploading...</p>
                            </div>
                        ) : (
                            <button
                                onClick={clearFile}
                                className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-transform hover:scale-110"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
