import { Card, CardContent } from "@/components/ui/card"
import { Code, Lightbulb, Network, Rocket, Globe } from "lucide-react"
import { jsonLD } from "@/app/details"
export function AboutSection() {
  let loadedProperties = jsonLD.additionalProperty.filter(function (property) {
    if (property.additionalType == 'feature') {
      return true
    }
    return false
  })
  let icons = [Code, Network, Lightbulb, Rocket]
  let features = loadedProperties.map(function (property) {

    return {
      icon: icons.shift(),
      title: property.name,
      description: property.value,
    }
  })

  return (
    <section id="about" className="p-20 md:p-32">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">About nullEDGE</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {jsonLD.about}
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
