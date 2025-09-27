import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getDataFromRingCentral } from "@/app/api/sheets"
import Image from "next/image"
import { Metadata } from "next"

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

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const sessionData = await getSheetData()
  const scheduleData = sessionData.props.data.filter((event: SessionEvent, index: number) => {
    return index === parseInt(id, 10) - 1
  })
  
  if (scheduleData.length === 0) {
    return {
      title: 'Session Not Found - nullEDGE Conference',
    }
  }
  
  const session = scheduleData[0]
  const speakerNames = session.speakers ? session.speakers.split(', ') : []
  
  return {
    title: `${session.title} - nullEDGE Conference`,
    description: `Join ${speakerNames.join(', ')} for "${session.title}" at nullEDGE Conference.`,
    openGraph: {
      title: session.title,
      description: `Join ${speakerNames.join(', ')} for "${session.title}" at nullEDGE Conference.`,
      images: [
        {
          url: `/sessions/${id}/opengraph-image`,
          width: 1500,
          height: 625,
          alt: session.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: session.title,
      description: `Join ${speakerNames.join(', ')} for "${session.title}" at nullEDGE Conference.`,
      images: [`/sessions/${id}/opengraph-image`],
    },
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const sessionData = await getSheetData()
    const scheduleData = sessionData.props.data.filter((event: SessionEvent, index: number) => {
        return index === parseInt(id, 10) - 1
    })
    
    if (scheduleData.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="flex items-center justify-center py-20">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold text-muted-foreground">Session Not Found</h1>
                        <p className="text-muted-foreground">The session you're looking for doesn't exist.</p>
                        <a href="/#schedule" className="inline-block mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                            Back to Schedule
                        </a>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }
    
    const session = scheduleData[0]
    const speakerImages = session.speakersImages ? session.speakersImages.split(', ') : []
    const speakerNames = session.speakers ? session.speakers.split(', ') : []
    
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Session Title */}
                    <h1 className="text-4xl font-bold text-center mb-8">{session.title}</h1>
                    
                    {/* Session Image */}
                    {session.image && (
                        <div className="mb-8 text-center">
                            <Image
                                src={session.image}
                                alt={session.title}
                                width={600}
                                height={400}
                                className="rounded-lg mx-auto"
                            />
                        </div>
                    )}
                    
                    {/* Speaker Information */}
                    {speakerNames.length > 0 && (
                        <div className="text-center space-y-6">
                            <h2 className="text-2xl font-semibold mb-6">
                                {speakerNames.length === 1 ? 'Speaker' : 'Speakers'}
                            </h2>
                            
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {speakerNames.map((speakerName: string, index: number) => (
                                    <div key={index} className="flex flex-col items-center space-y-3">
                                        {speakerImages[index] && (
                                            <Image
                                                src={speakerImages[index]}
                                                alt={speakerName}
                                                width={150}
                                                height={150}
                                                className="rounded-full"
                                            />
                                        )}
                                        <h3 className="text-xl font-medium">{speakerName}</h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Back to Schedule Link */}
                    <div className="text-center mt-12">
                        <a 
                            href="/#schedule" 
                            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                        >
                            Back to Schedule
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export async function getSheetData() {
    const sheet = await getDataFromRingCentral();
    return {
        props: {
            data: sheet.slice(0, sheet.length),
        },
        revalidate: 1,
    };
}