import { Heart } from "lucide-react";
import { useState } from "react";

interface SearchResult {
  id?: string;
  imdbID?: string;
  name?: string;
  title?: string;
  Title?: string;
  image?: string;
  Poster?: string;
  previewLink?: string;
  artists?: Array<{ name: string }>;
  album?: { name: string; image: string };
  description?: string;
  Year?: string;
  [key: string]: any;
}

interface SearchResultsProps {
  results: SearchResult[];
  type: string;
  onAddFavorite: (item: SearchResult) => void;
  onItemClick: (item: SearchResult) => void;
  favoriteIds: Set<string>;
}

export default function SearchResults({
  results,
  type,
  onAddFavorite,
  onItemClick,
  favoriteIds,
}: SearchResultsProps) {
  const [addingId, setAddingId] = useState<string | null>(null);

  const getItemTitle = (item: SearchResult) => {
    return item.name || item.title || item.Title || "Untitled";
  };

  const getItemImage = (item: SearchResult) => {
    if (type === "MUSIC") return item.album?.image || item.image;
    if (type === "MOVIE") return item.Poster || item.image;
    return item.image || item.thumbnail || item.url;
  };

  const getItemSubtitle = (item: SearchResult) => {
    if (type === "MUSIC") {
      return item.artists?.map((a) => a.name).join(", ") || "";
    }
    if (type === "GAME") {
      return item.platform?.join(", ") || "";
    }
    if (type === "BOOK") {
      return item.authors?.join(", ") || "";
    }
    if (type === "MOVIE") {
      return `${item.Year || item.year || ""} ${item.actors ? `• ${item.actors}` : ""}`.trim();
    }
    if (type === "ART") {
      return item.user?.name || "";
    }
    return "";
  };

  const getInitials = (title: string) => {
    return title
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const handleAddFavorite = async (item: SearchResult) => {
    const itemId = (item.id || item.imdbID)?.toString();
    if (!itemId) return;

    setAddingId(itemId);

    try {
      await onAddFavorite(item);
    } finally {
      setTimeout(() => setAddingId(null), 500);
    }
  };
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No results found. Try a different search.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
      {results.map((item, index) => {
        const itemId = (item.id || item.imdbID || index)?.toString();
        const isFavorited = favoriteIds.has(itemId);
        const isAdding = addingId === itemId;

        const imageUrl = getItemImage(item);
        const title = getItemTitle(item);

        return (
          <div
            key={itemId}
            className="w-[280px] h-[360px] bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-neutral-200 relative group cursor-pointer"
          >
            {/* Image container */}
            <div
              className="w-full h-full relative"
              onClick={() => onItemClick(item)}
            >
              {/* Image */}
              {imageUrl && imageUrl !== "N/A" ? (
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class='w-full h-full flex items-center justify-center text-4xl font-bold text-neutral-700 bg-neutral-200'>${getInitials(
                        title,
                      )}</div>`;
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-neutral-700 bg-neutral-200">
                  {getInitials(title)}
                </div>
              )}

              {/* Favorite button (top-right) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddFavorite(item);
                }}
                disabled={isFavorited || isAdding}
                className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all ${
                  isFavorited
                    ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                    : isAdding
                      ? "bg-green-600 text-white animate-pulse"
                      : "bg-black/70 text-white hover:scale-110 active:scale-95"
                }`}
              >
                <Heart
                  size={18}
                  fill={isFavorited || isAdding ? "currentColor" : "none"}
                />
              </button>

              {/* Bottom-left title overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-white text-lg font-semibold truncate">
                  {title}
                </h3>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
