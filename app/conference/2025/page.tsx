import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import fetchChannelVideos from "@/lib/youtube"

export const metadata = {
  title: 'nullEDGE 2025 — Retrospective',
  description: 'Retrospective for the nullEDGE 2025 conference: session videos, feedback and resources',
}

export default async function Conference2025Page() {
  // Try to fetch videos from the public YouTube channel @thenulledge
  // fetched === null/[] means fetch succeeded but no videos; on error we fall back to DEFAULT_VIDEOS
  let fetched = [];
  try {
    fetched = await fetchChannelVideos('@thenulledge', 12) || [];
  } catch (e) {
    fetched = null as any; // signal error
  }
  const videos = Array.isArray(fetched) && fetched.length ? fetched : (fetched === null ? DEFAULT_VIDEOS : []);

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

        {/* Videos Grid */}
        <section className="max-w-6xl mx-auto mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Session Videos</h2>
            <p className="text-sm text-gray-400">Embedded YouTube replays</p>
          </div>

          {Array.isArray(fetched) && fetched.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold">No Videos For This Channel</h3>
              <p className="text-sm text-gray-400 mt-2">We couldn't find any videos on the configured YouTube channel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((v) => (
                <div key={v.id} className="bg-card border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-black">
                    <iframe
                      title={v.title}
                      src={`https://www.youtube.com/embed/${v.id}`}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      aria-label={`${v.title} video replay`}
                      sandbox="allow-same-origin allow-scripts allow-presentation"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium">{v.title}</h3>
                    {v.published && <p className="text-xs text-gray-400">{v.published}</p>}
                  </div>
                </div>
              ))}
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
    </div>
  )
}
