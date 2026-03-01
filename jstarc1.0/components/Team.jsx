"use client";

import { useState, useEffect } from "react";
import MastersGallery3D from "@/components/MastersGallery3D";
import TeamMarquee from "@/components/TeamMarquee";
import { DemoTeam } from "@/components/DemoTeam";
import { ConstellationTeam } from "@/components/ConstellationTeam";

// --- Main Team Component ---
export const Team = () => {
    const [blackbelts, setBlackbelts] = useState([]);

    useEffect(() => {
        fetch('/api/admin/blackbelts')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) setBlackbelts(data);
            })
            .catch(err => console.error('Failed to fetch blackbelts:', err));
    }, []);

    return (
        <section id="team" className="relative overflow-hidden text-gray-900">
            {/* Section 1: 3D Masters Gallery */}
            <MastersGallery3D />

            {/* Section 2: Team Marquee Animation */}
            <TeamMarquee />

            {/* Section 3: Demonstration Team */}
            <DemoTeam />

            {/* Section 4: Constellation Team Timeline */}
            {blackbelts.length > 0 && <ConstellationTeam members={blackbelts} />}
        </section>
    );
};
