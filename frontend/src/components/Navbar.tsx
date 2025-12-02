import { useAtom, useSetAtom } from "jotai";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Heart, Search } from "lucide-react";
import { userAtom, isAuthenticatedAtom } from "../store/authStore";

export default function Navbar() {
  const [user] = useAtom(userAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const setUser = useSetAtom(userAtom);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/signin");
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="text-xl font-bold text-slate-900">
              MyApp
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/dashboard"
                className="text-slate-600 hover:text-slate-900 transition flex items-center gap-2"
              >
                <Search size={18} />
                Search
              </Link>
              <Link
                to="/favorites"
                className="text-slate-600 hover:text-slate-900 transition flex items-center gap-2"
              >
                <Heart size={18} />
                Favorites
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-600">
              <User size={18} />
              <span className="hidden sm:inline text-sm">{user?.name}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
