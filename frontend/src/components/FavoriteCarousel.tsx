import { useState } from "react";
import { ChevronLeft, ChevronRight, X, ExternalLink } from "lucide-react";

interface FavoriteCarouselProps {
  favorites: any[];
  onDelete: (id: string) => void;
}

function SafeImage({ src, alt, fallback }: any) {
  const [error, setError] = useState(false);

  if (error || !src || src === "N/A") {
    return fallback;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setError(true)}
    />
  );
}
export default function FavoriteCarousel({
  favorites,
  onDelete,
}: FavoriteCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const next = () => {
    setCurrentIndex((prev) => (prev < favorites.length - 1 ? prev + 1 : prev));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const getVisibleItems = () => {
    const start = Math.max(0, currentIndex - 1);
    const end = Math.min(favorites.length, currentIndex + 4);
    return favorites.slice(start, end).map((fav, idx) => ({
      ...fav,
      actualIndex: start + idx,
    }));
  };

  const expanded = favorites.find((f) => f.id === expandedId);

  return (
    <div className="flex-1 flex flex-col relative">
      {/* Carousel */}
      <div className="flex items-center justify-center gap-4 py-8">
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          className="p-2 rounded-full bg-purple-100 hover:bg-purple-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={24} className="text-purple-600" />
        </button>

        <div className="flex gap-6 items-end">
          {getVisibleItems().map((item) => {
            const isCenter = item.actualIndex === currentIndex;
            const imageUrl = item.metadata?.image;
            const title = item.title;

            return (
              <button
                key={item.id}
                onClick={() => setExpandedId(item.id)}
                className={`relative transition-all duration-300 ${
                  isCenter
                    ? "w-48 h-48 scale-110"
                    : "w-32 h-32 scale-90 opacity-60"
                }`}
                style={{
                  transformStyle: "preserve-3d",
                  transform: isCenter
                    ? "rotateY(0deg)"
                    : "rotateY(15deg) scale(0.9)",
                }}
              >
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center border-4 border-white">
                  {imageUrl && imageUrl !== "N/A" ? (
                    <SafeImage
                      src={imageUrl}
                      alt={title}
                      fallback={
                        <div className="text-3xl font-bold text-purple-400">
                          {getInitials(title)}
                        </div>
                      }
                    />
                  ) : (
                    <div className="text-3xl font-bold text-purple-400">
                      {getInitials(title)}
                    </div>
                  )}
                </div>
                {isCenter && (
                  <div className="absolute -bottom-8 left-0 right-0 text-center">
                    <p className="text-sm font-semibold text-slate-800 truncate px-2">
                      {title}
                    </p>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={next}
          disabled={currentIndex >= favorites.length - 1}
          className="p-2 rounded-full bg-purple-100 hover:bg-purple-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronRight size={24} className="text-purple-600" />
        </button>
      </div>

      {/* Expanded View */}
      {expanded && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl p-8 flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={() => setExpandedId(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-rose-100 hover:bg-rose-200 transition"
          >
            <X size={20} className="text-rose-600" />
          </button>

          <div className="flex gap-8 flex-1 overflow-auto">
            {/* Image */}
            <div className="w-64 h-64 flex-shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center shadow-xl">
              {expanded.metadata?.image && expanded.metadata.image !== "N/A" ? (
                <img
                  src={expanded.metadata.image}
                  alt={expanded.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="text-5xl font-bold text-purple-400">${getInitials(expanded.title)}</div>`;
                    }
                  }}
                />
              ) : (
                <div className="text-5xl font-bold text-purple-400">
                  {getInitials(expanded.title)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <h2 className="text-3xl font-bold text-slate-800">
                {expanded.title}
              </h2>

              {expanded.metadata?.artist && (
                <p className="text-lg text-slate-600">
                  <span className="font-semibold">By:</span>{" "}
                  {expanded.metadata.artist}
                </p>
              )}

              {expanded.metadata?.year && (
                <p className="text-slate-600">
                  <span className="font-semibold">Year:</span>{" "}
                  {expanded.metadata.year}
                </p>
              )}

              {expanded.metadata?.description && (
                <div>
                  <p className="font-semibold text-slate-800 mb-2">
                    Description:
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    {expanded.metadata.description}
                  </p>
                </div>
              )}

              {expanded.metadata?.platform && (
                <p className="text-slate-600">
                  <span className="font-semibold">Platform:</span>{" "}
                  {Array.isArray(expanded.metadata.platform)
                    ? expanded.metadata.platform.join(", ")
                    : expanded.metadata.platform}
                </p>
              )}

              {expanded.metadata?.rating && (
                <p className="text-slate-600">
                  <span className="font-semibold">Rating:</span>{" "}
                  {Math.round(expanded.metadata.rating)}/100
                </p>
              )}

              <div className="flex gap-3 pt-4">
                {expanded.metadata?.url && (
                  <a
                    href={expanded.metadata.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition shadow-lg"
                  >
                    <ExternalLink size={18} />
                    Open Link
                  </a>
                )}
                <button
                  onClick={() => {
                    onDelete(expanded.id);
                    setExpandedId(null);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-medium transition shadow-lg"
                >
                  <X size={18} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
