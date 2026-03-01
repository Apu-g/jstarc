import { About } from "@/components/About";
import { Navbar } from "@/components/Navbar";
import { Contact } from "@/components/Contact";

export default function AboutPage() {
    return (
        <main className="min-h-screen text-white selection:bg-red-600 selection:text-white">
            <Navbar />
            <div className="pt-20">
                <About />
                {/* We can add more specific about content here if needed */}
            </div>
            <Contact />
        </main>
    );
}
