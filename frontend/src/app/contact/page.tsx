import Navbar from "@/components/layout/Navbar";
import ContactHero from "@/components/sections/ContactHero";
import FAQ from "@/components/sections/FAQ";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#EAF5FB]">
      <Navbar />
      <ContactHero />
      <FAQ />
    </main>
  );
}