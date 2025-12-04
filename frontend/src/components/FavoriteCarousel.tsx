import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Hammer from "hammerjs";

const CARD_WIDTH = 280;
const CARD_HEIGHT = 320;

export default function FavoriteCarousel({ favorites, onDelete, onItemClick }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swipeRef = useRef(null);

  const count = favorites.length;

  const goNext = () => {
    if (activeIndex < count - 1) setActiveIndex(activeIndex + 1);
  };

  const goPrev = () => {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1);
  };

  useEffect(() => {
    setActiveIndex(0);
  }, [favorites]);

  // ---- HammerJS swipe ----
  useEffect(() => {
    const hammer = new Hammer(swipeRef.current);
    hammer.on("swipeleft", goNext);
    hammer.on("swiperight", goPrev);
    return () => hammer.destroy();
  }, [activeIndex]);

  // ---- Arrow key navigation ----
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, count]);

  // ---- SLOT positioning (same behavior, redesigned visually) ----
  const getSlotClass = (index: number) => {
    const diff = index - activeIndex;
    if (diff === 0) return "act";
    if (diff === -1) return "prev";
    if (diff === 1) return "next";
    if (diff === -2) return "hide-left";
    if (diff === 2) return "hide-right";
    return "offscreen";
  };

  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden">
      {/* LEFT ARROW */}
      {activeIndex > 0 && (
        <button
          onClick={goPrev}
          className="absolute left-4 z-30 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-110 transition"
        >
          <ChevronLeft className="text-neutral-700" />
        </button>
      )}

      {/* CAROUSEL LIST */}
      <ul className="relative h-[320px] w-full flex items-center justify-center pointer-events-auto">
        {favorites.map((item, index) => {
          const slot = getSlotClass(index);
          if (slot === "offscreen") return null;

          return (
            <li
              key={item.id || index}
              onClick={() => {
                if (slot === "prev") goPrev();
                else if (slot === "next") goNext();
                else if (slot === "act") onItemClick(item);
              }}
              className={`
                absolute 
                transition-all duration-700 ease-out rounded-xl overflow-hidden 
                cursor-pointer card-${slot}
              `}
              style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
              }}
            >
              {/* IMAGE */}
              {item.metadata?.image ? (
                <img
                  src={item.metadata.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-neutral-600 bg-neutral-200">
                  {item.title?.charAt(0).toUpperCase()}
                </div>
              )}

              {/* TITLE Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <h3 className="text-white text-lg font-semibold truncate">
                  {item.title}
                </h3>
              </div>
            </li>
          );
        })}
      </ul>

      {/* RIGHT ARROW */}
      {activeIndex < count - 1 && (
        <button
          onClick={goNext}
          className="absolute right-4 z-30 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-110 transition"
        >
          <ChevronRight className="text-neutral-700" />
        </button>
      )}

      {/* SWIPE OVERLAY */}
      <div
        ref={swipeRef}
        className="absolute w-[280px] h-[320px] opacity-0"
      ></div>
    </div>
  );
}
