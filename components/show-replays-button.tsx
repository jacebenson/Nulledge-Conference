"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ShowReplaysButton() {
//   const [show, setShow] = useState(false);

//   useEffect(() => {
//     // Show button after October 18, 2025
//     const cutoff = new Date(2025, 9, 5); // month 9 = October
//     const now = new Date();
//     setShow(now >= cutoff);
//   }, []);

//   if (!show) return null;

  return (
   <Button asChild size="lg" className="text-lg px-2">
              <a
                href="https://www.youtube.com/@thenulledge"
                target="_blank"
                rel="noopener noreferrer"
              >
                Catch the Replays
              </a>
            </Button>
  );
}
