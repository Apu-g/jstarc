"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import MasterPortfolio from "@/components/MasterPortfolio";
import { Navbar } from "@/components/Navbar";

export default function MasterPage() {
    const params = useParams();
    const [master, setMaster] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMaster = async () => {
            try {
                const res = await fetch('/api/admin/masters');
                const data = await res.json();
                if (Array.isArray(data)) {
                    // Find master by matching id (Supabase numeric) or old string id
                    const found = data.find(m => 
                        String(m.id) === params.id || 
                        m.name?.toLowerCase().includes(params.id?.toLowerCase())
                    );
                    if (found) {
                        setMaster(found);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch master:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMaster();
    }, [params.id]);

    if (loading) {
        return (
            <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-white/50 text-lg animate-pulse">Loading...</div>
            </main>
        );
    }

    if (!master) {
        return (
            <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center flex-col gap-4">
                <div className="text-white/50 text-lg">Master not found</div>
                <a href="/team" className="text-purple-400 hover:text-purple-300 underline">
                    Back to Team
                </a>
            </main>
        );
    }

    return <MasterPortfolio master={master} />;
}
