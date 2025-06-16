'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin } from "lucide-react"

export function ScheduleSection({ sessionData }) {
  const [scheduleData, setScheduleData] = useState(
    sessionData.props.data.filter((_, index) => index !== 0)
  );

  // Poll for updates every 30 seconds (adjust as needed)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/schedule");
        if (res.ok) {
          const data = await res.json();
          const filteredData = data.filter((_, index) => index !== 0);

          // Compare new data with current state
          if (JSON.stringify(filteredData) !== JSON.stringify(scheduleData)) {
            setScheduleData(filteredData);
          }
        }
      } catch (err) {
        // Optionally handle error
      }
    };

    fetchData(); // Fetch immediately on mount
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [scheduleData]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "introduction":
        return "bg-yellow-500 text-white"
      case "keynote":
        return "bg-primary text-primary-foreground"
      case "workshop":
        return "bg-green-500 text-white"
      case "talk":
        return "bg-blue-500 text-white"
      case "networking":
        return "bg-orange-500 text-white"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  return (
    <section id="schedule" className="p-20 md:p-32">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">Event Schedule</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join us for a day packed with inspiring talks, hands-on workshops, and networking opportunities.
          </p>
        </div>
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-bold mb-6">Day 1 - October 17</h3>
            <div className="grid gap-4">
              {scheduleData.map((event, eventIndex) => (
                <Link
                  key={eventIndex}
                  href={`/sessions/${eventIndex + 1}`}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground min-w-[100px]">
                          <Clock className="h-4 w-4" />
                          <details className="inline">
                            <summary className="list-none text-sm">
                              <span className="font-medium" title={`${event.startTime}-${event.endTime}`}>{event.startTime} EST</span>
                            </summary>
                            <span className="font-medium">{event.startTime} - {event.endTime}</span>
                          </details>
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <h4 className="text-lg font-semibold">{event.title}</h4>
                            <Badge className={getTypeColor(event.type.toLowerCase())}>{event.type}</Badge>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                            {event?.speakers && <span>Speaker(s): {event.speakers}</span>}
                            {event?.location &&
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{event?.location}</span>
                              </div>
                            }
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
