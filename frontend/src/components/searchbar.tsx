import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder }: SearchBarProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim().length === 0) return;
    onSearch(value.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex items-center gap-2 p-2 bg-gray-800 rounded-xl shadow-md"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder || "Search…"}
        className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
      />

      <button
        type="submit"
        className="px-4 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Search
      </button>
    </form>
  );
}
