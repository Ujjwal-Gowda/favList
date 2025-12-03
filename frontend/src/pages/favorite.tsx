// Updated Favorites page layout with proper alignment
// Replace your Favorites.tsx with this version

import { useState, useEffect } from "react";
import { Music, Film, Gamepad2, BookOpen, Palette, Plus } from "lucide-react";
import SearchBar from "../components/searchbar";
import SearchResults from "../components/SearchResults";
import ManualAddForm from "../components/ManualAddForms";
import VerticalCategoryCarousel from "../components/carousel";
import FavoriteCarousel from "../components/FavoriteCarousel";

const categories = [
  { type: "MUSIC", icon: Music, label: "Music", color: "bg-purple-400" },
  { type: "MOVIE", icon: Film, label: "Movies", color: "bg-rose-400" },
  { type: "GAME", icon: Gamepad2, label: "Games", color: "bg-blue-400" },
  { type: "BOOK", icon: BookOpen, label: "Books", color: "bg-green-400" },
  { type: "ART", icon: Palette, label: "Art", color: "bg-pink-400" },
  { type: "OTHER", icon: Plus, label: "Other", color: "bg-amber-400" },
];

export default function Favorites() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ART");
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

        let results = [];
        if (Array.isArray(data.data)) results = data.data;
        else if (Array.isArray(data)) results = data;

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
        description: item.description || item.summary || "",
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

      if (response.ok) fetchFavorites();
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

      if (response.ok) fetchFavorites();
    } catch (error) {
      console.error("Failed to delete favorite:", error);
    }
  };

  const getCategoryFavorites = () =>
    favorites.filter((f) => f.type === selectedCategory);

  return (
    <div className="h-screen w-screen flex bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-72 h-full p-6 flex flex-col border-r border-white/30">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Favorites</h1>
        <div className="flex-1 flex justify-center">
          <VerticalCategoryCarousel
            categories={categories}
            onSelect={(type: string) => {
              setSelectedCategory(type);
              setIsSearching(false);
              setSearchResults([]);
            }}
          />
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col p-10 space-y-8 overflow-hidden">
        <div className="w-full flex items-center gap-6">
          <ManualAddForm type={selectedCategory} onAdd={handleAddFavorite} />
          <div className="w-20 h-20">
            <SearchBar
              onSearch={handleSearch}
              placeholder={`Search for ${categories.find((c) => c.type === selectedCategory)?.label.toLowerCase()}...`}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden rounded-2xl p-6 bg-white/40 backdrop-blur-md">
          {isSearching ? (
            <div className="h-full overflow-auto">
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
          ) : (
            <div className="h-full flex flex-col">
              <h2 className="text-xl font-bold text-slate-800 mb-6">
                Your{" "}
                {categories.find((c) => c.type === selectedCategory)?.label}
              </h2>
              {getCategoryFavorites().length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-slate-500 text-lg">
                  No favorites yet. Search and add some!
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <FavoriteCarousel
                    favorites={getCategoryFavorites()}
                    onDelete={handleDeleteFavorite}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
