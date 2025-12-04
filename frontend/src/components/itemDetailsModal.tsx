import { X, ExternalLink, Trash2, Calendar, User, Info } from "lucide-react";

interface ItemDetailsModalProps {
  item: any;
  type: string;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (id: string) => void;
  isFavorite?: boolean;
}

export default function ItemDetailsModal({
  item,
  type,
  isOpen,
  onClose,
  onDelete,
  isFavorite = false,
}: ItemDetailsModalProps) {
  if (!isOpen || !item) return null;

  const getTitle = () => item.name || item.title || item.Title || "Untitled";
  const getImage = () => {
    if (type === "MUSIC")
      return item.metadata?.image || item.album?.image || item.image;
    if (type === "MOVIE")
      return item.metadata?.image || item.Poster || item.image;
    return item.metadata?.image || item.image || item.thumbnail || item.url;
  };

  const getMetadata = () => {
    const meta = [];

    if (item.metadata?.artist || item.artists) {
      meta.push({
        icon: User,
        label:
          type === "MOVIE" ? "Cast" : type === "BOOK" ? "Author" : "Artist",
        value:
          item.metadata?.artist ||
          item.artists?.map((a: any) => a.name).join(", ") ||
          "",
      });
    }

    if (
      item.metadata?.year ||
      item.Year ||
      item.year ||
      item.album?.releaseDate
    ) {
      meta.push({
        icon: Calendar,
        label: "Year",
        value:
          item.metadata?.year ||
          item.Year ||
          item.year ||
          item.album?.releaseDate ||
          "",
      });
    }

    if (item.metadata?.platform || item.platform) {
      meta.push({
        icon: Info,
        label: "Platform",
        value: Array.isArray(item.metadata?.platform || item.platform)
          ? (item.metadata?.platform || item.platform).join(", ")
          : item.metadata?.platform || item.platform,
      });
    }

    if (item.metadata?.rating || item.rating) {
      meta.push({
        icon: Info,
        label: "Rating",
        value: Math.round(item.metadata?.rating || item.rating) + "/100",
      });
    }

    return meta;
  };

  const getDescription = () => {
    return item.metadata?.description || item.description || item.summary || "";
  };

  const getUrl = () => {
    return (
      item.metadata?.url ||
      item.spotifyUrl ||
      item.imdbUrl ||
      item.usplash ||
      item.previewLink ||
      ""
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Image */}
        <div className="relative h-72 bg-gradient-to-br from-blue-100 to-cyan-100">
          {getImage() ? (
            <img
              src={getImage()}
              alt={getTitle()}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-8xl font-bold text-slate-600">
                {getTitle().charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
          >
            <X className="w-5 h-5 text-slate-700" />
          </button>

          {/* Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            {getTitle()}
          </h2>

          {/* Metadata Grid */}
          {getMetadata().length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {getMetadata().map((meta, index) => {
                const Icon = meta.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-slate-50 rounded-lg p-3"
                  >
                    <Icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500 font-medium">
                        {meta.label}
                      </p>
                      <p className="text-sm text-slate-800 font-medium truncate">
                        {meta.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Description */}
          {getDescription() && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Description
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {getDescription()}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {getUrl() && (
              <a
                href={getUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-all"
              >
                <ExternalLink size={18} />
                View Source
              </a>
            )}

            {isFavorite && onDelete && (
              <button
                onClick={() => {
                  onDelete(item.id);
                  onClose();
                }}
                className="flex items-center justify-center gap-2 bg-rose-500 text-white px-4 py-3 rounded-xl font-semibold hover:bg-rose-600 transition-all"
              >
                <Trash2 size={18} />
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
