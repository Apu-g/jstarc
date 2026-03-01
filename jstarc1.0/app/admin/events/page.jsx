
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Plus, MapPin, Clock, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
// import ImageUploader from "@/components/admin/ImageUploader"; // Will use later for event specific images

export default function EventsManager() {
    const [events, setEvents] = useState([
        {
            id: 1,
            title: "Annual Karate Championship",
            date: "2024-08-15",
            location: "Bangalore Indoor Stadium",
            type: "Upcoming"
        },
        {
            id: 2,
            title: "Black Belt Grading",
            date: "2024-06-10",
            location: "JSTARC DOJO",
            type: "Past"
        },
    ]);

    const handleDelete = (id) => {
        setEvents(events.filter(e => e.id !== id));
        toast.success("Event deleted");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Events Manager</h1>
                    <p className="text-slate-500">Schedule and manage upcoming karate events.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm shadow-blue-200">
                    <Plus size={20} />
                    Add Event
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">Event Name</th>
                                <th className="p-4 font-semibold">Date & Time</th>
                                <th className="p-4 font-semibold">Location</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {events.map((event) => (
                                <tr key={event.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-semibold text-slate-900">{event.title}</div>
                                    </td>
                                    <td className="p-4 text-slate-600 flex items-center gap-2">
                                        <Clock size={16} className="text-slate-400" />
                                        {event.date}
                                    </td>
                                    <td className="p-4 text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={16} className="text-slate-400" />
                                            {event.location}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${event.type === 'Upcoming'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {event.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {events.length === 0 && (
                        <div className="p-8 text-center text-slate-500">
                            No events found. Create one to get started!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
