import { Heart } from "lucide-react";

interface SearchResult {
  id?: string;
  imdbID?: string;
  name?: string;
  title?: string;
  Title?: string;
  image?: string;
  Poster?: string;
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
  favoriteIds: Set<string>;
}

export default function SearchResults({
  results,
  type,
  onAddFavorite,
  favoriteIds,
}: SearchResultsProps) {
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
      return item.Year || item.year || "";
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
  console.log(results);

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No results found. Try a different search.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {results.map((item, index) => {
        const itemId = (item.id || item.imdbID || index)?.toString();
        const isFavorited = favoriteIds.has(itemId);
        const imageUrl = getItemImage(item);
        const title = getItemTitle(item);

        return (
          <div
            key={itemId}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 border border-purple-100"
          >
            <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 relative flex items-center justify-center">
              {imageUrl && imageUrl !== "N/A" ? (
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="text-4xl font-bold text-purple-400">${getInitials(title)}</div>`;
                    }
                  }}
                />
              ) : (
                <div className="text-4xl font-bold text-purple-400">
                  {getInitials(title)}
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-sm text-slate-800 truncate">
                {title}
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
                    : "bg-rose-100 text-rose-600 hover:bg-rose-200"
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
