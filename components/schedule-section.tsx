import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin } from "lucide-react"

export function ScheduleSection() {
  const schedule = [
    {
      day: "Day 1 - October 17",
      events: [
        {
          time: "11:00 - 11:30 AM EST",
          title: "Welcome and Opening Remarks",
          speaker: "Jace Benson & Chuck Tomasi",
          location: "Main Session",
          type: "keynote",
        },
        {
          time: "11:30 - 12:00 AM EST",
          title: "Session 1: ",
          speaker: "Speaker TBD",
          location: "Main Session",
          type: "talk",
        },
        {
          time: "12:00 - 12:30 PM EST",
          title: "Session 2: ",
          speaker: "Speaker TBD",
          location: "Main Session",
          type: "workshop",
        },
        {
          time: "12:30 - 1:00 PM EST",
          title: "Session 3: ",
          speaker: "Speaker TBD",
          location: "Main Session",
          type: "talk",
        },
        {
          time: "1:00 - 2:00 PM EST",
          title: "Networking Session: ",
          speaker: "Group Discussion",
          location: "Breakout Rooms",
          type: "networking",
        },
        {
          time: "2:00 - 2:30 PM EST",
          title: "Session 4: ",
          speaker: "Speaker TBD",
          location: "Main Session",
          type: "workshop",
        },
        {
          time: "2:30 - 3:00 PM EST",
          title: "Session 5: ",
          speaker: "Speaker TBD",
          location: "Main Session",
          type: "talk",
        },
        {
          time: "3:00 - 3:30 PM EST",
          title: "Session 6: ",
          speaker: "Speaker TBD",
          location: "Main Session",
          type: "workshop",
        },
        {
          time: "3:30 - 4:00 PM EST",
          title: "Closing Remarks ",
          speaker: "Speaker TBD",
          location: "Main Session",
          type: "keynote",
        },
      ],
    },
  ]

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
          {schedule.map((day, dayIndex) => (
            <div key={dayIndex}>
              <h3 className="text-2xl font-bold mb-6">{day.day}</h3>
              <div className="grid gap-4">
                {day.events.map((event, eventIndex) => (
                  <Card key={eventIndex}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground min-w-[100px]">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">{event.time}</span>
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <h4 className="text-lg font-semibold">{event.title}</h4>
                            <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                            {event.speaker && <span>Speaker: {event.speaker}</span>}
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
