import Hero from "./Components/Hero";
import Features from "./Components/Features";
import Contact from "./Components/Contact";

export default function About() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Hero />
        <Features />
        <Contact />
      </div>
    </main>
  );
} 