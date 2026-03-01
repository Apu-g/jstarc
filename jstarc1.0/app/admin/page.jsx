
"use client";

import { motion } from "framer-motion";
import {
    Images,
    Calendar,
    Users,
    Activity,
    ArrowUpRight
} from "lucide-react";

export default function AdminDashboard() {
    // Mock data for now
    const stats = [
        { title: "Total Photos", value: "124", icon: Images, color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Events", value: "8", icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
        { title: "Team Members", value: "12", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
        { title: "Site Views", value: "1.2k", icon: Activity, color: "text-orange-600", bg: "bg-orange-50" },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Welcome back to JSTARC Admin</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        System Operational
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        variants={item}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                +12% <ArrowUpRight size={12} className="ml-1" />
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                        <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions / Recent Activity placeholders */}
                <motion.div variants={item} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                    <Activity size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900">Updated Event Details</p>
                                    <p className="text-xs text-slate-500">2 hours ago • Admin</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div variants={item} className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold mb-2">Manage Gallery</h2>
                        <p className="text-blue-100 text-sm mb-6 max-w-sm">Upload new photos to the marquee seamlessly. Drag and drop support included.</p>
                        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:shadow-md hover:scale-105 transition-all">
                            Go to Gallery
                        </button>
                    </div>

                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
                </motion.div>
            </div>
        </motion.div>
    );
}
