import { useState, useEffect } from "react";
import { Music, Film, Gamepad2, BookOpen, Palette, Plus } from "lucide-react";
import CategoryCard from "../components/CategoryCard";
import SearchBar from "../components/searchbar";
import SearchResults from "../components/SearchResults";
import FavoriteItem from "../components/FavoriteItem";
import ManualAddForm from "../components/ManualAddForms";

const categories = [
  { type: "MUSIC", icon: Music, label: "Music", color: "bg-purple-500" },
  { type: "MOVIE", icon: Film, label: "Movies", color: "bg-red-500" },
  { type: "GAME", icon: Gamepad2, label: "Games", color: "bg-blue-500" },
  { type: "BOOK", icon: BookOpen, label: "Books", color: "bg-green-500" },
  { type: "ART", icon: Palette, label: "Art", color: "bg-pink-500" },
  { type: "OTHER", icon: Plus, label: "Other", color: "bg-slate-500" },
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
        setSearchResults(data.data || []);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = async (item: any) => {
    try {
      const title = item.name || item.title || "Untitled";
      const metadata = {
        id: item.id,
        image: item.album?.image || item.image || item.thumbnail || item.url,
        artist:
          item.artists?.map((a: any) => a.name).join(", ") ||
          item.authors?.join(", ") ||
          "",
        year: item.releaseDate || item.publishedDate || item.year || "",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Selection - Nintendo DS Style */}
        <div
          className={`transition-all duration-500 ${
            selectedCategory ? "mb-8" : "mb-0"
          }`}
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-6">
            Your Favorites Collection
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.type}
                icon={category.icon}
                label={category.label}
                count={getCategoryCount(category.type)}
                color={category.color}
                isSelected={selectedCategory === category.type}
                onClick={() => {
                  setSelectedCategory(
                    selectedCategory === category.type ? null : category.type,
                  );
                  setIsSearching(false);
                  setSearchResults([]);
                }}
              />
            ))}
          </div>
        </div>

        {/* Expanded Category View */}
        {selectedCategory && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <SearchBar
                onSearch={handleSearch}
                placeholder={`Search for ${categories.find((c) => c.type === selectedCategory)?.label.toLowerCase()}...`}
              />
            </div>

            {/* Manual Add Form */}
            <ManualAddForm type={selectedCategory} onAdd={handleManualAdd} />

            {/* Search Results */}
            {isSearching && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-slate-900 mb-4">
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
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
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
  );
}
