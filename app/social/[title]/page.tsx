import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getDataFromRingCentral } from "@/app/api/sheets"
import Image from "next/image"
import { Metadata } from "next"
import Link from "next/link"

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

export async function generateMetadata(
  { params }: { params: Promise<{ title: string }> }
): Promise<Metadata> {
  const { title } = await params
  const sessionData = await getSheetData()
  
  // Find session by title slug
  const session = sessionData.props.data.find((event: SessionEvent) => {
    const titleSlug = slugify(event.title)
    return titleSlug === title
  })
  
  if (!session) {
    return {
      title: 'Session Not Found - nullEDGE Conference',
    }
  }
  
  const speakerNames = session.speakers ? session.speakers.split(', ') : []
  
  return {
    title: `${session.title} - Social Media - nullEDGE Conference`,
    description: `Social media images for "${session.title}" featuring ${speakerNames.join(', ')} at nullEDGE Conference.`,
    openGraph: {
      title: session.title,
      description: `Join ${speakerNames.join(', ')} for "${session.title}" at nullEDGE Conference.`,
      images: [
        {
          url: `/social/${title}/story-image`,
          width: 1200,
          height: 1350,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: session.title,
      description: `Join ${speakerNames.join(', ')} for "${session.title}" at nullEDGE Conference.`,
      images: [`/social/${title}/story-image`],
    },
  }
}

export default async function SocialSessionPage({ params }: { params: Promise<{ title: string }> }) {
  const { title } = await params
  const sessionData = await getSheetData()
  
  // Find session by title slug
  const session = sessionData.props.data.find((event: SessionEvent) => {
    const titleSlug = slugify(event.title)
    return titleSlug === title
  })
  
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Session Not Found</h1>
            <p className="text-gray-400">The session you're looking for doesn't exist.</p>
            <Link 
              href="/social"
              className="inline-block mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Back to Social Media Images
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const speakerNames = session.speakers ? session.speakers.split(', ') : []
  const speakerImages = session.speakersImages ? session.speakersImages.split(', ') : []
  const speakerTitles = session.speakersTitles ? session.speakersTitles.split(', ') : []
  
  // Find the session index for the OG image link
  const sessionIndex = sessionData.props.data.findIndex((event: SessionEvent) => {
    const titleSlug = slugify(event.title)
    return titleSlug === title
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="mb-6">
            <Link 
              href="/social"
              className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              ← Back to Social Media Images
            </Link>
          </div>

          {/* Session Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {session.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-gray-300">
              <span className="bg-blue-600/20 px-3 py-1 rounded-full">
                {session.type}
              </span>
              <span>{session.date}</span>
              <span>{session.startTime} - {session.endTime}</span>
            </div>
          </div>

          {/* Social Media Images */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-blue-400">
              Social Media Images
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/30 rounded-lg p-6 backdrop-blur-sm border border-gray-700">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">Session Banner Image</h3>
                <p className="text-gray-400 text-sm mb-4">1500×625px - Perfect for RingCentral Session</p>
                <div className="flex gap-3">
                  <Link
                    href={`/sessions/${sessionIndex + 1}/opengraph-image`}
                    target="_blank"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Image
                  </Link>
                  <Link
                    href={`/sessions/${sessionIndex + 1}`}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Session Page
                  </Link>
                </div>
              </div>
              
              <div className="bg-gray-800/30 rounded-lg p-6 backdrop-blur-sm border border-gray-700">
                <h3 className="text-lg font-semibold text-purple-400 mb-4">Story Image</h3>
                <p className="text-gray-400 text-sm mb-4">1200×1350px - Perfect for Instagram Stories, mobile sharing</p>
                <div className="flex gap-3">
                  <Link
                    href={`/social/${title}/story-image`}
                    target="_blank"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Image
                  </Link>
                  <a
                    href={`/social/${title}/story-image`}
                    download={`${session.title}-story.png`}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Download
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Speakers Section */}
          {speakerNames.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 text-blue-400">
                {speakerNames.length === 1 ? 'Speaker' : 'Speakers'}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {speakerNames.map((speaker: string, index: number) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-gray-700">
                    {speakerImages[index] && (
                      <div className="mb-4">
                        <Image
                          src={speakerImages[index]}
                          alt={speaker}
                          width={120}
                          height={120}
                          className="rounded-full mx-auto object-cover"
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-semibold text-center mb-2">
                      {speaker}
                    </h3>
                    {speakerTitles[index] && (
                      <p className="text-gray-400 text-center text-sm">
                        {speakerTitles[index]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Session Description */}
          {session.description && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-blue-400">About This Session</h2>
              <div className="bg-gray-800/30 rounded-lg p-6 backdrop-blur-sm border border-gray-700">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {session.description}
                </p>
              </div>
            </div>
          )}

          {/* Usage Instructions */}
          <div className="mt-12 bg-gray-800/30 rounded-lg p-6 backdrop-blur-sm border border-gray-700">
            <h3 className="text-lg font-semibold text-yellow-400 mb-4">How to Use These Images</h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• <strong>Standard OG Images:</strong> Perfect for sharing links on Twitter, Facebook, LinkedIn</li>
              <li>• <strong>Story Images:</strong> Ideal for Instagram Stories, mobile-first social media posts</li>
              <li>• <strong>Download:</strong> Right-click any image and select "Save Image As..." to download</li>
              <li>• <strong>Sharing:</strong> These images will automatically appear when sharing session URLs</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}