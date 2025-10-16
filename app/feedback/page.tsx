"use client";

import React, { useEffect, useState } from "react";

const GOOGLE_FORM_URL =
  process.env.NEXT_PUBLIC_GOOGLE_FORM_URL ||
  "https://forms.gle/dWHNuHV6TMRBM7jy8";

export default function FeedbackPage() {
  const url = GOOGLE_FORM_URL;
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    if (isFullscreen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFullscreen]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-start py-6 px-2">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Feedback</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(true)}
              className="px-3 py-1 rounded bg-primary text-black font-medium"
            >
              Open full screen
            </button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-dark-600 underline"
            >
              Open in new tab
            </a>
          </div>
        </div>

        <p className="mb-6 text-muted-foreground">
          We appreciate your feedback — the form is embedded below. Use "Open full screen" to
          view it full viewport.
        </p>

        <div className="w-full h-[90em] border rounded overflow-hidden">
          <iframe
            src={url}
            title="Feedback Form"
            className="w-full h-full"
            frameBorder={0}
            marginHeight={0}
            marginWidth={0}
          />
        </div>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-white/95 flex flex-col">
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFullscreen(false)}
                className="px-3 py-1 rounded bg-muted text-muted-foreground"
                aria-label="Close full screen"
              >
                Close
              </button>
              <span className="font-medium">Feedback Form (Full Screen)</span>
            </div>
            <div className="pr-2">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline"
              >
                Open in new tab
              </a>
            </div>
          </div>

          <div className="flex-1">
            <iframe
              src={url}
              title="Feedback Form Fullscreen"
              className="w-full h-full"
              frameBorder={0}
              marginHeight={0}
              marginWidth={0}
            />
          </div>
        </div>
      )}
    </main>
  );
}
