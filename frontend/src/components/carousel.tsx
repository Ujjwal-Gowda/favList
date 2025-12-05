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
  isMobile?: boolean;
}

export default function VerticalCategoryCarousel({
  categories,
  onSelect,
  isMobile = false,
}: CarouselProps) {
  const ITEM_HEIGHT = 130;
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  // Touch handling for mobile
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const distance = touchEndY.current - touchStartY.current;
    if (Math.abs(distance) > 50) {
      if (distance < 0 && index < categories.length - 1) {
        setIndex(index + 1);
      } else if (distance > 0 && index > 0) {
        setIndex(index - 1);
      }
    }
  };

  const moveUp = () => setIndex((i) => (i > 0 ? i - 1 : categories.length - 1));
  const moveDown = () =>
    setIndex((i) => (i < categories.length - 1 ? i + 1 : 0));

  // Measure container height
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

  // Keyboard controls for desktop
  useEffect(() => {
    if (isMobile) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") moveUp();
      if (e.key === "ArrowDown") moveDown();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, isMobile, index]);

  // Touch events for mobile
  useEffect(() => {
    if (!isMobile) return;

    const div = containerRef.current;
    if (!div) return;

    div.addEventListener("touchstart", handleTouchStart);
    div.addEventListener("touchmove", handleTouchMove);
    div.addEventListener("touchend", handleTouchEnd);

    return () => {
      div.removeEventListener("touchstart", handleTouchStart);
      div.removeEventListener("touchmove", handleTouchMove);
      div.removeEventListener("touchend", handleTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, isMobile]);

  // Auto-select on index change for desktop only
  useEffect(() => {
    if (!isMobile && categories.length > 0) {
      onSelect(categories[index].type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, categories, isMobile]);

  // Handle click - different behavior for mobile vs desktop
  const handleClick = (i: number) => {
    setIndex(i);
    if (isMobile) {
      // On mobile, immediately notify parent when clicked
      onSelect(categories[i].type);
    }
  };

  const translateY = () => {
    const ch = containerHeight || window.innerHeight;
    const centerOffset = ch / 2 - ITEM_HEIGHT / 2;
    return `translateY(${centerOffset - index * ITEM_HEIGHT}px)`;
  };

  // Mobile layout - simpler grid
  if (isMobile) {
    return (
      <div
        ref={containerRef}
        className="w-full h-full flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="flex flex-col gap-4 items-center">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            const isActive = i === index;
            return (
              <div
                key={cat.type}
                onClick={() => handleClick(i)}
                className={`
                  flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                  ${isActive ? "scale-110 opacity-100" : "scale-90 opacity-50"}
                `}
              >
                <div
                  className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center shadow-md
                    ${cat.color}
                  `}
                >
                  <Icon size={28} className="text-white" />
                </div>
                <p className="text-sm font-medium text-slate-700 mt-2">
                  {cat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop layout - vertical carousel
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
                onClick={() => handleClick(i)}
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
