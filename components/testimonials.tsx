"use client";

import { useEffect, useState } from "react";

interface Testimonial {
  who: string;
  what: string;
  where: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);

  // Fetch testimonials
  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch("/api/testimonials");
        if (!res.ok) throw new Error("Failed to fetch testimonials");
        const data: Testimonial[] = await res.json();
        setTestimonials(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  // Auto advance every 30 seconds
  useEffect(() => {
    if (testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 30000);

    return () => clearInterval(interval);
  }, [testimonials]);

  if (loading) return <p>Loading testimonials...</p>;
  if (error) return <p>Error: {error}</p>;
  if (testimonials.length === 0) return <p>No testimonials found.</p>;

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-bold">Testimonials</h2>
        <p className="text-gray-600 mt-2">
          Hear what people are saying about our event.
        </p>
      </div>

      {/* Carousel container */}
      <div className="relative overflow-hidden h-72 flex items-center justify-center">
        <div
          className="flex transition-transform duration-700 ease-in-out w-full"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="w-full flex-shrink-0 flex justify-center px-4"
            >
              <div className="dark:bg-white bg-primary/5 border rounded-2xl shadow-md p-6 max-w-xl w-full text-center flex flex-col items-center justify-center">
                <p className="text-gray-700 italic mb-4">"{t.what}"</p>
                <h3 className="font-semibold dark:text-gray-900">{t.who}</h3>
                <a
                  href={t.where}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                >
                  View Post
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots navigation */}
      <div className="flex justify-center space-x-2 mt-6">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-colors ${
              idx === current ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
