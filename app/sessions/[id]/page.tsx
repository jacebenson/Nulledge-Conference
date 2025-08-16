import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SessionDetails } from "@/components/session-details"
import { getDataFromRingCentral } from "@/app/api/sheets"

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
    
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main>
                <SessionDetails session={session} />
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