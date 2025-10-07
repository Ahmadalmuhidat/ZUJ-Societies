import React, { useEffect, useState } from 'react';
import NewSocietyForm from './Components/NewSocietyForm';

export default function NewSociety() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <>
      <main className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a New Society</h1>
            <p className="text-lg text-gray-600">
              Start building your community and connect with like-minded people
            </p>
          </div>

          <NewSocietyForm />
        </div>
      </main>
    </>
  );
}
