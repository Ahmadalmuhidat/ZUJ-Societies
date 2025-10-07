import FAQs from "./Components/FAQs";
import Contact from "./Components/Contact";

export default function Support() {
  return (
    <>
      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <FAQs />
            <Contact />
          </div>
        </div>
      </main>
    </>
  );
} 