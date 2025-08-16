'use client';

import React from "react";
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Building, 
  ArrowLeft, 
  ExternalLink,
  Users
} from "lucide-react";

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

interface Speaker {
  name: string;
  title: string;
  image: string;
  url: string;
  employer: string;
  employerUrl: string;
  employerImage: string;
}

export function SessionDetails({ session }: { session: SessionEvent }) {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "introduction":
        return "bg-yellow-500 text-white";
      case "keynote":
        return "bg-primary text-primary-foreground";
      case "workshop":
        return "bg-green-500 text-white";
      case "talk":
        return "bg-blue-500 text-white";
      case "networking":
        return "bg-orange-500 text-white";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  // Parse speaker data
  const speakers: Speaker[] = React.useMemo(() => {
    if (!session.speakers) return [];
    
    const names = session.speakers.split(',').map(s => s.trim());
    const titles = session.speakersTitles?.split(',').map(s => s.trim()) || [];
    const images = session.speakersImages?.split(',').map(s => s.trim()) || [];
    const urls = session.speakersURLs?.split(',').map(s => s.trim()) || [];
    const employers = session.speakersEmployers?.split(',').map(s => s.trim()) || [];
    const employerUrls = session.speakersEmployerURLs?.split(',').map(s => s.trim()) || [];
    const employerImages = session.speakersEmployerImages?.split(',').map(s => s.trim()) || [];

    return names.map((name, index) => ({
      name,
      title: titles[index] || '',
      image: images[index]?.trim() || '/placeholder-user.jpg',
      url: urls[index] || '',
      employer: employers[index] || '',
      employerUrl: employerUrls[index] || '',
      employerImage: employerImages[index] || ''
    }));
  }, [session]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        
        <div className="container relative z-10">
          <div className="mb-8">
            <Button variant="ghost" asChild className="group">
              <Link href="/#schedule" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Schedule
              </Link>
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3 items-center">
                  <Badge className={getTypeColor(session.type)}>
                    {session.type}
                  </Badge>
                  {session.featured && (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                      Featured
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                  {session.title}
                </h1>
                
                {session.description && session.description !== session.title && (
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {session.description}
                  </p>
                )}
              </div>

              {/* Session Info Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{session.date}</p>
                        <p className="text-sm text-muted-foreground">Conference Date</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{session.startTime} - {session.endTime} EST</p>
                        <p className="text-sm text-muted-foreground">Session Time</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {session.location && (
                  <Card className="sm:col-span-2">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{session.location}</p>
                          <p className="text-sm text-muted-foreground">Location</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            <div className="order-first lg:order-last">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl transform rotate-3" />
                <Card className="relative">
                  <CardContent className="p-0">
                    <Image
                      src={session.image || '/placeholder.svg'}
                      alt={session.title}
                      width={600}
                      height={400}
                      className="w-full h-auto rounded-lg object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Speakers Section */}
      {speakers.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {speakers.length === 1 ? 'Speaker' : 'Speakers'}
              </h2>
              <p className="text-xl text-muted-foreground">
                Meet the expert{speakers.length > 1 ? 's' : ''} presenting this session
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {speakers.map((speaker, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="relative mx-auto w-24 h-24">
                        <Image
                          src={speaker.image || '/placeholder-user.jpg'}
                          alt={speaker.name}
                          width={96}
                          height={96}
                          className="w-full h-full rounded-full object-cover border-4 border-background shadow-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-user.jpg';
                          }}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">{speaker.name}</h3>
                        {speaker.title && (
                          <p className="text-muted-foreground">{speaker.title}</p>
                        )}
                        {speaker.employer && (
                          <div className="flex items-center justify-center gap-2 text-sm">
                            <Building className="h-4 w-4" />
                            {speaker.employerUrl ? (
                              <a 
                                href={speaker.employerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors"
                              >
                                {speaker.employer}
                                <ExternalLink className="h-3 w-3 inline ml-1" />
                              </a>
                            ) : (
                              <span>{speaker.employer}</span>
                            )}
                          </div>
                        )}
                      </div>

                      {speaker.url && (
                        <Button variant="outline" size="sm" asChild>
                          <a 
                            href={speaker.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <User className="h-4 w-4" />
                            View Profile
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Session Actions */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold">Ready to Join?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/#schedule" className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  View Full Schedule
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/#tickets" className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Get Tickets
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Debug Section (can be hidden in production) */}
      <section className="py-8 bg-muted/50">
        <div className="container">
          <details className="max-w-4xl mx-auto">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground mb-4">
              View session data (for debugging)
            </summary>
            <Card>
              <CardContent className="p-6">
                <pre className="text-xs bg-background p-4 rounded-md overflow-auto">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </details>
        </div>
      </section>
    </div>
  );
}
