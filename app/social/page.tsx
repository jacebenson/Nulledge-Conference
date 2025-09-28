import { getDataFromRingCentral } from "@/app/api/sheets"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface SessionEvent {
  title: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  image: string;
  description: string;
  speakers: string;
  speakersTitles: string;
  speakersImages: string;
  speakersURLs: string;
  speakersEmployers: string;
  speakersEmployerURLs: string;
  speakersEmployerImages: string;
  featured: boolean;
  location?: string;
}

// Function to create a slug from text
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

async function getSheetData() {
  const data = await getDataFromRingCentral()
  return {
    props: {
      data: data || []
    }
  }
}

export const metadata = {
  title: 'Social Media Images - nullEDGE Conference',
  description: 'Generated social media images for all nullEDGE Conference sessions',
}

export default async function SocialPage() {
  const sessionData = await getSheetData()
  const sessions: SessionEvent[] = sessionData.props.data

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Social Media Images
            </h1>
            <p className="text-gray-300 text-lg">
              Generated social media images for all nullEDGE Conference sessions
            </p>
          </div>

          {/* Format Options */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/30 rounded-lg p-6 backdrop-blur-sm border border-gray-700">
              <h2 className="text-xl font-semibold text-blue-400 mb-2">Session Banner Image</h2>
              <p className="text-gray-400 text-sm mb-4">1500×625px - for RingCentral Session</p>
              <div className="text-xs text-gray-500">
                Format: /sessions/[id]/opengraph-image
              </div>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-6 backdrop-blur-sm border border-gray-700">
              <h2 className="text-xl font-semibold text-purple-400 mb-2">Story Images</h2>
              <p className="text-gray-400 text-sm mb-4">1200×1350px - Perfect for Instagram Stories, mobile-first sharing</p>
              <div className="text-xs text-gray-500">
                Format: /social/[talk-title]/story-image
              </div>
            </div>
          </div>

          {/* Sessions List */}
          <div className="grid gap-4">
            {sessions.map((session, index) => {
              const titleSlug = slugify(session.title)
              const speakerNames = session.speakers ? session.speakers.split(', ') : []
              
              return (
                <div key={index} className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-gray-700 hover:border-blue-500/50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Session Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {session.title}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-2">
                        <span className="bg-blue-600/20 px-2 py-1 rounded">
                          {session.type}
                        </span>
                        <span>{session.date}</span>
                        {speakerNames.length > 0 && (
                          <span>👤 {speakerNames.join(', ')}</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Links */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href={`/sessions/${index + 1}/opengraph-image`}
                        target="_blank"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors text-center"
                      >
                        Banner (1500×625)
                      </Link>
                      <Link
                        href={`/social/${titleSlug}/story-image`}
                        target="_blank"
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors text-center"
                      >
                        Story Image (1200×1350)
                      </Link>
                      <Link
                        href={`/social/${titleSlug}`}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors text-center"
                      >
                        View Page
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer Info */}
          <div className="mt-12 text-center text-gray-400 text-sm">
            <p>All images are generated dynamically using @vercel/og</p>
            <p className="mt-2">Right-click and "Save Image As..." to download any image</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}