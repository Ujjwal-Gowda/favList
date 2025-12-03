// components/VerticalCategoryCarousel.tsx
import React, { useEffect, useRef, useState } from "react";

interface Category {
  type: string;
  icon: any;
  label: string;
  color: string;
}

interface CarouselProps {
  categories: Category[];
  onSelect: (type: string) => void;
}

export default function VerticalCategoryCarousel({
  categories,
  onSelect,
}: CarouselProps) {
  const [index, setIndex] = useState(0);
  const prevIndexRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // stable selection effect: only when index changes
  useEffect(() => {
    if (prevIndexRef.current !== index) {
      prevIndexRef.current = index;
      if (categories[index]) onSelect(categories[index].type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // keyboard navigation + prevent default page scroll
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setIndex((i) => (i > 0 ? i - 1 : categories.length - 1));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setIndex((i) => (i < categories.length - 1 ? i + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKey, { passive: false });
    return () => window.removeEventListener("keydown", handleKey);
  }, [categories.length]);

  // center calculation: keep center fixed (use CSS translate)
  return (
    <div className="h-full flex items-center justify-center">
      <div
        ref={containerRef}
        className="relative h-[420px] w-52 overflow-hidden flex items-center justify-center"
      >
        <div
          className="flex flex-col items-center transition-transform duration-400"
          style={{
            transform: `translateY(${-(index * 88) + 176}px)`, // tune offsets to center
            gap: 18,
          }}
        >
          {categories.map((cat, i) => {
            const isCenter = i === index;
            const Icon = cat.icon;
            return (
              <button
                key={cat.type}
                onClick={() => setIndex(i)}
                className={`focus:outline-none transform transition-all duration-200 flex items-center justify-center ${
                  isCenter
                    ? "w-36 h-36 scale-105 shadow-xl rounded-2xl"
                    : "w-20 h-20 opacity-60 rounded-lg"
                }`}
                aria-pressed={isCenter}
              >
                <div
                  className={`w-full h-full flex items-center justify-center rounded-lg ${
                    isCenter ? "bg-white" : cat.color
                  }`}
                >
                  <Icon
                    className={
                      isCenter
                        ? "w-12 h-12 text-gray-700"
                        : "w-6 h-6 text-white"
                    }
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
