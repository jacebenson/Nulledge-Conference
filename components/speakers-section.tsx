"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

// ✅ Simple hook to track screen size
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

export function SpeakersSection() {
  const [featuredSpeakers, setFeaturedSpeakers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const isMobile = useIsMobile();

  // ✅ dynamic page size
  const pageSize = isMobile ? 1 : 4;
  const totalPages = Math.ceil(featuredSpeakers.length / pageSize);

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const res = await fetch(
          "https://events.ringcentral.com/api/v2/schedules/public/nulledge/items"
        );
        const data = await res.json();

        const seen = new Set();
        const speakers: any[] = [];

        data.items.forEach((item: any) => {
          if (item.speakers && item.speakers.length > 0) {
            item.speakers.forEach((speaker: any) => {
              const uniqueKey =
                speaker.name + (speaker.linkedin || speaker.website || "");
              if (!seen.has(uniqueKey)) {
                seen.add(uniqueKey);
                speakers.push({
                  name: speaker.name,
                  image: speaker.picture_url || "/placeholder.svg",
                  title: speaker.headline || "",
                  linkedin: speaker.linkedin || speaker.website || "",
                  topics: item.tags?.map((tag: any) => tag.name) || [],
                });
              }
            });
          }
        });

        setFeaturedSpeakers(speakers);
      } catch (err) {
        console.error("Error fetching speakers:", err);
      }
    };

    fetchSpeakers();
    const interval = setInterval(fetchSpeakers, 30000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Auto-scroll (always, but useful for mobile slideshow feel)
  useEffect(() => {
    if (featuredSpeakers.length === 0) return;

    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredSpeakers, totalPages]);

  // ✅ Slice based on page number
  const start = currentPage * pageSize;
  const displaySpeakers = featuredSpeakers.slice(start, start + pageSize);

  return (
    <section id="speakers" className="p-20 md:p-24 bg-muted/50">
      <div className="container text-center space-y-4 mb-16">
        <h2 className="text-3xl md:text-5xl font-bold">Featured Speakers</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Learn from industry experts and thought leaders who are driving
          innovation and shaping the future of technology.
        </p>
      </div>

      {/* Carousel */}
      <div className="flex justify-center gap-6 transition-transform duration-700 overflow-hidden">
        {displaySpeakers.map((speaker, index) => (
          <Card
            key={start + index}
            className={`overflow-hidden ${
              isMobile ? "w-full" : "w-80"
            } flex-shrink-0`}
          >
            <CardContent className="p-0">
              <Image
                src={speaker.image}
                alt={speaker.name}
                width={300}
                height={300}
                className="w-full h-64 object-cover"
              />
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 justify-center">
                  <h3 className="text-xl font-semibold">{speaker.name}</h3>
                  {speaker.linkedin && (
                    <Link href={speaker.linkedin} target="_blank">
                      <ExternalLink />
                    </Link>
                  )}
                </div>
                <p className="text-muted-foreground">{speaker.title}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {speaker.topics.map((topic: string, topicIndex: number) => (
                    <Badge key={topicIndex} variant="secondary">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Indicators */}
      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`h-3 rounded-full transition-all duration-500 ${
              i === currentPage ? "bg-primary w-6" : "bg-gray-400 w-3"
            }`}
            aria-label={`Go to page ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
