import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

export function TicketsSection() {
  const tickets = [
    {
      name: "Early Bird",
      price: "$299",
      originalPrice: "$399",
      description: "Perfect for individual attendees",
      features: ["Access to all sessions", "Welcome kit", "Networking events", "Digital resources"],
      popular: false,
      available: true,
    },
    {
      name: "Professional",
      price: "$499",
      originalPrice: "$599",
      description: "Best value for professionals",
      features: [
        "Everything in Early Bird",
        "VIP seating",
        "Exclusive workshops",
        "One-on-one mentoring",
        "Premium networking dinner",
      ],
      popular: true,
      available: true,
    },
    {
      name: "Enterprise",
      price: "$899",
      originalPrice: "$1099",
      description: "For teams and organizations",
      features: [
        "Everything in Professional",
        "Team of up to 5 people",
        "Private meeting rooms",
        "Custom workshops",
        "Direct speaker access",
      ],
      popular: false,
      available: true,
    },
  ]

  return (
    <section id="tickets" className="py-20 md:py-32 bg-muted/50">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">Get Your Tickets</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect ticket for your needs. Early bird pricing available for a limited time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tickets.map((ticket, index) => (
            <Card key={index} className={`relative ${ticket.popular ? "border-primary shadow-lg scale-105" : ""}`}>
              {ticket.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">Most Popular</Badge>
              )}

              <CardHeader className="text-center space-y-4">
                <CardTitle className="text-2xl">{ticket.name}</CardTitle>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-bold">{ticket.price}</span>
                    <span className="text-lg text-muted-foreground line-through">{ticket.originalPrice}</span>
                  </div>
                  <p className="text-muted-foreground">{ticket.description}</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {ticket.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
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
