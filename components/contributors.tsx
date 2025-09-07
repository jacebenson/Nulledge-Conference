"use client";

import { useEffect, useState } from "react";

interface Contributor {
  name: string;
  role: string;
  bio: string;
  photo: string;
  website?: string;
  linkedin?: string;
}

export default function Contributors() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContributors() {
      try {
        const res = await fetch("/api/contributors"); // ✅ correct API route
        if (!res.ok) throw new Error("Failed to fetch contributors");
        const data: Contributor[] = await res.json();
        setContributors(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchContributors();
  }, []);

  if (loading) return <p>Loading contributors...</p>;
  if (error) return <p>Error: {error}</p>;
  if (contributors.length === 0) return <p>No contributors found.</p>;

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">Contributors</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet the amazing individuals who have contributed to this conference. Their dedication and expertise have been invaluable. A lot of hard work and countless hours volunteered to make this happen. Make sure to connect with them!
          </p>
        </div>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {contributors.map((contributor, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow"
          >
            {contributor.photo && (
              <img
                src={contributor.photo}
                alt={contributor.name}
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
            )}
            <h2 className="text-xl font-semibold text-center">{contributor.name}</h2>
            <p className="text-gray-500 text-center mb-2">{contributor.role}</p>
            <p className="text-center text-sm mb-4">{contributor.bio}</p>
            <div className="flex space-x-3">
              {contributor.website && (
                <a
                  href={contributor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Website
                </a>
              )}
              {contributor.linkedin && (
                <a
                  href={contributor.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
