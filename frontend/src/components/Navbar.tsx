import { useAtom, useSetAtom } from "jotai";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { userAtom, isAuthenticatedAtom } from "../store/authStore";
import { useRef, useEffect, useState } from "react";

export default function Navbar() {
  const [user] = useAtom(userAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const setUser = useSetAtom(userAtom);
  const navigate = useNavigate();

  // Hooks ALWAYS RUN — safe
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    setUser(null);
    fetch("https://favlist.onrender.com/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    navigate("/signin");
  };

  const getInitials = (name: string) =>
    name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-50">
      {/* If not authenticated -> render empty bar */}
      {!isAuthenticated ? (
        <div className="h-16" />
      ) : (
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/favorites" className="text-2xl font-semibold   ">
              Favorites
            </Link>

            {/* Profile */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen((p) => !p)}
                className="flex items-center px-2 py-1 rounded-full 
                hover:bg-lime-100/50 transition"
              >
                <div
                  className="w-10 h-10 rounded-full bg-black-200
                    border border-black p-4
                  flex items-center justify-center
                  text-slate-800 font-semibold shadow"
                >
                  {getInitials(user?.name || "")}
                </div>
              </button>

              {/* Dropdown */}
              {open && (
                <div
                  className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg 
                  border border-black  p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full border border-amber-400 p-6 flex items-center justify-center text-slate-800 font-bold text-lg shadow">
                      {getInitials(user?.name || "")}
                    </div>

                    <div className="min-w-0">
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
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm 
                    text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
