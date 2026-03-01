"use client";

import { MapPin, Phone, Mail } from "lucide-react";

export const Contact = () => {
    return (
        <section id="contact" className="pt-12 pb-12 border-t border-white/5 bg-black/40">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 items-start">

                    {/* Left Column: Enquiry Form */}
                    <div className="w-full">
                        <div className="w-full p-8 shadow-2xl bg-black border border-white/10 rounded-2xl">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-white mb-1">Enquiry</h3>
                                <p className="text-slate-400 text-sm">Enter your details to send us a query</p>
                            </div>
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white block">Name</label>
                                    <input type="text" placeholder="Your Name" required className="w-full bg-[#111] border border-white/10 rounded-md p-3 text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-gray-600 text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white block">Phone Number</label>
                                    <input type="tel" placeholder="+91 ..." required className="w-full bg-[#111] border border-white/10 rounded-md p-3 text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-gray-600 text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white block">Query (Optional)</label>
                                    <textarea placeholder="How can we help?" className="w-full bg-[#111] border border-white/10 rounded-md p-3 text-white focus:outline-none focus:border-white/30 transition-colors h-24 resize-none placeholder:text-gray-600 text-sm" />
                                </div>
                                <div className="pt-2">
                                    <button type="submit" className="w-full bg-white text-black font-medium py-2.5 rounded-full hover:bg-gray-200 transition-colors">
                                        Send Enquiry
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Contact Info & Map */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-4xl font-bold mb-6 text-white text-glow">Start Your Journey</h2>
                            <p className="text-slate-300 mb-8 max-w-md">
                                Visit us for a free trial class. Experience the discipline and power of Taekwondo firsthand.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 group">
                                    <div className="p-3 rounded-full bg-neon-blue/10 text-neon-blue group-hover:bg-neon-blue/20 group-hover:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all duration-300">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white group-hover:text-neon-blue transition-colors">Locate Us</h4>
                                        <p className="text-slate-400">Jstarc Taekwondo Bengaluru<br />123 Martial Arts Ave, Bengaluru, 560001</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <div className="p-3 rounded-full bg-neon-purple/10 text-neon-purple group-hover:bg-neon-purple/20 group-hover:shadow-[0_0_15px_rgba(188,19,254,0.3)] transition-all duration-300">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white group-hover:text-neon-purple transition-colors">Call Us</h4>
                                        <p className="text-slate-400">+91 98765 43210</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <div className="p-3 rounded-full bg-neon-green/10 text-neon-green group-hover:bg-neon-green/20 group-hover:shadow-[0_0_15px_rgba(10,255,10,0.3)] transition-all duration-300">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white group-hover:text-neon-green transition-colors">Email Us</h4>
                                        <p className="text-slate-400">info@jstarcblr.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Google Map Placeholder */}
                        <div className="glass-card w-full h-[300px] overflow-hidden relative transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,243,255,0.15)] flex items-center justify-center rounded-2xl border border-white/10 bg-black/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none"></div>
                            <div className="text-slate-400 text-center z-10">
                                <MapPin className="w-12 h-12 mx-auto mb-4 text-white/20" />
                                <p>Map Integration Placeholder</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 text-center text-slate-500 text-sm">
                    &copy; 2026 Jstarc Taekwondo Bengaluru. All rights reserved.
                </div>
            </div>
        </section>
    )
}
