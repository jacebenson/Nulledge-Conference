"use client";

import { useState, useEffect } from "react";

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  published?: string;
  speakers?: string;
}

export default function YouTubeEmbed({
  videoId,
  title,
  published,
  speakers,
}: YouTubeEmbedProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <>
      {/* Thumbnail Card */}
      <div className="bg-card border rounded-lg overflow-hidden">
        {/* Title Section - Above the video */}
        <div className="p-3 pb-2">
          <h3 className="text-sm font-medium line-clamp-2" title={title}>
            {title}
          </h3>
          {/** lets have one row on left side for speakers, right side for published date */}
          <div className="flex justify-between mt-1">
            {speakers && (
              <p className="text-xs text-muted-foreground">
                {speakers}
              </p>
            )}
            {published && (
              <p className="text-xs text-muted-foreground">
                {published}
              </p>
            )}
          </div>
        </div>
        
        {/* Video Thumbnail */}
        <div
          className="aspect-video bg-black relative cursor-pointer group overflow-hidden"
          onClick={handleClick}
        >
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg
                className="w-6 h-6 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
          {/* Modal Content */}
          <div className="relative w-full max-w-6xl bg-background rounded-lg overflow-hidden">
            {/* Close Button - positioned outside the video area */}
            <button
              onClick={closeModal}
              className="absolute -top-3 -right-3 z-20 w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Video Container */}
            <div className="aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title={title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-card">
              <h2 className="text-lg font-medium">{title}</h2>
              {published && (
                <p className="text-sm text-muted-foreground mt-1">
                  {published}
                </p>
              )}
            </div>
          </div>

          {/* Click outside to close */}
          <div className="absolute inset-0 -z-10" onClick={closeModal} />
        </div>
      )}
    </>
  );
}
