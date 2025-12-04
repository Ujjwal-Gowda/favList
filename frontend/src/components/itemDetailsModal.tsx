import { X, ExternalLink, Trash2, Download, Play } from "lucide-react";
import { useState } from "react";

export default function ItemDetailsModal({
  item,
  type,
  isOpen,
  onClose,
  onDelete,
  isFavorite = false,
}) {
  const handleDownload = () => {
    console.log("down");
    const url =
      item.download ||
      item.downloadUrl ||
      item.metadata?.downloadUrl ||
      item.links?.download ||
      item.image ||
      item.url;

    if (!url) return;

    const link = document.createElement("a");
    link.href = url;
    link.download = "favImage.jpg";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  const [expanded, setExpanded] = useState(false);
  if (!isOpen || !item) return null;

  // Pastel header themes
  const pastelHeader: Record<string, string> = {
    MUSIC: "bg-blue-100",
    MOVIE: "bg-purple-100",
    GAME: "bg-green-100",
    BOOK: "bg-amber-100",
    ART: "bg-rose-100",
    OTHER: "bg-gray-100",
  };

  const title =
    item.name ||
    item.title ||
    item.Title ||
    item.metadata?.title ||
    item.description ||
    "Untitled";

  const image =
    item.metadata?.image ||
    item.image ||
    item.thumbnail ||
    item.Poster ||
    item.url ||
    null;

  const description =
    item.metadata?.description ||
    item.description ||
    item.summary ||
    item.overview ||
    "";
  const artist =
    item.artist ||
    item.metadata?.artist ||
    item.creator ||
    item.author ||
    item.albumArtist ||
    "";
  const isLong = description.length > 150;

  const url =
    item.metadata?.url ||
    item.spotifyUrl ||
    item.imdbUrl ||
    item.previewLink ||
    item.unsplash ||
    "";
  const downloadUrl = item.download || item.downloadUrl;
  const unsplashUrl =
    item.unsplash ||
    item.metadata?.unsplashUrl ||
    item.unsplashUrl ||
    item.links?.html;
  console.log(downloadUrl, unsplashUrl);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-3"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-sm shadow-xl border border-slate-200 animate-in fade-in zoom-in p-0 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className={`${pastelHeader[type] || pastelHeader.OTHER} p-3`}>
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            {image ? (
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl font-bold text-slate-500">
                  {title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow"
            >
              <X size={16} className="text-slate-700" />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4">
          <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>

          {artist && <p className="text-sm text-slate-500 mb-2">by {artist}</p>}
          {/* Description */}
          {description && (
            <div className="mb-3">
              <p className="text-sm text-slate-600 leading-relaxed">
                {isLong
                  ? expanded
                    ? description
                    : description.slice(0, 150) + "..."
                  : description}
              </p>

              {isLong && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-blue-600 text-sm font-semibold"
                >
                  {expanded ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          )}

          {/* BUTTON ROW — compact pastel pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {/* MUSIC → PLAY */}
            {type === "MUSIC" && url && (
              <a
                href={url}
                target="_blank"
                className="flex items-center gap-1 bg-blue-200 px-3 py-1.5 rounded-full text-slate-700 text-sm font-medium hover:bg-blue-300 transition"
              >
                <Play size={16} />
                Play
              </a>
            )}

            {/* NORMAL LINK */}
            {type !== "MUSIC" && url && (
              <a
                href={url}
                target="_blank"
                className="flex items-center gap-1 bg-purple-200 px-3 py-1.5 rounded-full text-slate-700 text-sm font-medium hover:bg-purple-300 transition"
              >
                <ExternalLink size={16} />
                Open
              </a>
            )}

            {/* DOWNLOAD */}
            {downloadUrl && (
              <a
                onClick={handleDownload}
                href={download}
                download
                className="flex items-center gap-1 bg-green-200 px-3 py-1.5 rounded-full text-slate-700 text-sm font-medium hover:bg-green-300 transition"
              >
                <Download size={16} />
                Download
              </a>
            )}

            {/* UNSPLASH */}
            {unsplashUrl && (
              <a
                href={unsplashUrl}
                target="_blank"
                className="flex items-center gap-1 bg-rose-200 px-3 py-1.5 rounded-full text-slate-700 text-sm font-medium hover:bg-rose-300 transition"
              >
                <ExternalLink size={16} />
                Unsplash
              </a>
            )}

            {/* DELETE (icon only) */}
            {isFavorite && onDelete && (
              <button
                onClick={() => {
                  onDelete(item.id);
                  onClose();
                }}
                className="bg-red-200 px-3 py-1.5 rounded-full hover:bg-red-300 transition"
              >
                <Trash2 size={16} className="text-red-700" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
