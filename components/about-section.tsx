import { Card, CardContent } from "@/components/ui/card"
import { Code, Lightbulb, Network, Rocket } from "lucide-react"

export function AboutSection() {
  const features = [
    {
      icon: Code,
      title: "Cutting-Edge Tech",
      description: "Explore the latest in AI, Business Rules, UI Builder, and Fluent.",
    },
    {
      icon: Network,
      title: "Networking",
      description: "Connect with industry leaders, innovators, and like-minded professionals.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Discover breakthrough ideas and solutions shaping the future of ServiceNow.",
    },
    {
      icon: Rocket,
      title: "Growth",
      description: "Accelerate your career and business with actionable insights and strategies.",
    },
  ]

  return (
    <section id="about" className="p-20 md:p-32">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">About Nulledge</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Nulledge Conference brings together the brightest minds in ServiceNow<sup>™</sup> to share knowledge, inspire
            innovation, and shape the future of our digital world.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6 space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
