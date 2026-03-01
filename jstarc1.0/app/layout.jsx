import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { LoadingProvider } from '@/contexts/LoadingContext';
import SmoothScroll from '@/components/SmoothScroll';

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-display",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-mono",
});

export const metadata = {
    title: "JSTARC Taekwondo Academy Bengaluru | Premium Martial Arts Training",
    description: "JSTARC Taekwondo Academy Bengaluru offers world-class Taekwondo training by certified masters. Join us for self-defense, fitness, and competitive sparring.",
    keywords: ["JSTARC", "Taekwondo", "Bengaluru", "Martial Arts", "Self Defense", "Black Belt", "Training Academy", "Karate"],
    authors: [{ name: "JSTARC Taekwondo" }],
    openGraph: {
        type: "website",
        title: "JSTARC Taekwondo Academy Bengaluru",
        description: "Premium Taekwondo training by certified masters in Bengaluru. Self-defense, fitness & competitive sparring.",
        siteName: "JSTARC Taekwondo",
        images: ["/assets/logo.png"],
    },
    twitter: {
        card: "summary_large_image",
        title: "JSTARC Taekwondo Academy Bengaluru",
        description: "Premium Taekwondo training by certified masters in Bengaluru.",
        images: ["/assets/logo.png"],
    },
};

export default function RootLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SportsActivityLocation",
        "name": "JSTARC Taekwondo Academy",
        "url": "https://jstarc.in",
        "description": "Premium Taekwondo Training Academy in Bengaluru offering world-class martial arts training.",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Bengaluru",
            "addressCountry": "IN"
        },
        "sport": "Taekwondo"
    };

    return (
        <html lang="en" className="scroll-pt-28 scroll-smooth">
            <head>
                <link rel="icon" href="/assets/logo.png" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className={cn(
                spaceGrotesk.variable,
                jetbrainsMono.variable,
                "font-[family-name:var(--font-display)] antialiased relative"
            )}>
                <LoadingProvider>
                    <SmoothScroll>
                        <div className="min-h-screen relative overflow-x-hidden">
                            <div className="relative w-full">
                                {children}
                            </div>
                        </div>
                    </SmoothScroll>
                </LoadingProvider>
            </body>
        </html>
    );
}
