import { Navbar } from "@/components/Navbar";
import Loader from "@/components/Loader";
import HeroClipMask from "@/components/HeroClipMask";
import { MastersScroll } from "@/components/MastersScroll";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { StatsSlider } from "@/components/StatsSlider";
import { PowerBrands } from "@/components/PowerBrands";
import { Affiliations } from "@/components/Affiliations";
import { MarqueeGallery } from "@/components/MarqueeGallery";
import { Contact } from "@/components/Contact";

export default function Home() {
    return (
        <main className="min-h-screen text-[#121212] selection:bg-[#121212] selection:text-[#FBFF48]">
            <Loader />
            <Navbar />
            <HeroClipMask />
            <MastersScroll />
            <WhyChooseUs />
            <StatsSlider />
            <PowerBrands />
            <Affiliations />
            <MarqueeGallery />
            <Contact />
        </main>
    );
}
