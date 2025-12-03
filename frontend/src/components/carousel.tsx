import { useState, useEffect } from "react";

export default function VerticalCategoryCarousel({ categories, onSelect }) {
  const [index, setIndex] = useState(0);

  const moveUp = () => setIndex((i) => (i > 0 ? i - 1 : categories.length - 1));
  const moveDown = () =>
    setIndex((i) => (i < categories.length - 1 ? i + 1 : 0));

  // Arrow key controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") moveUp();
      if (e.key === "ArrowDown") moveDown();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Notify parent on selection
  useEffect(() => {
    onSelect(categories[index].type);
  }, [index]);

  return (
    <div className="relative h-[650px] w-64 flex items-center gap-4">
      {/* LEFT POINTER ARROW */}
      <div className="flex items-center">
        <div className="w-0 h-0 border-t-[20px] border-b-[20px] border-r-[25px] border-transparent border-r-gray-500 opacity-60"></div>
      </div>

      {/* CAROUSEL */}
      <div className="relative h-full overflow-hidden w-full flex justify-center">
        <div
          className="flex flex-col items-center gap-8 transition-transform duration-500"
          style={{
            transform: `translateY(calc(50% - ${index * 180}px))`,
          }}
        >
          {categories.map((cat, i) => {
            const isCenter = i === index;

            return (
              <div
                key={cat.type}
                onClick={() => setIndex(i)}
                className={`
                  cursor-pointer flex items-center justify-center
                  rounded-3xl transition-all duration-300
                  ${
                    isCenter
                      ? "w-44 h-44 scale-110 shadow-2xl opacity-100 border-[4px] border-transparent bg-white relative"
                      : "w-28 h-28 scale-90 opacity-40"
                  }
                `}
                style={
                  isCenter
                    ? {
                        background:
                          "linear-gradient(135deg, rgba(255,170,220,0.8), rgba(120,200,255,0.8))",
                        padding: "4px",
                      }
                    : {}
                }
              >
                {/* White inner area like DS */}
                <div
                  className={`flex items-center justify-center w-full h-full rounded-2xl ${
                    isCenter ? "bg-white" : cat.color
                  }`}
                >
                  <cat.icon
                    className={`${
                      isCenter
                        ? "w-14 h-14 text-gray-600"
                        : "w-8 h-8 text-white"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
