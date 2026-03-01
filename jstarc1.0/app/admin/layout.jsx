
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Images,
    Calendar,
    Users,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Gallery", href: "/admin/gallery", icon: Images },
        { name: "Events", href: "/admin/events", icon: Calendar },
        { name: "Team", href: "/admin/team", icon: Users },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            <Toaster position="top-right" />

            {/* Mobile Sidebar Toggle */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md text-slate-600"
            >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <AnimatePresence mode="wait">
                {(isSidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
                    <motion.aside
                        initial={{ x: -250, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -250, opacity: 0 }}
                        className={`
              fixed lg:static inset-y-0 left-0 z-40
              w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200/50 shadow-xl
              flex flex-col
              transition-all duration-300 ease-in-out
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
                    >
                        <div className="p-6 border-b border-slate-100">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                JSTARC Admin
                            </h1>
                            <p className="text-xs text-slate-400 mt-1">Management Console</p>
                        </div>

                        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
                                    >
                                        <div className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${isActive
                                                ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-100"
                                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
                    `}>
                                            <item.icon size={20} className={isActive ? "text-blue-600" : "text-slate-400"} />
                                            <span className="font-medium">{item.name}</span>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-pill"
                                                    className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600"
                                                />
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="p-4 border-t border-slate-100">
                            <button className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium">
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-hidden bg-slate-50/50">
                <div className="h-full overflow-y-auto p-4 lg:p-8 pt-20 lg:pt-8">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
