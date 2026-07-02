import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import Benefits from "@/components/sections/Benefits";

export default function Home() {
  return (
    <main className="bg-white dark:bg-[#0F111C] transition duration-1000">
      <Navbar />
      <Hero />
      <Stats />
      <Benefits />
    </main>
  );
}
