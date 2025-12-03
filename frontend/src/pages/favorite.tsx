import { useState, useEffect } from "react";
import { Music, Film, Gamepad2, BookOpen, Palette, Plus } from "lucide-react";
// import CategoryCard from "../components/CategoryCard";
import SearchBar from "../components/searchbar";
import SearchResults from "../components/SearchResults";
import FavoriteItem from "../components/FavoriteItem";
import ManualAddForm from "../components/ManualAddForms";
import VerticalCategoryCarousel from "../components/carousel";
const categories = [
  { type: "MUSIC", icon: Music, label: "Music", color: "bg-purple-400" },
  { type: "MOVIE", icon: Film, label: "Movies", color: "bg-rose-400" },
  { type: "GAME", icon: Gamepad2, label: "Games", color: "bg-blue-400" },
  { type: "BOOK", icon: BookOpen, label: "Books", color: "bg-green-400" },
  { type: "ART", icon: Palette, label: "Art", color: "bg-pink-400" },
  { type: "OTHER", icon: Plus, label: "Other", color: "bg-amber-400" },
];

export default function Favorites() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await fetch("http://localhost:5000/favorites", {
        credentials: "include",
      });
      const data = await response.json();
      setFavorites(data.favorites || []);

      const ids = new Set(
        data.favorites?.map((f: any) => f.metadata?.id?.toString() || f.id) ||
          [],
      );
      setFavoriteIds(ids);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    }
  };

  const handleSearch = async (query: string) => {
    if (!selectedCategory || !query.trim()) return;

    setLoading(true);
    setIsSearching(true);
    setSearchResults([]);

    try {
      let endpoint = "";
      switch (selectedCategory) {
        case "MUSIC":
          endpoint = `http://localhost:5000/search/music?query=${encodeURIComponent(query)}`;
          break;
        case "MOVIE":
          endpoint = `http://localhost:5000/search/movie?query=${encodeURIComponent(query)}`;
          break;
        case "GAME":
          endpoint = `http://localhost:5000/search/game?query=${encodeURIComponent(query)}`;
          break;
        case "BOOK":
          endpoint = `http://localhost:5000/search/book/${encodeURIComponent(query)}`;
          break;
        case "ART":
          endpoint = `http://localhost:5000/search/images?query=${encodeURIComponent(query)}`;
          break;
      }

      if (endpoint) {
        const response = await fetch(endpoint, { credentials: "include" });
        const data = await response.json();

        // Handle different response structures
        let results = [];
        if (Array.isArray(data.data)) {
          results = data.data;
        } else if (Array.isArray(data)) {
          results = data;
        }

        setSearchResults(results);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = async (item: any) => {
    try {
      const title = item.name || item.title || item.Title || "Untitled";
      const metadata = {
        id: item.id || item.imdbID,
        image:
          item.album?.image ||
          item.image ||
          item.thumbnail ||
          item.url ||
          item.Poster,
        artist:
          item.artists?.map((a: any) => a.name).join(", ") ||
          item.authors?.join(", ") ||
          item.Year ||
          "",
        year:
          item.releaseDate ||
          item.publishedDate ||
          item.year ||
          item.Year ||
          "",
        url: item.spotifyUrl || item.usplash || item.links?.html || "",
        ...item,
      };

      const response = await fetch("http://localhost:5000/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          type: selectedCategory,
          metadata,
        }),
      });

      if (response.ok) {
        await fetchFavorites();
      }
    } catch (error) {
      console.error("Failed to add favorite:", error);
    }
  };

  const handleManualAdd = async (data: { title: string; metadata: any }) => {
    try {
      const response = await fetch("http://localhost:5000/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: data.title,
          type: selectedCategory,
          metadata: data.metadata,
        }),
      });

      if (response.ok) {
        await fetchFavorites();
      }
    } catch (error) {
      console.error("Failed to add favorite:", error);
    }
  };

  const handleDeleteFavorite = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/favorites/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await fetchFavorites();
      }
    } catch (error) {
      console.error("Failed to delete favorite:", error);
    }
  };

  const getCategoryFavorites = () => {
    if (!selectedCategory) return [];
    return favorites.filter((f) => f.type === selectedCategory);
  };

  const getCategoryCount = (type: string) => {
    return favorites.filter((f) => f.type === type).length;
  };

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="  px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Category Selection - Nintendo DS Style */}
          <div
            className={`transition-all duration-500 ${
              selectedCategory ? "w-64 flex-shrink-0" : "flex-1"
            }`}
          >
            <h1 className="text-3xl font-bold text-slate-800 mb-6">
              Favorites
            </h1>

            <div className="flex gap-8">
              <VerticalCategoryCarousel
                categories={categories}
                onSelect={(type) => {
                  setSelectedCategory(type);
                  setIsSearching(false);
                  setSearchResults([]);
                }}
              />
              {selectedCategory && (
                <div className="flex-1 space-y-6">
                  {/* right side: search, add manual, favorites list */}
                  ...
                </div>
              )}
            </div>
          </div>

          {/* Expanded Category View */}
          {selectedCategory && (
            <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Search Bar */}
              <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-purple-100">
                <SearchBar
                  onSearch={handleSearch}
                  placeholder={`Search for ${categories.find((c) => c.type === selectedCategory)?.label.toLowerCase()}...`}
                />
              </div>

              {/* Manual Add Form */}
              <ManualAddForm type={selectedCategory} onAdd={handleManualAdd} />

              {/* Search Results */}
              {isSearching && (
                <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-purple-100">
                  <h2 className="text-xl font-bold text-slate-800 mb-4">
                    Search Results
                  </h2>
                  {loading ? (
                    <div className="text-center py-12 text-slate-500">
                      Searching...
                    </div>
                  ) : (
                    <SearchResults
                      results={searchResults}
                      type={selectedCategory}
                      onAddFavorite={handleAddFavorite}
                      favoriteIds={favoriteIds}
                    />
                  )}
                </div>
              )}

              {/* Your Favorites in This Category */}
              <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-purple-100">
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  Your{" "}
                  {categories.find((c) => c.type === selectedCategory)?.label}
                </h2>
                {getCategoryFavorites().length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    No favorites yet. Search and add some!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getCategoryFavorites().map((favorite) => (
                      <FavoriteItem
                        key={favorite.id}
                        id={favorite.id}
                        title={favorite.title}
                        metadata={favorite.metadata}
                        onDelete={handleDeleteFavorite}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
