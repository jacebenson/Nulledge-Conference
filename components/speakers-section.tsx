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

// Below is the carousel for speakers section once more speakers are listed on the featured speaker section. This will save real estate on the site
// 'use client';
// import { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import Image from "next/image";
// import { ExternalLink } from "lucide-react";
// import Link from "next/link";

// export function SpeakersSection() {
//   const [featuredSpeakers, setFeaturedSpeakers] = useState<any[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const fetchSpeakers = async () => {
//       try {
//         const res = await fetch("https://events.ringcentral.com/api/v2/schedules/public/nulledge/items");
//         const data = await res.json();

//         const seen = new Set();
//         const speakers: any[] = [];

//         data.items.forEach(item => {
//           if (item.speakers && item.speakers.length > 0) {
//             item.speakers.forEach((speaker: any) => {
//               const uniqueKey = speaker.name + (speaker.linkedin || speaker.website || "");
//               if (!seen.has(uniqueKey)) {
//                 seen.add(uniqueKey);
//                 speakers.push({
//                   name: speaker.name,
//                   image: speaker.picture_url || "/placeholder.svg",
//                   title: speaker.headline || "",
//                   linkedin: speaker.linkedin || speaker.website || "",
//                   topics: item.tags?.map((tag: any) => tag.name) || [],
//                 });
//               }
//             });
//           }
//         });

//         setFeaturedSpeakers(speakers);
//       } catch (err) {
//         console.error("Error fetching speakers:", err);
//       }
//     };

//     fetchSpeakers();
//     const interval = setInterval(fetchSpeakers, 30000); // refresh every 30s
//     return () => clearInterval(interval);
//   }, []);

//   // Auto-scroll every 5 seconds
//   useEffect(() => {
//     if (featuredSpeakers.length === 0) return;

//     const interval = setInterval(() => {
//       setCurrentIndex(prev =>
//         (prev + 3) % featuredSpeakers.length
//       );
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [featuredSpeakers]);

//   const visibleSpeakers = featuredSpeakers.slice(currentIndex, currentIndex + 3);

//   // Handle wrap-around when near the end
//   const displaySpeakers =
//     visibleSpeakers.length < 3
//       ? [...visibleSpeakers, ...featuredSpeakers.slice(0, 3 - visibleSpeakers.length)]
//       : visibleSpeakers;

//   return (
//     <section id="speakers" className="p-20 md:p-32 bg-muted/50">
//       <div className="container text-center space-y-4 mb-16">
//         <h2 className="text-3xl md:text-5xl font-bold">Featured Speakers</h2>
//         <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//           Learn from industry experts and thought leaders who are driving innovation and shaping the future of technology.
//         </p>
//       </div>

//       <div className="flex justify-center gap-6 transition-transform duration-700">
//         {displaySpeakers.map((speaker, index) => (
//           <Card key={index} className="overflow-hidden w-80 flex-shrink-0">
//             <CardContent className="p-0">
//               <Image
//                 src={speaker.image}
//                 alt={speaker.name}
//                 width={300}
//                 height={300}
//                 className="w-full h-64 object-cover"
//               />
//               <div className="p-6 space-y-3">
//                 <div className="flex items-center gap-2 justify-center">
//                   <h3 className="text-xl font-semibold">{speaker.name}</h3>
//                   {speaker.linkedin && (
//                     <Link href={speaker.linkedin} target="_blank">
//                       <ExternalLink />
//                     </Link>
//                   )}
//                 </div>
//                 <p className="text-muted-foreground">{speaker.title}</p>
//                 <div className="flex flex-wrap justify-center gap-2">
//                   {speaker.topics.map((topic: string, topicIndex: number) => (
//                     <Badge key={topicIndex} variant="secondary">{topic}</Badge>
//                   ))}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </section>
//   );
// }
