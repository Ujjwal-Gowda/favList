import { useState } from "react";
import { Plus, Upload, X } from "lucide-react";

export default function ManualAddForm({ type, onAdd }) {
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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setMetadata({ ...metadata, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const clean = Object.fromEntries(
      Object.entries(metadata).filter(([_, v]) => v !== ""),
    );
    onAdd({ title, metadata: clean });
    setIsOpen(false);
  };

  const initials = (str) =>
    str
      .split(" ")
      .map((w) => w[0]?.toUpperCase())
      .join("")
      .slice(0, 2);

  return (
    <>
      {/* Open Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="
          border-4 border-purple-300 text-purple-700 bg-pink-100 
          px-5 py-2 rounded-xl font-medium shadow-sm 
          hover:-translate-y-1 hover:shadow-md transition
        "
      >
        <Plus className="inline-block mr-2" />
        Add
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="
            fixed inset-0 z-40 flex items-start justify-center 
            bg-black/30
          "
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
        >
          <form
            onSubmit={submit}
            className="
              mt-16 w-[420px] bg-white border-4  
              rounded-2xl p-6 relative shadow-xl 
              animate-popupDrop
            "
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={26} />
            </button>

            <h2 className="text-2xl font-bold  border-b-2  pb-2 mb-4">
              Add {type.toLowerCase()}
            </h2>

            {/* Image */}
            <div className="flex flex-col items-center mb-4">
              <div
                className="
                  w-28 h-28 rounded-xl border-2 border-orange-300
                  bg-orange-100 flex items-center justify-center
                "
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    className="w-full h-full rounded-lg object-cover"
                  />
                ) : title ? (
                  <span className="text-3xl font-bold text-orange-600">
                    {initials(title)}
                  </span>
                ) : (
                  <Upload className="text-black-400" size={28} />
                )}
              </div>

              <label
                className="
                  cursor-pointer px-3 py-1 mt-3 rounded-lg 
                   border 
                  text-black-600 text-sm 
                  hover:bg-black-200 transition
                "
              >
                Upload
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {/* Fields */}
            <div className="space-y-3">
              <input
                className="w-full p-2 rounded-md border-2 border-gray-400 bg-white"
                placeholder="Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <input
                className="w-full p-2 rounded-md border-2 border-gray-400 bg-white"
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
                onChange={(e) =>
                  setMetadata({ ...metadata, artist: e.target.value })
                }
              />

              <input
                className="w-full p-2 rounded-md border-2 border-gray-400 bg-white"
                placeholder="Year"
                value={metadata.year}
                onChange={(e) =>
                  setMetadata({ ...metadata, year: e.target.value })
                }
              />

              <input
                className="w-full p-2 rounded-md border-2 border-gray-400 bg-white"
                placeholder="URL (optional)"
                value={metadata.url}
                onChange={(e) =>
                  setMetadata({ ...metadata, url: e.target.value })
                }
              />

              <textarea
                rows={3}
                placeholder="Description (optional)"
                className="w-full p-2 rounded-md border-2 border-gray-400 bg-white"
                value={metadata.description}
                onChange={(e) =>
                  setMetadata({ ...metadata, description: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              className="
                mt-5 w-full border-4 border-green-400 
                bg-green-200 text-black 
                py-2 rounded-xl font-medium 
                hover:bg-green-300 transition
              "
            >
              Add to Favorites
            </button>
          </form>
        </div>
      )}

      {/* Animation */}
      <style jsx global>{`
        @keyframes popupDrop {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-popupDrop {
          animation: popupDrop 0.25s ease-out forwards;
        }
      `}</style>
    </>
  );
}
