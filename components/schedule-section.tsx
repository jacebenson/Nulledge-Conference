import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin } from "lucide-react"

export function ScheduleSection() {
  const schedule = [
    {
      day: "Day 1 - December 15",
      events: [
        {
          time: "9:00 AM",
          title: "Registration & Welcome Coffee",
          speaker: "",
          location: "Main Lobby",
          type: "networking",
        },
        {
          time: "10:00 AM",
          title: "Opening Keynote: The Future of AI",
          speaker: "Sarah Chen",
          location: "Main Auditorium",
          type: "keynote",
        },
        {
          time: "11:30 AM",
          title: "Blockchain Revolution in Finance",
          speaker: "Marcus Rodriguez",
          location: "Tech Hall A",
          type: "talk",
        },
        {
          time: "1:00 PM",
          title: "Networking Lunch",
          speaker: "",
          location: "Exhibition Hall",
          type: "networking",
        },
      ],
    },
    {
      day: "Day 2 - December 16",
      events: [
        {
          time: "9:30 AM",
          title: "Cloud-Native Architecture",
          speaker: "Emily Watson",
          location: "Tech Hall B",
          type: "workshop",
        },
        {
          time: "11:00 AM",
          title: "Startup Success Stories",
          speaker: "David Kim",
          location: "Innovation Stage",
          type: "panel",
        },
        {
          time: "2:00 PM",
          title: "Hands-on AI Workshop",
          speaker: "Sarah Chen",
          location: "Workshop Room 1",
          type: "workshop",
        },
      ],
    },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "keynote":
        return "bg-primary text-primary-foreground"
      case "workshop":
        return "bg-green-500 text-white"
      case "panel":
        return "bg-blue-500 text-white"
      case "networking":
        return "bg-orange-500 text-white"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  return (
    <section id="schedule" className="py-20 md:py-32">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">Event Schedule</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Three days packed with inspiring talks, hands-on workshops, and networking opportunities.
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
