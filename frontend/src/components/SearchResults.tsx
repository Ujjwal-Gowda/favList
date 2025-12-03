import { Heart } from "lucide-react";

interface SearchResult {
  id: string;
  name?: string;
  title?: string;
  image?: string;
  artists?: Array<{ name: string }>;
  album?: { name: string; image: string };
  description?: string;
  [key: string]: any;
}

interface SearchResultsProps {
  results: SearchResult[];
  type: string;
  onAddFavorite: (item: SearchResult) => void;
  favoriteIds: Set<string>;
}

export default function SearchResults({
  results,
  type,
  onAddFavorite,
  favoriteIds,
}: SearchResultsProps) {
  const getItemTitle = (item: SearchResult) => {
    return item.name || item.title || "Untitled";
  };

  const getItemImage = (item: SearchResult) => {
    if (type === "MUSIC") return item.album?.image || item.image;
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
      return item.year || "";
    }
    return "";
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No results found. Try a different search.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {results.map((item) => {
        const itemId = item.id?.toString() || "";
        const isFavorited = favoriteIds.has(itemId);

        return (
          <div
            key={itemId}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200"
          >
            {getItemImage(item) && (
              <div className="aspect-square bg-slate-200 relative">
                <img
                  src={getItemImage(item)}
                  alt={getItemTitle(item)}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-3">
              <h3 className="font-semibold text-sm text-slate-900 truncate">
                {getItemTitle(item)}
              </h3>
              {getItemSubtitle(item) && (
                <p className="text-xs text-slate-600 truncate mt-1">
                  {getItemSubtitle(item)}
                </p>
              )}
              <button
                onClick={() => onAddFavorite(item)}
                disabled={isFavorited}
                className={`mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${
                  isFavorited
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-red-50 text-red-600 hover:bg-red-100"
                }`}
              >
                <Heart size={16} fill={isFavorited ? "currentColor" : "none"} />
                {isFavorited ? "Added" : "Add"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
