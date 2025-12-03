import { useAtom, useSetAtom } from "jotai";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Heart } from "lucide-react";
import { userAtom, isAuthenticatedAtom } from "../store/authStore";
import { useState } from "react";

export default function Navbar() {
  const [user] = useAtom(userAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const setUser = useSetAtom(userAtom);
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    setUser(null);
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/signin");
  };

  if (!isAuthenticated) return null;

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <nav className="bg-white/80 backdrop-blur border-b border-purple-200 sticky top-0 z-50">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/favorites"
            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            Favorites
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/favorites"
              className="text-slate-600 hover:text-purple-600 transition flex items-center gap-2"
            >
              <Heart size={18} />
            </Link>

            <div className="relative">
              <button
                onMouseEnter={() => setShowProfile(true)}
                onMouseLeave={() => setShowProfile(false)}
                className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-sm">
                  {getInitials(user?.name || "")}
                </div>
              </button>

              {showProfile && (
                <div
                  onMouseEnter={() => setShowProfile(true)}
                  onMouseLeave={() => setShowProfile(false)}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-purple-200 p-4 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg">
                      {getInitials(user?.name || "")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
