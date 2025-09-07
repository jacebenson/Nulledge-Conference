'use client';

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Clock, Users } from "lucide-react";

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  month: string;
  day: string;
}

export function Timeline() {
  const timelineEvents: TimelineEvent[] = [
    {
      date: "August 17, 2025",
      title: "CFP Closes",
      description: "Final deadline for session proposals",
      status: 'completed',
      month: "AUG",
      day: "17"
    },
    {
      date: "August 25, 2025",
      title: "Speakers Selected",
      description: "Session proposals reviewed and speakers chosen",
      status: 'upcoming',
      month: "AUG",
      day: "25"
    },
    {
      date: "September 21-27, 2025",
      title: "Speakers Announced",
      description: "Selected speakers and sessions revealed",
      status: 'upcoming',
      month: "SEP",
      day: "21-27"
    },
    {
      date: "October 17, 2025",
      title: "Conference Day",
      description: "nullEDGE Conference 2025",
      status: 'upcoming',
      month: "OCT",
      day: "17"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'current':
        return 'bg-blue-500 text-white';
      case 'upcoming':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      case 'current':
        return <Clock className="h-5 w-5" />;
      case 'upcoming':
        return <Calendar className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  // Get current date to determine status
  const currentDate = new Date();
  const cfpCloseDate = new Date('2025-08-17');
  const speakersSelectedDate = new Date('2025-08-25');
  const speakersAnnouncedDate = new Date('2025-09-21');
  const conferenceDate = new Date('2025-10-17');

  // Update status based on current date
  const updatedEvents = timelineEvents.map(event => {
    if (event.title === "CFP Closes") {
      return { ...event, status: currentDate > cfpCloseDate ? 'completed' : 'upcoming' as const };
    }
    if (event.title === "Speakers Selected") {
      return { 
        ...event, 
        status: currentDate >= speakersSelectedDate ? 'completed' : 
                currentDate >= cfpCloseDate ? 'current' : 'upcoming' as const 
      };
    }
    if (event.title === "Speakers Announced") {
      return { 
        ...event, 
        status: currentDate >= speakersAnnouncedDate ? 'completed' : 
                currentDate >= speakersSelectedDate ? 'current' : 'upcoming' as const 
      };
    }
    if (event.title === "Conference Day") {
      return { 
        ...event, 
        status: currentDate >= conferenceDate ? 'completed' : 
                currentDate >= speakersAnnouncedDate ? 'current' : 'upcoming' as const 
      };
    }
    return event;
  });

  return (
    <section id="timeline" className="p-20 md:p-32 bg-muted/50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Conference Timeline
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Important dates and milestones for nullEDGE Conference 2025
          </p>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {updatedEvents.map((event, index) => (
              <Card key={index} className="relative group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    {/* Calendar Icon */}
                    <div className="relative mx-auto w-16 h-16">
                      <div className="w-full h-full bg-primary/10 rounded-lg flex flex-col items-center justify-center border-2 border-primary/20">
                        <div className="text-xs font-bold text-primary/60 uppercase">
                          {event.month}
                        </div>
                        <div className="text-lg font-bold text-primary">
                          {event.day}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <Badge className={getStatusColor(event.status)}>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(event.status)}
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </div>
                    </Badge>

                    {/* Event Details */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                      <p className="text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-3xl mx-auto">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Ready to Share Your Knowledge?</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  The Call for Papers has closed for 2025, but stay tuned for future opportunities to share your expertise with the nullEDGE community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <a 
                    href="/#schedule" 
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    View Schedule
                  </a>
                  <a 
                    href="/#tickets" 
                    className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors"
                  >
                    <Users className="h-5 w-5 mr-2" />
                    Get Tickets
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
