import { useState } from "react";
import { Plus, Upload } from "lucide-react";

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
    image: "",
  });
  const [imagePreview, setImagePreview] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setMetadata({ ...metadata, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const cleanMetadata = Object.fromEntries(
      Object.entries(metadata).filter(([_, v]) => v !== ""),
    );

    onAdd({ title, metadata: cleanMetadata });
    setTitle("");
    setMetadata({ artist: "", year: "", description: "", url: "", image: "" });
    setImagePreview("");
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition shadow-lg"
      >
        <Plus size={20} />
        Add Manually
      </button>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-lg space-y-4 border border-purple-100"
    >
      <h3 className="font-semibold text-slate-800 mb-4">
        Add {type.toLowerCase()} manually
      </h3>

      {/* Image Upload */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center border-2 border-dashed border-purple-300">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : title ? (
            <div className="text-3xl font-bold text-purple-400">
              {getInitials(title)}
            </div>
          ) : (
            <Upload size={32} className="text-purple-300" />
          )}
        </div>
        <label className="cursor-pointer bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition">
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      <input
        type="text"
        placeholder="Title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none bg-white/50"
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
        className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none bg-white/50"
      />

      <input
        type="text"
        placeholder="Year"
        value={metadata.year}
        onChange={(e) => setMetadata({ ...metadata, year: e.target.value })}
        className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none bg-white/50"
      />

      <input
        type="url"
        placeholder="URL (optional)"
        value={metadata.url}
        onChange={(e) => setMetadata({ ...metadata, url: e.target.value })}
        className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none bg-white/50"
      />

      <textarea
        placeholder="Description (optional)"
        value={metadata.description}
        onChange={(e) =>
          setMetadata({ ...metadata, description: e.target.value })
        }
        className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none resize-none bg-white/50"
        rows={3}
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white py-2 rounded-lg font-medium transition"
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
