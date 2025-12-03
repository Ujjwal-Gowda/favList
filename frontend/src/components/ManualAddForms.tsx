import { useState } from "react";
import { Plus } from "lucide-react";

interface ManualAddFormProps {
  type: string;
  onAdd: (data: { title: string; metadata: any }) => void;
}

export default function ManualAddForm({ type, onAdd }: ManualAddFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [metadata, setMetadata] = useState({
    artist: "",
    year: "",
    description: "",
    url: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const cleanMetadata = Object.fromEntries(
      Object.entries(metadata).filter(([_, v]) => v !== ""),
    );

    onAdd({ title, metadata: cleanMetadata });
    setTitle("");
    setMetadata({ artist: "", year: "", description: "", url: "" });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition"
      >
        <Plus size={20} />
        Add Manually
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl p-6 shadow-lg space-y-4"
    >
      <h3 className="font-semibold text-slate-900 mb-4">
        Add {type.toLowerCase()} manually
      </h3>

      <input
        type="text"
        placeholder="Title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        required
      />

      <input
        type="text"
        placeholder={
          type === "MUSIC"
            ? "Artist"
            : type === "MOVIE"
              ? "Director"
              : type === "BOOK"
                ? "Author"
                : "Creator"
        }
        value={metadata.artist}
        onChange={(e) => setMetadata({ ...metadata, artist: e.target.value })}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      />

      <input
        type="text"
        placeholder="Year"
        value={metadata.year}
        onChange={(e) => setMetadata({ ...metadata, year: e.target.value })}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      />

      <input
        type="url"
        placeholder="URL (optional)"
        value={metadata.url}
        onChange={(e) => setMetadata({ ...metadata, url: e.target.value })}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      />

      <textarea
        placeholder="Description (optional)"
        value={metadata.description}
        onChange={(e) =>
          setMetadata({ ...metadata, description: e.target.value })
        }
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
        rows={3}
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
        >
          Add to Favorites
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg font-medium transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
