"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Award, Tv, GraduationCap, Shield, Star, MapPin, Briefcase, Medal } from "lucide-react";
import Link from "next/link";
import "./MasterPortfolio.css";

// ─── Count-up animation hook ───
const useCountUp = (end, duration = 2000, triggerRef) => {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        if (!triggerRef?.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started) {
                    setStarted(true);
                }
            },
            { threshold: 0.3 }
        );
        observer.observe(triggerRef.current);
        return () => observer.disconnect();
    }, [triggerRef, started]);

    useEffect(() => {
        if (!started) return;
        let startTime = null;
        const numericEnd = parseInt(end);

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            setCount(Math.floor(eased * numericEnd));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [started, end, duration]);

    return count;
};

// ─── Scroll reveal hook ───
const useScrollReveal = () => {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add("visible");
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return ref;
};

// ─── Stat Card Component ───
const StatCard = ({ icon, value, suffix, label }) => {
    const cardRef = useRef(null);
    const count = useCountUp(value, 2000, cardRef);

    return (
        <div className="portfolio-stat-card" ref={cardRef}>
            <span className="portfolio-stat-icon">{icon}</span>
            <div className="portfolio-stat-number">
                {count}<span className="portfolio-stat-suffix">{suffix}</span>
            </div>
            <div className="portfolio-stat-label">{label}</div>
        </div>
    );
};

// ─── Certification Card ───
const CertCard = ({ cert, index }) => {
    const ref = useScrollReveal();
    return (
        <div ref={ref} className={`portfolio-cert-card scroll-reveal stagger-${(index % 6) + 1}`}>
            <div className="portfolio-cert-title">{cert.title}</div>
            <div className="portfolio-cert-subtitle">{cert.subtitle}</div>
            <div className="portfolio-cert-org">{cert.org}</div>
            <div className="portfolio-cert-location">{cert.location}</div>
        </div>
    );
};

// ─── Achievement Card ───
const AchievementCard = ({ achievement, index }) => {
    const ref = useScrollReveal();
    return (
        <div ref={ref} className={`portfolio-achievement-card scroll-reveal stagger-${(index % 4) + 1}`}>
            <div className="portfolio-achievement-badge">🏅 {achievement.badge}</div>
            <div className="portfolio-achievement-title">{achievement.title}</div>
            <div className="portfolio-achievement-desc">{achievement.desc}</div>
            <div className="portfolio-achievement-year">{achievement.year}</div>
        </div>
    );
};

// ─── Timeline Item ───
const TimelineItem = ({ item, index }) => {
    const ref = useScrollReveal();
    return (
        <div ref={ref} className={`portfolio-timeline-item scroll-reveal-left stagger-${(index % 6) + 1}`}>
            <div className="portfolio-timeline-dot" />
            <div className="portfolio-timeline-title">{item.title}</div>
            {item.org && <div className="portfolio-timeline-org">{item.org}</div>}
        </div>
    );
};

// ─── National Achievement Card ───
const NationalCard = ({ achievement, index }) => {
    const ref = useScrollReveal();
    return (
        <div ref={ref} className={`portfolio-national-card scroll-reveal stagger-${index + 1}`}>
            <span className="portfolio-national-icon">{achievement.icon}</span>
            <div className="portfolio-national-title">{achievement.title}</div>
            <div className="portfolio-national-desc">{achievement.desc}</div>
        </div>
    );
};

// ─── Highlight Card ───
const HighlightCard = ({ highlight, index }) => {
    const ref = useScrollReveal();
    return (
        <div ref={ref} className={`portfolio-highlight-card scroll-reveal stagger-${(index % 3) + 1}`}>
            <span className="portfolio-highlight-emoji">{highlight.emoji}</span>
            <div className="portfolio-highlight-title">{highlight.title}</div>
            <div className="portfolio-highlight-desc">{highlight.desc}</div>
            <div className="portfolio-highlight-sub">{highlight.sub}</div>
        </div>
    );
};

// ─── Role Card ───
const RoleCard = ({ role, index }) => {
    const ref = useScrollReveal();
    return (
        <div ref={ref} className={`portfolio-role-card scroll-reveal stagger-${(index % 5) + 1}`}>
            <div className="portfolio-role-icon">{role.icon}</div>
            <div className="portfolio-role-text-content">
                <div className="portfolio-role-title">{role.title}</div>
                <div className="portfolio-role-subtitle">{role.subtitle}</div>
            </div>
        </div>
    );
};

// ─── Skill Card ───
const SkillCard = ({ skill, index }) => {
    const ref = useScrollReveal();
    return (
        <div ref={ref} className={`portfolio-skill-card scroll-reveal stagger-${(index % 3) + 1}`}>
            <span className="portfolio-skill-icon">{skill.icon}</span>
            <span className="portfolio-skill-name">{skill.name}</span>
        </div>
    );
};

// ─── Infographic Timeline Component (Alternating Top/Bottom) ───
const InfographicTimeline = ({ items }) => {
    // We duplicate the items to create a continuous marquee scroll effect
    const duplicatedItems = [...items, ...items];
    
    // Website matching colors instead of violet
    // We'll map them to the CSS classes "color-1" through "color-4"
    const colors = ["color-1", "color-2", "color-3", "color-4"];
    
    return (
        <div className="portfolio-infographic-wrapper">
            <div className="portfolio-infographic-content">
                <div className="portfolio-infographic-line"></div>
                {duplicatedItems.map((item, index) => {
                    const colorClass = colors[index % colors.length];
                    const isTop = index % 2 === 0;

                    return (
                        <div key={index} className="portfolio-infographic-item">
                            {isTop ? (
                                // TOP ITEM: Bubble above, text below
                                <>
                                    {/* Top Bubble */}
                                    <div className={`portfolio-bubble ${colorClass} top-bubble`}>
                                        {item.icon}
                                        <div className="portfolio-bubble-pointer down-pointer"></div>
                                    </div>
                                    
                                    {/* Center Dot */}
                                    <div className={`portfolio-dot ${colorClass}`}>
                                        <div className="portfolio-dot-inner"></div>
                                    </div>
                                    
                                    {/* Bottom Info */}
                                    <div className="portfolio-info-bottom">
                                        <div className="portfolio-info-year">{item.year}</div>
                                        <div className="portfolio-info-title">{item.hook}</div>
                                    </div>
                                </>
                            ) : (
                                // BOTTOM ITEM: Text above, bubble below
                                <>
                                    {/* Top Info */}
                                    <div className="portfolio-info-top">
                                        <div className="portfolio-info-title">{item.hook}</div>
                                        <div className="portfolio-info-year">{item.year}</div>
                                    </div>

                                    {/* Center Dot */}
                                    <div className={`portfolio-dot ${colorClass}`}>
                                        <div className="portfolio-dot-inner"></div>
                                    </div>

                                    {/* Bottom Bubble */}
                                    <div className={`portfolio-bubble ${colorClass} bottom-bubble`}>
                                        {item.icon}
                                        <div className="portfolio-bubble-pointer up-pointer"></div>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ─── Master Data ───
const JAI_KUMAR_DATA = {
    marqueeTimeline: [
        { icon: <Award size={36} />, year: "2010", hook: "International Recognition" },
        { icon: <Tv size={36} />, year: "2010", hook: "Sony TV Title Winner" },
        { icon: <Medal size={36} />, year: "2010", hook: "International Medalist" },
        { icon: <GraduationCap size={36} />, year: "2010", hook: "Instructor Certification" },
        { icon: <Shield size={36} />, year: "2011", hook: "Martial Arts Expansion" },
        { icon: <Star size={36} />, year: "2012", hook: "Advanced Martial Arts Rank" },
        { icon: <MapPin size={36} />, year: "2013", hook: "Cultural Achievement" },
        { icon: <Shield size={36} />, year: "2015", hook: "Weapon Arts Int. Rank" },
        { icon: <Star size={36} />, year: "2016", hook: "Master Rank Achievement" },
        { icon: <Medal size={36} />, year: "2018", hook: "International Championship" },
        { icon: <Briefcase size={36} />, year: "2019", hook: "Sports Medicine Training" }
    ],
    stats: [
        { icon: "🏆", value: 5, suffix: "+", label: "International Medals" },
        { icon: "🥋", value: 20, suffix: "+", label: "Years Experience" },
        { icon: "🌍", value: 6, suffix: "", label: "Countries Performed" },
        { icon: "👨‍🏫", value: 1000, suffix: "+", label: "Students Trained" },
    ],
    certifications: [
        {
            title: "6th Dan Black Belt",
            subtitle: "Taekwondo",
            org: "Kukkiwon – World Taekwondo HQ",
            location: "South Korea | 2016"
        },
        {
            title: "3rd Dan Black Belt",
            subtitle: "Hapkido Self Defence",
            org: "World Kido Hapkido Federation",
            location: "South Korea | 2012"
        },
        {
            title: "IBP Instructor Course",
            subtitle: "Kummooyeh – Korean Sword & Archery",
            org: "World Kummooyeh Federation",
            location: "2015"
        },
        {
            title: "Foreign Instructor Certification",
            subtitle: "Taekwondo",
            org: "Kukkiwon – World Taekwondo HQ",
            location: "South Korea | 2010"
        },
        {
            title: "Kickboxing Certification",
            subtitle: "J-Kicks",
            org: "Steve Gym",
            location: "Bengaluru | 2011"
        },
        {
            title: "Sports Injury Therapy",
            subtitle: "Trimmers & Toners",
            org: "JSTARC",
            location: "Mumbai | 2019"
        },
    ],
    internationalAchievements: [
        {
            badge: "World Championship",
            title: "World Taekwondo Championship",
            desc: "International Medalist at the 4th World Taekwondo Championship",
            year: "Muju, South Korea — 2010, 2011, 2012, 2015"
        },
        {
            badge: "University Championship",
            title: "Incheon University Championship",
            desc: "International Medalist representing excellence in competitive Taekwondo",
            year: "South Korea — 2010"
        },
        {
            badge: "A Mach Championship",
            title: "12th Taekwondo 'A Mach' Championship",
            desc: "International Medalist in one of Korea's elite Taekwondo championships",
            year: "Muju, South Korea — 2018"
        },
        {
            badge: "World Festival",
            title: "World Taekwondo Festival & Korea Classic Open",
            desc: "Merit Certified for Superior Skill at the 11th World Taekwondo Festival",
            year: "Chungbuk, South Korea — 2010"
        },
    ],
    nationalAchievements: [
        {
            icon: "🥇",
            title: "State Gold Medal",
            desc: "Karnataka Taekwondo Association"
        },
        {
            icon: "🏅",
            title: "National Gold Medal",
            desc: "Karnataka Taekwondo Association"
        },
        {
            icon: "🏆",
            title: "National Gold Medal",
            desc: "Spirit 2008, Navi Mumbai"
        },
    ],
    highlights: [
        {
            emoji: "💰",
            title: "₹5,00,000 Winner — Sony TV",
            desc: "\"Entertainment Ke Liye Kuch Bhi Karega\"",
            sub: "2010"
        },
        {
            emoji: "🏅",
            title: "Outstanding Achievement",
            desc: "7th World Taekwondo Culture Expo",
            sub: "South Korea — 2013"
        },
        {
            emoji: "🌏",
            title: "International Stage Shows",
            desc: "India, Egypt, Thailand, Sri Lanka, South Korea",
            sub: "Multiple Countries"
        },
        {
            emoji: "⛪",
            title: "Church Demonstrations",
            desc: "Taekwondo shows in 13 churches",
            sub: "Daegu, South Korea"
        },
        {
            emoji: "🎭",
            title: "Mass Performances",
            desc: "Shows in Apartments, Schools, Colleges, Churches across India",
            sub: "Pan-India Tours"
        },
        {
            emoji: "⚽",
            title: "Soccer Player",
            desc: "Played Soccer for clubs (B Division)",
            sub: "Multi-sport Athlete"
        },
    ],
    experience: [
        { title: "Technical Director", org: "JSTARC" },
        { title: "Head Coach", org: "JSTARC Navi Mumbai" },
        { title: "Coach", org: "Karnataka Taekwondo Association" },
        { title: "National Team Player", org: "Sports Authority of India" },
        { title: "Gym Instructor", org: "Jalnawala's Fitness Center" },
        { title: "Aerobic Coach", org: "Body & Soul Gym" },
        { title: "Corporate Fitness Coach", org: "IGATE" },
        { title: "Corporate Fitness Coach", org: "Tata Consultancy Services" },
    ],
    currentRoles: [
        { icon: "🏢", title: "Manager", subtitle: "Jalnawala's Sports & Wellness Pvt Ltd" },
        { icon: "🥋", title: "Head Trainer", subtitle: "Taekwondo, Kickboxing & Korean Sword" },
        { icon: "💪", title: "Gym Operations", subtitle: "Jalnawala's Gym Bangalore" },
        { icon: "🏫", title: "Government School Coach", subtitle: "Taekwondo Program" },
        { icon: "🛡️", title: "Corporate Trainer", subtitle: "Self Defence Programs" },
    ],
    skills: [
        { icon: "👑", name: "Leadership" },
        { icon: "🥋", name: "Martial Arts Training" },
        { icon: "🛡️", name: "Self Defence Programs" },
        { icon: "🏟️", name: "Sports Event Organization" },
        { icon: "👥", name: "Team Management" },
        { icon: "🗣️", name: "Communication" },
    ],
};

// ─── Main Portfolio Component ───
const MasterPortfolio = ({ master }) => {
    if (!master) return null;

    const data = JAI_KUMAR_DATA;

    return (
        <div className="portfolio-page">
            {/* Back Button */}
            <Link href="/team" className="portfolio-back-btn">
                <ArrowLeft size={18} />
                Back to Team
            </Link>

            {/* ── Hero & Stats NeoBrutalist Envelope ── */}
            <div className="portfolio-neobrut-container">
                <section className="portfolio-hero">
                    <div className="portfolio-hero-inner">
                        <motion.div
                            className="portfolio-photo-card"
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <img
                                src={master.img || master.src}
                                alt={master.name}
                            />
                        </motion.div>

                        <motion.div
                            className="portfolio-hero-info"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className="portfolio-rank-badge">
                                {(master.id === 'jaimaster' || master.id === 'jai') ? "6TH DAN BLACKBELT" : (master.rank || master.designation)}
                            </div>
                            <h1 className="portfolio-hero-name">
                                <span>{master.name}</span>
                            </h1>
                            <p className="portfolio-hero-bio">
                                {master.bio || "A dedicated martial artist with a passion for excellence. Over two decades of mastery in Taekwondo, training thousands of students and representing India on the world stage."}
                            </p>
                            <div className="portfolio-hero-tags">
                                <span className="portfolio-hero-tag">🥋 Taekwondo</span>
                                <span className="portfolio-hero-tag">🗡️ Korean Sword</span>
                                <span className="portfolio-hero-tag">🥊 Kickboxing</span>
                                <span className="portfolio-hero-tag">🏃 Fitness</span>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Quick Stats placed inside the glowing hero-about box like the reference */}
                <div className="portfolio-stats-grid" style={{ padding: "0 24px" }}>
                    {data.stats.map((stat, i) => (
                        <StatCard key={i} {...stat} />
                    ))}
                </div>
            </div>

            {/* ── Infographic Timeline ── */}
            <InfographicTimeline items={data.marqueeTimeline} />

            {/* ── Certifications ── */}
            <section className="portfolio-section">
                <div className="portfolio-section-header">
                    <div className="portfolio-section-tag">Credentials</div>
                    <h2 className="portfolio-section-title">Certifications</h2>
                    <div className="portfolio-section-divider" />
                </div>
                <div className="portfolio-certs-grid">
                    {data.certifications.map((cert, i) => (
                        <CertCard key={i} cert={cert} index={i} />
                    ))}
                </div>
            </section>

            {/* ── International Achievements ── */}
            <section className="portfolio-section">
                <div className="portfolio-section-header">
                    <div className="portfolio-section-tag">World Stage</div>
                    <h2 className="portfolio-section-title">International Achievements</h2>
                    <div className="portfolio-section-divider" />
                </div>
                <div className="portfolio-achievements-grid">
                    {data.internationalAchievements.map((a, i) => (
                        <AchievementCard key={i} achievement={a} index={i} />
                    ))}
                </div>

                {/* National Achievements Sub-section */}
                <div className="portfolio-section-header" style={{ marginTop: 80 }}>
                    <div className="portfolio-section-tag">National Pride</div>
                    <h2 className="portfolio-section-title" style={{ fontSize: 36 }}>National Achievements</h2>
                    <div className="portfolio-section-divider" />
                </div>
                <div className="portfolio-national-grid">
                    {data.nationalAchievements.map((a, i) => (
                        <NationalCard key={i} achievement={a} index={i} />
                    ))}
                </div>
            </section>

            {/* ── Major Highlights ── */}
            <section className="portfolio-section">
                <div className="portfolio-section-header">
                    <div className="portfolio-section-tag">Spotlight</div>
                    <h2 className="portfolio-section-title">Major Highlights</h2>
                    <div className="portfolio-section-divider" />
                </div>
                <div className="portfolio-highlights-grid">
                    {data.highlights.map((h, i) => (
                        <HighlightCard key={i} highlight={h} index={i} />
                    ))}
                </div>
            </section>

            {/* ── Professional Experience Timeline ── */}
            <section className="portfolio-section">
                <div className="portfolio-section-header">
                    <div className="portfolio-section-tag">Career Journey</div>
                    <h2 className="portfolio-section-title">Professional Experience</h2>
                    <div className="portfolio-section-divider" />
                </div>
                <div className="portfolio-timeline">
                    {data.experience.map((item, i) => (
                        <TimelineItem key={i} item={item} index={i} />
                    ))}
                </div>
            </section>

            {/* ── Current Roles ── */}
            <section className="portfolio-section">
                <div className="portfolio-section-header">
                    <div className="portfolio-section-tag">Present</div>
                    <h2 className="portfolio-section-title">Current Roles</h2>
                    <div className="portfolio-section-divider" />
                </div>
                <div className="portfolio-roles-grid">
                    {data.currentRoles.map((role, i) => (
                        <RoleCard key={i} role={role} index={i} />
                    ))}
                </div>
            </section>

            {/* ── Skills ── */}
            <section className="portfolio-section">
                <div className="portfolio-section-header">
                    <div className="portfolio-section-tag">Expertise</div>
                    <h2 className="portfolio-section-title">Skills</h2>
                    <div className="portfolio-section-divider" />
                </div>
                <div className="portfolio-skills-grid">
                    {data.skills.map((skill, i) => (
                        <SkillCard key={i} skill={skill} index={i} />
                    ))}
                </div>
            </section>

            {/* ── Footer ── */}
            <div className="portfolio-footer">
                <p className="portfolio-footer-text">
                    © {new Date().getFullYear()} JSTARC — Master {master.name?.split(" ").slice(1).join(" ")}
                </p>
            </div>
        </div>
    );
};

export default MasterPortfolio;
