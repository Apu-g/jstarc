"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { showNavbar } = useLoading();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Events", href: "/events" },
        { label: "Team", href: "/team" }
    ];

    // Don't render navbar until intro is complete (only on home page first visit)
    if (!showNavbar && pathname === '/') {
        return null;
    }

    return (
        <>
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="fixed top-0 w-full z-50 px-4 py-4 pointer-events-none"
            >
                <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
                    {/* Logo */}
                    <Link
                        href="/"
                        className={cn(
                            "bg-[#FFFDF5] border-3 border-black px-4 py-1 font-[family-name:var(--font-display)] text-2xl font-black shadow-hard",
                            "hover:bg-[#FBFF48] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                        )}
                    >
                        JSTARC
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex gap-1 bg-white border-3 border-black p-2 shadow-hard">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={cn(
                                    "px-4 py-1.5 font-[family-name:var(--font-mono)] font-bold text-sm uppercase tracking-wide transition-colors",
                                    pathname === link.href
                                        ? "bg-black text-white"
                                        : "hover:bg-black hover:text-white text-[#121212]"
                                )}
                            >
                                /{link.label.toUpperCase()}
                            </Link>
                        ))}
                        <Link
                            href="/#contact"
                            className="px-4 py-1.5 font-[family-name:var(--font-mono)] font-bold text-sm bg-[#FBFF48] border border-black hover:bg-[#FF70A6] transition-colors uppercase"
                        >
                            JOIN US
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden bg-white border-3 border-black p-2 shadow-hard-sm hover:bg-[#FBFF48] transition-colors"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Menu size={24} className="text-[#121212]" />
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-x-4 top-20 z-[60] bg-white border-4 border-black p-6 md:hidden flex flex-col gap-6 shadow-hard-xl"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-[family-name:var(--font-mono)] text-sm font-bold uppercase tracking-widest text-[#121212]">
                                MENU
                            </span>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 bg-[#121212] text-white hover:bg-[#FF2A2A] transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "text-lg font-black uppercase px-4 py-3 border-2 border-black transition-all",
                                        pathname === link.href
                                            ? "bg-black text-white"
                                            : "bg-white text-[#121212] hover:bg-[#FBFF48] hover:translate-x-1"
                                    )}
                                >
                                    /{link.label}
                                </Link>
                            ))}
                        </div>

                        <div className="h-[3px] bg-black my-1" />

                        <Link href="/#contact" onClick={() => setMobileMenuOpen(false)}>
                            <button className="w-full bg-[#FBFF48] text-black border-3 border-black px-4 py-4 text-lg font-black uppercase shadow-hard hover:shadow-none hover:translate-y-1 transition-all">
                                JOIN NOW
                            </button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
