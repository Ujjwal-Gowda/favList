import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSetAtom } from "jotai";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { userAtom } from "../store/authStore";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const setUser = useSetAtom(userAtom);
  const navigate = useNavigate();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://favlist.onrender.com/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Sign up failed");
      }

      setUser(data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pastel-pink px-4">
      <div className="w-full max-w-sm bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-8 border border-white/50">
        {/* Header */}
        <h1 className="text-3xl font-semibold text-slate-700 mb-1 text-center">
          Create Account
        </h1>
        <p className="text-slate-500 text-center mb-8">Join us today ✨</p>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-700 border border-red-200 px-4 py-2 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 rounded-xl border border-slate-200 bg-white/90 focus:ring-2 focus:ring-pastel-pink focus:border-transparent outline-none"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full p-3 rounded-xl border border-slate-200 bg-white/90 focus:ring-2 focus:ring-pastel-pink focus:border-transparent outline-none"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full p-3 rounded-xl border border-slate-200 bg-white/90 focus:ring-2 focus:ring-pastel-pink focus:border-transparent outline-none pr-12"
            />

            {/* Show / Hide Password */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-100 text-black font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Redirect */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-pastel-pink hover:underline font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
