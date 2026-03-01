"use client";

import { motion } from "framer-motion";
import { Shield, Users, Award, Trophy, UserCheck, Medal } from "lucide-react";
import StarBorder from "./StarBorder";
import SpotlightCard from "./SpotlightCard";

const stats = [
    { id: 1, label: "Years of Operation", value: "25+", icon: Trophy },
    { id: 2, label: "Students Trained", value: "1500+", icon: UserCheck },
    { id: 3, label: "Medals Won", value: "1000+", icon: Medal },
];

const values = [
    {
        id: "discipline",
        title: "Discipline",
        desc: "Cultivating focus, self-control, and a strong work ethic through structured training.",
        icon: Shield,
        color: "text-blue-600",
        bg: "bg-blue-100",
        border: "border-blue-200"
    },
    {
        id: "respect",
        title: "Respect",
        desc: "Honoring our instructors, fellow students, and the traditions of Taekwondo.",
        icon: Users,
        color: "text-green-600",
        bg: "bg-green-100",
        border: "border-green-200"
    },
    {
        id: "integrity",
        title: "Integrity",
        desc: "Upholding honesty and strong moral principles in all our actions.",
        icon: Award,
        color: "text-red-600",
        bg: "bg-red-100",
        border: "border-red-200"
    }
];

export const About = () => {
    return (
        <section id="about" className="relative py-12 md:py-24 overflow-hidden bg-[#FFFDF5]">
            {/* Background Pattern - subtle overlay */}
            <div className="absolute inset-0 bg-[url('/assets/pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">About JStarc</h2>
                    <h1 className="text-4xl md:text-6xl font-black text-black mb-6">Passion. Discipline. Excellence.</h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full shadow-hard-sm" />
                </motion.div>

                {/* Our Story */}
                <div className="flex flex-col md:flex-row items-center gap-16 mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="md:w-1/2"
                    >
                        <div className="relative rounded-xl overflow-hidden group shadow-hard border-4 border-black">
                            <img
                                src="/assets/1.jpg"
                                alt="JStarc Training"
                                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="md:w-1/2 space-y-8"
                    >
                        <div>
                            <h3 className="text-3xl font-black mb-4 text-black uppercase">Our Story</h3>
                            <p className="text-gray-700 font-medium leading-relaxed text-lg">
                                Founded with a passion for martial arts and a commitment to personal growth, <span className="text-black font-black bg-[#FBFF48] px-1">JStarc Taekwondo Club</span> has been a pillar of the community for over a decade. Our journey began with a small group of dedicated students and has grown into a thriving family of martial artists, united by a shared dedication to excellence.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Mission & Values */}
                <div className="mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h3 className="text-3xl md:text-4xl font-black mb-6 text-black uppercase">Our Mission & Values</h3>
                        <p className="text-gray-700 font-medium max-w-2xl mx-auto text-lg">
                            We are dedicated to fostering an environment of respect, discipline, and perseverance. Our core values guide every aspect of our training, helping students build character both on and off the mat.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="h-full"
                            >
                                <div className="h-full glass-card group hover:-translate-y-2 transition-transform duration-300 bg-white">
                                    <div className="w-16 h-16 rounded-full border-4 border-black shadow-hard-sm flex items-center justify-center mb-6 transition-transform group-hover:scale-110" style={{ backgroundColor: item.id === 'discipline' ? '#FF70A6' : item.id === 'respect' ? '#33FF57' : '#3B82F6' }}>
                                        <item.icon className="w-8 h-8 text-black" />
                                    </div>
                                    <h4 className="text-2xl font-black text-black mb-3 uppercase tracking-tight">{item.title}</h4>
                                    <p className="text-gray-700 font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Team Philosophy */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-[#FBFF48] border-4 border-black shadow-hard p-12 text-center mb-32 relative overflow-hidden group hover:-translate-y-1 transition-transform"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
                    <h3 className="text-3xl font-black mb-6 text-black uppercase">Team Philosophy</h3>
                    <p className="text-black font-semibold text-xl leading-relaxed max-w-4xl mx-auto italic">
                        &quot;Our coaching philosophy is centered on positive reinforcement and individual attention. We believe in nurturing each student&apos;s potential, celebrating progress, and building a supportive community where everyone feels empowered to achieve their personal best.&quot;
                    </p>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 md:gap-8 text-center divide-x-4 divide-black">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="px-1 md:px-4 group"
                        >
                            <stat.icon className="w-8 h-8 md:w-12 md:h-12 text-black mx-auto mb-3 md:mb-5 group-hover:-translate-y-2 transition-transform duration-300" />
                            <div className="text-3xl md:text-5xl lg:text-7xl font-black text-black mb-1 md:mb-3" style={{ textShadow: "4px 4px 0px #3B82F6" }}>{stat.value}</div>
                            <div className="text-black font-extrabold uppercase tracking-widest text-[10px] md:text-sm">{stat.label}</div>
                            {index === 1 && <p className="text-[10px] md:text-xs text-gray-700 font-bold mt-1 md:mt-2 hidden md:block">Impacting lives daily</p>}
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};
