import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface FavoriteCarouselProps {
  favorites: any[];
  onDelete: (id: string) => void;
  onItemClick: (item: any) => void;
  isMobile?: boolean;
}

export default function FavoriteCarousel({
  favorites,
  onItemClick,
  isMobile = false,
}: FavoriteCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevFavoritesLengthRef = useRef(favorites.length);

  // Only reset to 0 if the favorites array length changes OR if activeIndex is out of bounds
  useEffect(() => {
    const prevLength = prevFavoritesLengthRef.current;
    const currentLength = favorites.length;

    // Reset only if:
    // 1. Length changed (items added/removed)
    // 2. Current index is out of bounds
    if (prevLength !== currentLength || activeIndex >= currentLength) {
      setActiveIndex(0);
    }

    prevFavoritesLengthRef.current = currentLength;
  }, [favorites.length, activeIndex]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev < favorites.length - 1 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isMobile) {
        if (e.key === "ArrowUp") handlePrev();
        if (e.key === "ArrowDown") handleNext();
      } else {
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "ArrowRight") handleNext();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, isMobile, favorites.length]);

  const getInitials = (title: string) => {
    return title
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;

    if (isMobile) {
      // Vertical mobile layout
      if (diff === 0) {
        return {
          transform: "translateY(0) scale(1.1)",
          zIndex: 10,
          opacity: 1,
        };
      } else if (diff === -1) {
        return {
          transform: "translateY(-140px) scale(0.85)",
          zIndex: 5,
          opacity: 0.6,
        };
      } else if (diff === 1) {
        return {
          transform: "translateY(140px) scale(0.85)",
          zIndex: 5,
          opacity: 0.6,
        };
      } else if (diff === -2) {
        return {
          transform: "translateY(-280px) scale(0.7)",
          zIndex: 2,
          opacity: 0.3,
        };
      } else if (diff === 2) {
        return {
          transform: "translateY(280px) scale(0.7)",
          zIndex: 2,
          opacity: 0.3,
        };
      }
    } else {
      // Horizontal desktop layout
      if (diff === 0) {
        return {
          transform: "translateX(0) scale(1.2)",
          zIndex: 10,
          opacity: 1,
        };
      } else if (diff === -1) {
        return {
          transform: "translateX(-280px) scale(0.9)",
          zIndex: 5,
          opacity: 0.6,
        };
      } else if (diff === 1) {
        return {
          transform: "translateX(280px) scale(0.9)",
          zIndex: 5,
          opacity: 0.6,
        };
      } else if (diff === -2) {
        return {
          transform: "translateX(-520px) scale(0.75)",
          zIndex: 2,
          opacity: 0.3,
        };
      } else if (diff === 2) {
        return {
          transform: "translateX(520px) scale(0.75)",
          zIndex: 2,
          opacity: 0.3,
        };
      }
    }

    return {
      transform: isMobile
        ? "translateY(1000px) scale(0.5)"
        : "translateX(1000px) scale(0.5)",
      zIndex: 0,
      opacity: 0,
    };
  };

  if (favorites.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        No favorites yet
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full flex ${isMobile ? "flex-col" : "flex-row"} items-center justify-center`}
    >
      {/* Navigation Buttons */}
      {isMobile ? (
        <>
          {/* Up Arrow for Mobile */}
          {activeIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition"
            >
              <ChevronUp className="text-neutral-700" size={24} />
            </button>
          )}
          {/* Down Arrow for Mobile */}
          {activeIndex < favorites.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition"
            >
              <ChevronDown className="text-neutral-700" size={24} />
            </button>
          )}
        </>
      ) : (
        <>
          {/* Left Arrow for Desktop */}
          {activeIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 z-30 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition"
            >
              <ChevronLeft className="text-neutral-700" size={24} />
            </button>
          )}
          {/* Right Arrow for Desktop */}
          {activeIndex < favorites.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 z-30 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition"
            >
              <ChevronRight className="text-neutral-700" size={24} />
            </button>
          )}
        </>
      )}

      {/* Carousel Container */}
      <div
        ref={containerRef}
        className={`relative ${isMobile ? "w-[280px] h-[450px]" : "w-full h-[580px]"} flex items-center justify-center overflow-visible`}
      >
        {favorites.map((item, index) => {
          const style = getCardStyle(index);
          const isActive = index === activeIndex;

          return (
            <div
              key={item.id || index}
              onClick={() => {
                if (isActive) {
                  onItemClick(item);
                } else if (index === activeIndex - 1) {
                  handlePrev();
                } else if (index === activeIndex + 1) {
                  handleNext();
                } else {
                  setActiveIndex(index);
                }
              }}
              className="absolute cursor-pointer transition-all duration-500 ease-out"
              style={{
                ...style,
                width: isMobile ? "260px" : "280px",
                height: isMobile ? "320px" : "360px",
              }}
            >
              <div
                className={`relative w-full h-full rounded-2xl overflow-hidden shadow-xl ${
                  isActive ? "ring-4 ring-purple-500" : "ring-2 ring-white"
                }`}
              >
                {item.metadata?.image ? (
                  <img
                    src={item.metadata.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-neutral-600 bg-neutral-200">
                    {getInitials(item.title)}
                  </div>
                )}

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3
                    className={`text-white font-semibold truncate ${isActive ? "text-lg" : "text-sm"}`}
                  >
                    {item.title}
                  </h3>
                  {isActive && item.metadata?.artist && (
                    <p className="text-white/80 text-xs truncate mt-1">
                      {item.metadata.artist}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Indicator - Below cards */}
      <div
        className={`absolute ${isMobile ? "bottom-4" : "bottom-8"} left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg`}
      >
        {favorites.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              index === activeIndex
                ? "w-8 h-2 bg-purple-500"
                : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
