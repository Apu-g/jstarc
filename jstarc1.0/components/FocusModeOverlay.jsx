"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award, Instagram, Youtube } from "lucide-react";

const beltColors = {
    "White": "#e5e7eb",
    "Yellow": "#facc15",
    "Green": "#22c55e",
    "Blue": "#3b82f6",
    "Red": "#ef4444",
    "Black": "#7c3aed",
    "Black Belt": "#7c3aed",
    "Red Belt": "#ef4444",
    "5th Dan Black Belt": "#7c3aed",
    "4th Dan Black Belt": "#7c3aed",
    "Senior Instructor": "#ef4444",
    "Instructor": "#3b82f6"
};

const getBeltColor = (rank) => {
    if (!rank) return beltColors["Black"];
    for (const key of Object.keys(beltColors)) {
        if (rank.includes(key)) return beltColors[key];
    }
    return beltColors["Black"];
};

const enrichMemberData = (member) => ({
    ...member,
    bio: member.bio || `A dedicated martial artist with a passion for excellence. ${member.name} has shown remarkable growth and technical proficiency.`,
    achievements: member.achievements || [],
});

const FocusModeOverlay = ({ member, index, onClose }) => {
    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = "auto"; };
    }, []);

    if (!member) return null;

    const color = getBeltColor(member.rank);
    const enrichedMember = enrichMemberData(member);
    const isEven = index % 2 === 0;

    return (
        <motion.div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 bg-black/95 backdrop-blur-xl will-change-opacity"
                onClick={onClose}
            />

            <div className={`relative w-full h-full flex flex-col md:flex-row ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} pointer-events-none`}>

                {/* Image Side - Morph Target */}
                <div
                    className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <motion.div
                        className="w-full h-full relative"
                        layoutId={`image-container-${member.id}`}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                            mass: 0.8
                        }}
                    >
                        <motion.img
                            layoutId={`image-${member.id}`}
                            src={member.img || member.src}
                            alt={member.name}
                            className="w-full h-full object-contain will-change-transform"
                            style={{ objectPosition: "center" }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                                mass: 0.8
                            }}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r"
                    />

                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/50 hover:bg-white/20 text-white transition-colors md:hidden backdrop-blur-md"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content Side */}
                <motion.div
                    className="w-full md:w-1/2 h-1/2 md:h-full p-6 md:p-16 overflow-y-auto bg-black/40 md:bg-transparent pointer-events-auto"
                    initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isEven ? 20 : -20, transition: { duration: 0.2 } }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 25,
                        delay: 0.1
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="hidden md:block absolute top-8 right-8 z-50 p-3 rounded-full bg-white/5 hover:bg-white/20 text-white transition-all hover:scale-110 active:scale-95"
                    >
                        <X size={32} />
                    </button>

                    <div className="space-y-6 md:space-y-8 max-w-2xl mx-auto md:mx-0 pt-4 md:pt-0">
                        <div className="space-y-2">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 30 }}
                                className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase"
                                style={{ color }}
                            >
                                {member.rank || member.designation}
                            </motion.p>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25, type: "spring", stiffness: 300, damping: 30 }}
                                className="text-4xl md:text-7xl font-black text-white leading-none"
                            >
                                {member.name}
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                                className="text-slate-300 text-base md:text-lg leading-relaxed font-light mt-4"
                            >
                                {enrichedMember.bio}
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="h-px w-full bg-white/20 origin-left"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <h3 className="flex items-center gap-3 text-lg md:text-xl font-bold text-white mb-4">
                                <Award className="text-yellow-500 w-5 h-5 md:w-6 md:h-6" /> Achievements
                            </h3>
                            <ul className="space-y-3">
                                {enrichedMember.achievements.map((achievement, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + (i * 0.1) }}
                                        className="flex items-start gap-4 text-slate-300 text-sm md:text-lg"
                                    >
                                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-white/50 shrink-0" />
                                        {achievement}
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="flex gap-4 md:gap-6 pt-4 md:pt-8"
                        >
                            <a href="#" className="p-3 md:p-4 rounded-full bg-white/5 hover:bg-white/10 hover:text-pink-500 transition-all text-white border border-white/10 hover:scale-110 active:scale-95">
                                <Instagram size={20} className="md:w-6 md:h-6" />
                            </a>
                            <a href="#" className="p-3 md:p-4 rounded-full bg-white/5 hover:bg-white/10 hover:text-red-500 transition-all text-white border border-white/10 hover:scale-110 active:scale-95">
                                <Youtube size={20} className="md:w-6 md:h-6" />
                            </a>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default FocusModeOverlay;
