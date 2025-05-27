import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

export function TicketsSection() {
  const tickets = [
    {
      name: "Early Bird",
      price: "$FREE",
      originalPrice: "$1,000,000",
      description: "Perfect for individual attendees",
      features: ["Access to all sessions", "Welcome kit", "Networking events", "Digital resources"],
      popular: false,
      available: true,
    },
  ]

  return (
    <section id="tickets" className="p-20 md:p-32 bg-muted/50">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">Get Your Tickets</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect ticket for your needs. Early bird pricing available for a limited time.
          </p>
        </div>

        <div className="flex justify-center">
          {tickets.map((ticket, index) => (
            <Card
              key={index}
              className={`relative flex flex-col items-center ${ticket.popular ? "border-primary shadow-lg scale-105" : ""}`}
            >
              {ticket.popular && (
          <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">Most Popular</Badge>
              )}

              <CardHeader className="text-center space-y-4 w-full flex flex-col items-center">
          <CardTitle className="text-2xl">{ticket.name}</CardTitle>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl font-bold">{ticket.price}</span>
              <span className="text-lg text-muted-foreground line-through">{ticket.originalPrice}</span>
            </div>
            <p className="text-muted-foreground">{ticket.description}</p>
          </div>
              </CardHeader>

              <CardContent className="space-y-6 w-full flex flex-col items-center">
          <ul className="space-y-3">
            {ticket.features.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-center gap-3 justify-center">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            className="w-full"
            variant={ticket.popular ? "default" : "outline"}
            disabled={!ticket.available}
          >
            {ticket.available ? "Get Ticket" : "Sold Out"}
          </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
