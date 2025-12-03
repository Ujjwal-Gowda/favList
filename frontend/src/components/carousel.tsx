import { useEffect, useRef, useState } from "react";

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
  const ITEM_HEIGHT = 130; // px
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  const moveUp = () => setIndex((i) => (i > 0 ? i - 1 : categories.length - 1));
  const moveDown = () =>
    setIndex((i) => (i < categories.length - 1 ? i + 1 : 0));

  // Measure actual container height (fixes header/padding affecting 50vh assumption)
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.getBoundingClientRect().height);
      }
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") moveUp();
      if (e.key === "ArrowDown") moveDown();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  // notify parent on selection change
  useEffect(() => {
    if (categories.length > 0) onSelect(categories[index].type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, categories]);

  // compute translate using measured container height
  const translateY = () => {
    const ch = containerHeight || window.innerHeight; // fallback
    const centerOffset = ch / 2 - ITEM_HEIGHT / 2;
    return `translateY(${centerOffset - index * ITEM_HEIGHT}px)`;
  };

  return (
    <div
      className="relative h-full w-full flex justify-center items-center overflow-hidden"
      ref={containerRef}
    >
      <div className="relative h-full w-full overflow-hidden flex justify-center">
        <div
          className="flex flex-col items-center transition-transform duration-500 will-change-transform"
          style={{ transform: translateY() }}
        >
          {categories.map((cat, i) => {
            const isCenter = i === index;
            const Icon = cat.icon;

            return (
              <div
                key={cat.type}
                onClick={() => setIndex(i)}
                className={`cursor-pointer flex items-center justify-center rounded-3xl transition-all duration-300 ${isCenter ? "w-44 h-44 scale-110 shadow-xl opacity-100 border-4 border-transparent bg-white" : "w-20 h-20 opacity-40"}`}
                style={
                  isCenter
                    ? {
                        background:
                          "linear-gradient(135deg, rgba(200,150,255,0.5), rgba(255,150,200,0.5))",
                        padding: "4px",
                        marginBottom: "20px",
                        marginTop: "20px",
                      }
                    : { marginBottom: "20px", marginTop: "20px" }
                }
              >
                <div
                  className={`flex items-center justify-center w-full h-full rounded-2xl ${isCenter ? "bg-white" : cat.color}`}
                >
                  <Icon
                    className={`${isCenter ? "w-12 h-12 text-gray-600" : "w-6 h-6 text-white"}`}
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
