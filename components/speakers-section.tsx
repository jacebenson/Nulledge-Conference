'use client';
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export function SpeakersSection() {
  const [featuredSpeakers, setFeaturedSpeakers] = useState([]);

  useEffect(() => {
  const fetchSpeakers = async () => {
    try {
      const res = await fetch("https://events.ringcentral.com/api/v2/schedules/public/nulledge/items");
      const data = await res.json();

      const seen = new Set();
      const speakers = [];

      data.items.forEach(item => {
        if (item.speakers && item.speakers.length > 0) {
          item.speakers.forEach(speaker => {
            const uniqueKey = speaker.name + (speaker.linkedin || speaker.website || "");
            if (!seen.has(uniqueKey)) {
              seen.add(uniqueKey);
              speakers.push({
                name: speaker.name,
                image: speaker.picture_url || "/placeholder.svg",
                title: speaker.headline || "",
                linkedin: speaker.linkedin || speaker.website || "",
                topics: item.tags?.map(tag => tag.name) || [],
              });
            }
          });
        }
      });

      // Only update state if something changed
      setFeaturedSpeakers(prev =>
        JSON.stringify(prev) !== JSON.stringify(speakers) ? speakers : prev
      );
    } catch (err) {
      console.error("Error fetching speakers:", err);
    }
  };

  fetchSpeakers(); // initial fetch
  const interval = setInterval(fetchSpeakers, 30000); // poll every 30s
  return () => clearInterval(interval);
}, []); // empty dependency array



  return (
    <section id="speakers" className="p-20 md:p-32 bg-muted/50">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">Featured Speakers</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn from industry experts and thought leaders who are driving innovation and shaping the future of technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSpeakers.map((speaker, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <Image
                  src={speaker.image}
                  alt={speaker.name}
                  width={300}
                  height={300}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6 space-y-3">
                  <div className="flex flex-wrap gap-2 items-center">
                    <h3 className="text-xl font-semibold">{speaker.name}</h3>
                    {speaker.linkedin && (
                      <Link href={speaker.linkedin} target="_blank">
                        <ExternalLink />
                      </Link>
                    )}
                  </div>
                  <p className="text-muted-foreground">{speaker.title}</p>
                  <div className="flex flex-wrap gap-2">
                    {speaker.topics.map((topic, topicIndex) => (
                      <Badge key={topicIndex} variant="secondary">{topic}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
