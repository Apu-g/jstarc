"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Trophy, Medal } from "lucide-react";
import EventGallery from "./EventGallery";

export const Events = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('/api/events/list');
                const data = await res.json();
                if (data.events && data.events.length > 0) {
                    setEvents(data.events);
                }
            } catch (err) {
                console.error("Failed to fetch events:", err);
            }
        };
        fetchEvents();
    }, []);

    return (
        <section id="events" className="relative py-12 md:py-24">
            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-4 tracking-tight" style={{ color: '#121212' }}>Track Record & Events</h2>
                    <p className="max-w-2xl mx-auto" style={{ color: '#666' }}>
                        From local demonstrations to international victories, our students constantly push their limits.
                        Click on an event to view the gallery.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.length > 0 ? (
                        events.map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => setSelectedEvent(event)}
                                className="cursor-pointer"
                            >
                                <div
                                    className="rounded-2xl border-2 border-black overflow-hidden transition-all duration-300 hover:-translate-y-2 group h-full"
                                    style={{
                                        background: '#FFFDF5',
                                        boxShadow: '4px 4px 0px 0px #000',
                                    }}
                                >
                                    {/* Image */}
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                        {/* Tag */}
                                        <div className="absolute top-4 right-4 z-20">
                                            {event.category === "Win" ? (
                                                <span className="border-2 border-black text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-hard-sm" style={{ background: '#FBFF48' }}>
                                                    <Trophy size={12} /> WIN
                                                </span>
                                            ) : (
                                                <span className="border-2 border-black text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-hard-sm" style={{ background: '#3B82F6' }}>
                                                    <Medal size={12} /> GALLERY
                                                </span>
                                            )}
                                        </div>
                                        {/* View Gallery Overlay Hint */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-30">
                                            <span className="text-white border-2 border-white px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase" style={{ background: 'rgba(0,0,0,0.5)' }}>
                                                View Gallery
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 border-t-2 border-black">
                                        <div className="flex items-center gap-4 text-xs mb-3" style={{ color: '#555' }}>
                                            <span className="flex items-center gap-1 font-bold" style={{ color: '#3B82F6' }}>
                                                <Calendar size={14} /> {event.date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin size={14} /> {event.location}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold mb-0 group-hover:underline leading-tight" style={{ color: '#121212' }}>
                                            {event.title}
                                        </h3>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12" style={{ color: '#888' }}>
                            Loading events...
                        </div>
                    )}
                </div>

                <div className="mt-16 text-center">
                    <button
                        className="border-2 border-black px-8 py-3 rounded-full hover:bg-black hover:text-white transition-all text-sm tracking-widest uppercase font-bold"
                        style={{ background: '#FBFF48', color: '#121212', boxShadow: '3px 3px 0 #000' }}
                    >
                        View All Archives
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {selectedEvent && (
                    <EventGallery event={selectedEvent} onClose={() => setSelectedEvent(null)} />
                )}
            </AnimatePresence>
        </section>
    );
};
