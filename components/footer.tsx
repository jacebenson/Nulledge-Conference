import Link from "next/link"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container p-12 md:p-16">
        <div className="flex flex-col md:flex-row justify-center items-stretch md:space-x-12 space-y-8 md:space-y-0">
          <div className="flex-1 flex flex-col items-center md:items-start space-y-6 min-w-[200px]">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">N</span>
          </div>
          <span className="font-bold text-xl">Nulledge</span>
        </div>
        <p className="text-muted-foreground text-center md:text-left">
          Connecting innovators and shaping the future of ServiceNow<sup>™</sup>.
        </p>
        <div className="flex space-x-4 justify-center md:justify-start">
          <Link href="#" className="text-muted-foreground hover:text-primary">
            <Twitter className="h-5 w-5" />
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary">
            <Linkedin className="h-5 w-5" />
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary">
            <Github className="h-5 w-5" />
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary">
            <Mail className="h-5 w-5" />
          </Link>
        </div>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start space-y-6 min-w-[200px]">
        <h3 className="font-semibold">Event</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <Link href="#about" className="hover:text-primary">
          About
            </Link>
          </li>
          <li>
            <Link href="#speakers" className="hover:text-primary">
          Speakers
            </Link>
          </li>
          <li>
            <Link href="#schedule" className="hover:text-primary">
          Schedule
            </Link>
          </li>
          <li>
            <Link href="#tickets" className="hover:text-primary">
          Tickets
            </Link>
          </li>
        </ul>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start space-y-6 min-w-[200px]">
        <h3 className="font-semibold">Support</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <Link href="#" className="hover:text-primary">
          Contact
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-primary">
          FAQ
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-primary">
          Help Center
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-primary">
          Venue Info
            </Link>
          </li>
        </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Nulledge Conference. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
