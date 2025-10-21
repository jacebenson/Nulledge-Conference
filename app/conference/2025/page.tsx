import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { recordedSessions } from "./recordedSessions"
import YouTubeEmbed from "../../../components/ui/YouTubeEmbed"

export const metadata = {
  title: 'nullEDGE 2025 — Retrospective',
  description: 'Retrospective for the nullEDGE 2025 conference: session videos, feedback and resources',
}

export default async function Conference2025Page() {
  // Use the local recorded sessions data
  const videos = recordedSessions;
  const usingFallback = false;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">nullEDGE Conference 2025 — Retrospective</h1>
          <p className="text-lg text-muted-foreground">A place to find session replays, feedback, resources and highlights from the 2025 conference.</p>
        </div>

        {/* Highlights */}
        <section className="max-w-6xl mx-auto mb-10">
          <h2 className="text-2xl font-semibold mb-3">Highlights</h2>
          <p className="text-gray-300">nullEDGE 2025 brought together platform engineers, product owners and community leaders to discuss practical approaches to observability, cost optimization, and scalable platform design. Below are session replays and resources to help you catch up.</p>
        </section>

        {/* Session Schedule */}
        <section className="max-w-4xl mx-auto mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Conference Schedule</h2>
            <p className="text-sm text-gray-400">Click any session to watch the replay</p>
          </div>

          {usingFallback ? (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold">No Videos Available Yet</h3>
              <p className="text-sm text-gray-400 mt-2">
                Session videos will be published here after the conference. Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {(() => {
                // Group sessions by published time
                const sessionsByTime = videos.reduce((acc, session) => {
                  if (!acc[session.published]) {
                    acc[session.published] = [];
                  }
                  acc[session.published].push(session);
                  return acc;
                }, {} as Record<string, typeof videos>);

                const timeSlots = Object.keys(sessionsByTime);
                
                return timeSlots.map((time, timeIndex) => {
                  const sessions = sessionsByTime[time];
                  
                  return (
                    <div key={time} className="flex gap-4">
                      {/* Time and Duration - shared for all sessions at this time */}
                      <div className="flex-shrink-0 w-24 text-right">
                        <div className="text-sm font-medium text-primary">{time}</div>
                        <div className="text-xs text-muted-foreground">{sessions[0].duration} min</div>
                      </div>
                      
                      {/* Timeline connector */}
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        {timeIndex < timeSlots.length - 1 && (
                          <div className="w-0.5 bg-border flex-1 mt-2"></div>
                        )}
                      </div>
                      
                      {/* Sessions Content - horizontal layout for multiple sessions */}
                      <div className="flex-1 min-w-0">
                        {sessions.length === 1 ? (
                          // Single session - use full width with larger video
                          <div className="p-4 bg-card border rounded-lg hover:bg-card/80 transition-colors">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                              <div className="md:col-span-3 flex justify-center">
                                <div className="max-w-lg w-full">
                                  <YouTubeEmbed videoId={sessions[0].id} title={sessions[0].title} published={sessions[0].published} />
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Multiple sessions - responsive grid layout
                          <div className={`grid gap-4 ${sessions.length === 2 ? 'grid-cols-1 md:grid-cols-2' : sessions.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                            {sessions.map((session) => (
                              <div key={session.id} className="p-4 bg-card border rounded-lg hover:bg-card/80 transition-colors">
                                <div className="space-y-3">
                                  <div>
                                    <h3 className="font-medium text-sm mb-2 leading-tight">{session.title}</h3>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <span className="px-2 py-1 bg-background rounded-full">{session.duration} minutes</span>
                                    </div>
                                  </div>
                                  <div>
                                    <YouTubeEmbed videoId={session.id} title={session.title} published={session.published} />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </section>

        {/* Feedback and Resources */}
        <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Share Feedback</h2>
            <p className="text-sm text-gray-400 mb-4">We'd love to hear your thoughts on the conference. Submit feedback, suggestions or ideas for next year.</p>
            <Link href="/feedback" className="inline-block px-4 py-2 bg-primary text-black rounded-lg">Leave Feedback</Link>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Resources & Speakers</h2>
            <p className="text-sm text-gray-400 mb-4">Slides, recordings and speaker links will be published here.</p>
            <ul className="text-sm list-disc list-inside text-gray-300">
              <li>Session slides (coming soon)</li>
              <li>Speaker bios and links</li>
              <li>Further reading and examples</li>
            </ul>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
