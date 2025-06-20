import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { ExternalLink } from "lucide-react"
import Link from "next/link";

export function SpeakersSection({ sessionData }) {
  let featuredSessions = sessionData.props.data.filter(function (event, index) {
    if (event.featured == "TRUE") { return true }
    return false
  })
  let featuredSpeakers = []
  featuredSessions.forEach(function (event) {
    if (event.speakers) {
      let speakers = event.speakers.replace('\n', '').split(',')
      let images = event.speakersImages.replace('\n', '').split(',')
      let titles = event.speakersTitles.replace('\n', '').split(',')
      let speakerURLs = event.speakersURLs.replace('\n', '').split(',')
      let employers = event.speakersEmployers.replace('\n', '').split(',')
      let employerURLs = event.speakersEmployerURLs.replace('\n', '').split(',')
      let employerImages = event.speakersEmployerImages.replace('\n', '').split(',')
      speakers.forEach(function (speaker, speakerIndex) {
        featuredSpeakers.push({
          name: speaker,
          image: images[speakerIndex]?.trim(),
          title: titles[speakerIndex],
          linkedin: speakerURLs[speakerIndex],
          company: employers[speakerIndex],
          employerURL: employerURLs[speakerIndex],
          employerImage: employerImages[speakerIndex],
          topics: []
        })
      })

    }
  })

  return (
    <section id="speakers" className="p-20 md:p-32 bg-muted/50">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">Featured Speakers</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn from industry experts and thought leaders who are driving innovation and shaping the future of
            technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSpeakers.map((speaker, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <Image
                  src={speaker.image || "/placeholder.svg"}
                  alt={speaker.name}
                  width={300}
                  height={300}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <h3 className="text-xl font-semibold">
                      {speaker.name}
                    </h3>
                    <span className="text-xl font-semibold content-center">
                      <Link
                        href={speaker.linkedin}
                        target="_blank"
                      ><ExternalLink /></Link>
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    {speaker.title} at {speaker.company}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {speaker.topics.map((topic, topicIndex) => (
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
      </div>
    </section>
  )
}
