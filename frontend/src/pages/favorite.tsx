import { useState, useEffect } from "react";
import {
  Music,
  Film,
  Gamepad2,
  BookOpen,
  Palette,
  Plus,
  ArrowLeft,
} from "lucide-react";
import SearchBar from "../components/searchbar";
import SearchResults from "../components/SearchResults";
import ManualAddForm from "../components/ManualAddForms";
import VerticalCategoryCarousel from "../components/carousel";
import FavoriteCarousel from "../components/FavoriteCarousel";
import ItemDetailsModal from "../components/itemDetailsModal";

const categories = [
  { type: "MUSIC", icon: Music, label: "Music", color: "bg-purple-400" },
  { type: "MOVIE", icon: Film, label: "Movies", color: "bg-rose-400" },
  { type: "GAME", icon: Gamepad2, label: "Games", color: "bg-blue-400" },
  { type: "BOOK", icon: BookOpen, label: "Books", color: "bg-green-400" },
  { type: "ART", icon: Palette, label: "Art", color: "bg-pink-400" },
  { type: "OTHER", icon: Plus, label: "Other", color: "bg-amber-400" },
];

export default function Favorites() {
  const [selectedCategory, setSelectedCategory] = useState<string>("MUSIC");
  const [favorites, setFavorites] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIsFavorite, setModalIsFavorite] = useState(false);

  // Mobile state
  const [isMobile, setIsMobile] = useState(false);
  const [showCategoryView, setShowCategoryView] = useState(true);

  useEffect(() => {
    fetchFavorites();
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

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
      const isManual = !!item.metadata;
      const title =
        item.name ||
        item.title ||
        item.Title ||
        item.metadata?.title ||
        "Untitled";
      let metadata: any = {};

      if (isManual) {
        metadata = item.metadata;
      } else {
        if (selectedCategory === "MUSIC") {
          metadata = {
            id: item.id,
            image: item.album?.image || item.image,
            artist: item.artists?.map((a: any) => a.name).join(", ") || "",
            year: item.album?.releaseDate || item.releaseDate || "",
            url: item.spotifyUrl || "",
            description: item.description || "",
          };
        }
        if (selectedCategory === "MOVIE") {
          metadata = {
            id: item.id || item.imdbID,
            image: item.Poster || item.image,
            artist: item.actors || "",
            year: item.Year || item.year || "",
            url: item.imdbUrl || "",
            description: item.actors || "",
          };
        }
        if (selectedCategory === "GAME") {
          metadata = {
            id: item.id,
            image: item.image,
            platform: item.platform,
            rating: item.rating,
            description: item.summary || "",
          };
        }
        if (selectedCategory === "BOOK") {
          metadata = {
            id: item.id,
            image: item.thumbnail,
            artist: item.authors?.join(", ") || "",
            year: item.publishedDate || "",
            description: item.description || "",
          };
        }
        if (selectedCategory === "ART") {
          metadata = {
            id: item.id,
            image: item.url || item.thumb,
            download: item.download,
            unsplash: item.unsplash,
            artist: item.user?.name || "",
            description: item.description || "",
          };
        }
      }

      const response = await fetch("http://localhost:5000/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, type: selectedCategory, metadata }),
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

  const handleItemClick = (item: any, isFavorite: boolean = false) => {
    setSelectedItem(item);
    setModalIsFavorite(isFavorite);
    setIsModalOpen(true);
  };

  const handleCategorySelect = (type: string) => {
    setSelectedCategory(type);
    if (isMobile) {
      setShowCategoryView(false);
    }
    setIsSearching(false);
    setSearchResults([]);
  };

  const handleBackButton = () => {
    setShowCategoryView(true);
    setIsSearching(false);
    setSearchResults([]);
  };

  const getCategoryFavorites = () =>
    favorites.filter((f) => f.type === selectedCategory);

  // MOBILE LAYOUT
  if (isMobile) {
    return (
      <>
        <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 overflow-hidden">
          {showCategoryView ? (
            // Category Selection View
            <div className="flex-1 flex flex-col p-4">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">
                Choose Category
              </h2>
              <div className="flex-1 flex justify-center overflow-hidden">
                <VerticalCategoryCarousel
                  categories={categories}
                  onSelect={handleCategorySelect}
                  isMobile={true}
                />
              </div>
            </div>
          ) : (
            // Favorites View
            <div className="flex-1 flex flex-col space-y-3 overflow-hidden">
              {/* Header with Back Button */}
              <div className="flex items-center justify-between px-4 pt-2">
                <button
                  onClick={handleBackButton}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md text-slate-700 hover:shadow-lg transition active:scale-95"
                  type="button"
                >
                  <ArrowLeft size={20} />
                </button>

                <h2 className="text-xl font-bold text-slate-800">
                  {categories.find((c) => c.type === selectedCategory)?.label}
                </h2>

                <ManualAddForm
                  type={selectedCategory}
                  onAdd={handleAddFavorite}
                />
              </div>

              {/* Search Bar - Full Width */}
              <div className="px-4">
                <SearchBar
                  onSearch={handleSearch}
                  placeholder={`Search...`}
                  onClear={() => {
                    setIsSearching(false);
                    setSearchResults([]);
                  }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden rounded-2xl mx-4 mb-4 p-3 bg-white/40 backdrop-blur-md shadow-lg">
                {isSearching ? (
                  <div className="h-full overflow-auto">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">
                      Search Results
                    </h3>
                    {loading ? (
                      <div className="flex items-center justify-center py-20">
                        <div className="relative w-20 h-20">
                          {/* Outer spinning ring */}
                          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                          <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>

                          {/* Inner pulsing circle */}
                          <div className="absolute inset-3 bg-blue-100 rounded-full animate-pulse"></div>

                          {/* Center dot */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {searchResults.map((item, index) => {
                          const itemId = (
                            item.id ||
                            item.imdbID ||
                            index
                          )?.toString();
                          const isFavorited = favoriteIds.has(itemId);

                          const getItemTitle = (item: any) => {
                            return (
                              item.name ||
                              item.title ||
                              item.Title ||
                              item.description ||
                              "Untitled"
                            );
                          };

                          const getItemImage = (item: any) => {
                            if (selectedCategory === "MUSIC")
                              return item.album?.image || item.image;
                            if (selectedCategory === "MOVIE")
                              return item.Poster || item.image;
                            return item.image || item.thumbnail || item.url;
                          };

                          const getInitials = (title: string) => {
                            return title
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                              .substring(0, 2)
                              .toUpperCase();
                          };

                          const imageUrl = getItemImage(item);
                          const title = getItemTitle(item);

                          return (
                            <div
                              key={itemId}
                              className="aspect-[3/4] bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-neutral-200 relative group cursor-pointer"
                              onClick={() => handleItemClick(item, false)}
                            >
                              {imageUrl && imageUrl !== "N/A" ? (
                                <img
                                  src={imageUrl}
                                  alt={title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-neutral-700 bg-neutral-200">
                                  {getInitials(title)}
                                </div>
                              )}

                              {/* Bottom-left title overlay */}
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                                <h3 className="text-white text-sm font-semibold truncate">
                                  {title}
                                </h3>
                              </div>

                              {/* Favorite indicator (top-right) */}
                              {isFavorited && (
                                <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                                  <svg
                                    className="w-4 h-4 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : getCategoryFavorites().length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-slate-500 text-lg">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📭</div>
                      <p className="text-xl font-medium mb-2">
                        No favorites yet
                      </p>
                      <p className="text-sm">Search and add some items!</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center pt-40">
                    <FavoriteCarousel
                      favorites={getCategoryFavorites()}
                      onDelete={handleDeleteFavorite}
                      onItemClick={(item) => handleItemClick(item, true)}
                      isMobile={isMobile}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <ItemDetailsModal
          item={selectedItem}
          type={selectedCategory}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDelete={modalIsFavorite ? handleDeleteFavorite : undefined}
          isFavorite={modalIsFavorite}
        />
      </>
    );
  }

  // DESKTOP LAYOUT
  return (
    <>
      <div className="h-screen w-screen flex bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 overflow-hidden">
        <div className="w-72 h-full p-6 flex flex-col border-r border-white/30">
          <div className="flex-1 flex justify-center">
            <VerticalCategoryCarousel
              categories={categories}
              onSelect={handleCategorySelect}
              isMobile={false}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col p-6 space-y-4 overflow-hidden">
          <div className="flex items-center justify-between gap-4 px-4">
            <h2 className="text-2xl font-bold text-slate-800 min-w-fit">
              {categories.find((c) => c.type === selectedCategory)?.label}
            </h2>
            <div className="flex items-center gap-4 flex-1 justify-end">
              <ManualAddForm
                type={selectedCategory}
                onAdd={handleAddFavorite}
              />
            </div>
          </div>

          {/* Search Bar - Separate Row */}
          <div className="px-4 flex justify-end">
            <div className="w-full max-w-md">
              <SearchBar
                onSearch={handleSearch}
                placeholder={`Search ${categories.find((c) => c.type === selectedCategory)?.label.toLowerCase()}...`}
                onClear={() => {
                  setIsSearching(false);
                  setSearchResults([]);
                }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-hidden rounded-2xl p-6 bg-white/40 backdrop-blur-md shadow-lg">
            {isSearching ? (
              <div className="h-full overflow-auto">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">
                  Search Results
                </h3>
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="relative w-24 h-24">
                      {/* Outer spinning ring */}
                      <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>

                      {/* Middle spinning ring (slower, opposite direction) */}
                      <div className="absolute inset-2 border-4 border-purple-200 rounded-full"></div>
                      <div className="absolute inset-2 border-4 border-transparent border-t-purple-600 rounded-full animate-spin-slow-reverse"></div>

                      {/* Inner pulsing circle */}
                      <div className="absolute inset-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full animate-pulse"></div>

                      {/* Center dot */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full animate-ping"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <SearchResults
                    results={searchResults}
                    type={selectedCategory}
                    onAddFavorite={handleAddFavorite}
                    onItemClick={(item) => handleItemClick(item, false)}
                    favoriteIds={favoriteIds}
                  />
                )}
              </div>
            ) : getCategoryFavorites().length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-lg">
                <div className="text-center">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-xl font-medium mb-2">No favorites yet</p>
                  <p className="text-sm">
                    Search and add some items to get started!
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <FavoriteCarousel
                  favorites={getCategoryFavorites()}
                  onDelete={handleDeleteFavorite}
                  onItemClick={(item) => handleItemClick(item, true)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <ItemDetailsModal
        item={selectedItem}
        type={selectedCategory}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={modalIsFavorite ? handleDeleteFavorite : undefined}
        isFavorite={modalIsFavorite}
      />

      <style jsx global>{`
        @keyframes spin-slow-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 2s linear infinite;
        }
      `}</style>
    </>
  );
}
