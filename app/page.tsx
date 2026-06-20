import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Journey from "@/components/Journey";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import DigitalTwin from "@/components/DigitalTwin";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="relative">
        <Hero />
        {/* Divider between hero and content */}
        <div className="relative">
          <About />
          <Journey />
          <Skills />
          <Contact />
        </div>
      </main>
      <Footer />
      <DigitalTwin />
    </>
  );
}
