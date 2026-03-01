import { Team } from "@/components/Team";
import { Navbar } from "@/components/Navbar";
import { Contact } from "@/components/Contact";

export default function TeamPage() {
    return (
        <main className="min-h-screen text-[#121212] selection:bg-[#121212] selection:text-[#FBFF48]">
            <Navbar />
            <div className="pt-32">
                <Team />
            </div>
            <Contact />
        </main>
    );
}