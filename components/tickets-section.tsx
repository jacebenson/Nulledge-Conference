import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Suspense } from "react";
import Image from "next/image";

export function CallForProposals() {
  // The Google Form URL should be provided via an environment variable.
  // In Next.js, you must prefix public env variables with NEXT_PUBLIC_
  // Directly use the Google Form URL here
  const formUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLScMoi3ZWPeSAtDEX4kX1LqkZ2N5thCUJO0AeyFbrJyX9VVlcw/viewform";

  return (
    <section id="cfp" className="p-20 md:p-32 bg-muted/50">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-5xl font-bold">Call for Proposals</h2>
          <p className="text-xl text-muted-foreground">
            We invite you to submit your talk, workshop, or panel ideas for
            nullEDGE Conference! Share your expertise and help shape the event.
          </p>
 </div>
 <div className="flex justify-center mb-16">
          <Image
            src="/CFP Approval.png"
            alt="Call for Proposals"
            width={1000}
            height={600}
          />
        </div>
        {/* Responsive: Show iframe on desktop, button on mobile */}
        <div className="w-full rounded-lg overflow-hidden shadow-lg bg-white">
          {/* Desktop: show iframe */}
          <div className="hidden sm:block aspect-video">
            <Suspense fallback={<div>Loading form…</div>}>
              <iframe
                src={formUrl}
                title="Call for Proposals Form"
                width="100%"
                height="950"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                allowFullScreen
                className="w-full h-[100%] border-none"
              />
            </Suspense>
          </div>
          {/* Mobile: show button */}
          <div className="block sm:hidden flex flex-col items-center justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScMoi3ZWPeSAtDEX4kX1LqkZ2N5thCUJO0AeyFbrJyX9VVlcw/viewform"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Call for Proposals Form
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
