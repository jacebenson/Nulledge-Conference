import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { SpeakersSection } from "@/components/speakers-section"
import { ScheduleSection } from "@/components/schedule-section"
import { CallForProposals } from "@/components/call-for-proposals"
import { Footer } from "@/components/footer"



export default function CallForProposalsPage() {
  return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <CallForProposals />
        </main>
        <Footer />
      </div>
    )
}