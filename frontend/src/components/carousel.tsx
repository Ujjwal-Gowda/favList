import { useState, useEffect } from "react";

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

  const moveUp = () => setIndex((i) => (i > 0 ? i - 1 : categories.length - 1));
  const moveDown = () =>
    setIndex((i) => (i < categories.length - 1 ? i + 1 : 0));

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") moveUp();
      if (e.key === "ArrowDown") moveDown();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    onSelect(categories[index].type);
    // Only depend on index
  }, [index]);
  return (
    <div className="relative h-[500px] flex items-center gap-4">
      <div className="flex items-center">
        <div className="w-0 h-0 border-t-[20px] border-b-[20px] border-r-[25px] border-transparent border-r-gray-500 opacity-60"></div>
      </div>

      <div className="relative h-full overflow-hidden w-48 flex justify-center">
        <div
          className="flex flex-col items-center gap-6 transition-transform duration-500"
          style={{
            transform: `translateY(${200 - index * 140}px)`,
          }}
        >
          {categories.map((cat, i) => {
            const isCenter = i === index;
            const Icon = cat.icon;

            return (
              <div
                key={cat.type}
                onClick={() => setIndex(i)}
                className={`
                  cursor-pointer flex items-center justify-center
                  rounded-3xl transition-all duration-300
                  ${
                    isCenter
                      ? "w-32 h-32 scale-110 shadow-2xl opacity-100 border-4 border-transparent bg-white"
                      : "w-20 h-20 scale-90 opacity-40"
                  }
                `}
                style={
                  isCenter
                    ? {
                        background:
                          "linear-gradient(135deg, rgba(200,150,255,0.5), rgba(255,150,200,0.5))",
                        padding: "4px",
                      }
                    : {}
                }
              >
                <div
                  className={`flex items-center justify-center w-full h-full rounded-2xl ${
                    isCenter ? "bg-white" : cat.color
                  }`}
                >
                  <Icon
                    className={`${
                      isCenter
                        ? "w-12 h-12 text-gray-600"
                        : "w-6 h-6 text-white"
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
