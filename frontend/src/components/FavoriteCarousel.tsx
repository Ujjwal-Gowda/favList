// Horizontal Favorite Carousel (centered, wrapping, no duplication)
// If total width < container width → fully center the strip.

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const BIG_SIZE = 220;
const SMALL_SIZE = 180;
const SLOT_WIDTH = 240; // spacing between items (slightly larger for comfort)

export default function FavoriteCarousel({ favorites, onDelete }) {
  const [active, setActive] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);

  const count = favorites.length;

  // Measure container width
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.getBoundingClientRect().width);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Wrap-around logic
  const goNext = () => setActive((active + 1) % count);
  const goPrev = () => setActive((active - 1 + count) % count);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active]);

  // ----- NEW LOGIC: Center the whole strip if few items -----
  const totalStripWidth = count * SLOT_WIDTH;

  let translateX = 0;

  if (totalStripWidth <= containerWidth) {
    // Items fit inside container → center whole strip
    translateX = (containerWidth - totalStripWidth) / 2;
  } else {
    // Items overflow → use active-centering logic
    translateX = containerWidth / 2 - SLOT_WIDTH / 2 - active * SLOT_WIDTH;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[350px] flex items-center justify-center overflow-hidden"
    >
      {/* LEFT BUTTON */}
      {count > 1 && (
        <button
          onClick={goPrev}
          className="absolute left-6 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:scale-105 transition"
        >
          <ChevronLeft />
        </button>
      )}

      {/* ITEM STRIP */}
      <div
        className="flex items-center transition-transform duration-500 ease-out"
        style={{
          transform: `translateX(${translateX}px)`,
        }}
      >
        {favorites.map((item, index) => {
          const isActive = index === active;
          const size = isActive ? BIG_SIZE : SMALL_SIZE;
          const scale = isActive ? 1.15 : 0.9;
          const opacity = isActive ? 1 : 0.6;

          return (
            <div
              key={item.id || index}
              onClick={() => setActive(index)}
              className="cursor-pointer mx-[40px] transition-all duration-500"
              style={{
                width: size,
                height: size,
                transform: `scale(${scale})`,
                opacity,
              }}
            >
              <div className="relative w-full h-full rounded-2xl shadow-lg overflow-hidden bg-white">
                {item.metadata?.image ? (
                  <img
                    src={item.metadata.image}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl text-slate-500">
                    ?
                  </div>
                )}

                {/* <button */}
                {/*   onClick={(e) => { */}
                {/*     e.stopPropagation(); */}
                {/*     onDelete(item.id); */}
                {/*   }} */}
                {/*   className="absolute top-2 right-2 bg-white/80 backdrop-blur px-2 py-1 rounded-full hover:bg-red-200" */}
                {/* > */}
                {/*   <X className="w-4 h-4" /> */}
                {/* </button> */}
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGHT BUTTON */}
      {count > 1 && (
        <button
          onClick={goNext}
          className="absolute right-6 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:scale-105 transition"
        >
          <ChevronRight />
        </button>
      )}
    </div>
  );
}
