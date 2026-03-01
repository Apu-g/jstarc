import { Events } from "@/components/Events";
import { Navbar } from "@/components/Navbar";
import { Contact } from "@/components/Contact";

export default function EventsPage() {
    return (
        <main className="min-h-screen text-white selection:bg-red-600 selection:text-white">
            <Navbar />
            <div className="pt-20">
                <Events />
            </div>
            <Contact />
        </main>
    );
}
