"use client";

import { useState, useEffect, useCallback } from "react";

interface Photo {
  url: string;
  category: string;
}

interface PhotoCarouselProps {
  readonly photos: Photo[];
}

export function PhotoCarousel({ photos }: PhotoCarouselProps) {
  const slides = photos.filter((p) => p.url).slice(0, 3);
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [slides.length, next]);

  if (slides.length === 0) {
    return (
      <div className="h-[200px] w-full bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="flex h-full items-center justify-center text-sm text-gray-400">
          施工事例写真
        </div>
      </div>
    );
  }

  if (slides.length === 1) {
    return (
      <div className="h-[200px] w-full bg-gradient-to-br from-gray-100 to-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={slides[0].url}
          alt={slides[0].category === "exterior" ? "外観写真" : "内装写真"}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="relative h-[200px] w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
      <div
        className="flex h-full"
        style={{
          transform: `translateX(-${current * 100}%)`,
          transition: "transform 0.8s ease-in-out",
        }}
      >
        {slides.map((photo, i) => (
          <div key={i} className="h-full w-full flex-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={photo.category === "exterior" ? "外観写真" : "内装写真"}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* ドットインジケーター */}
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === current ? "w-4 bg-white" : "w-1.5 bg-white/50"
            }`}
            aria-label={`写真${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
