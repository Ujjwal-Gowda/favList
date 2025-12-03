import { Trash2, ExternalLink } from "lucide-react";

interface FavoriteItemProps {
  id: string;
  title: string;
  metadata?: any;
  onDelete: (id: string) => void;
}

export default function FavoriteItem({
  id,
  title,
  metadata,
  onDelete,
}: FavoriteItemProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-4 border border-purple-100">
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
        {metadata?.image && metadata.image !== "N/A" ? (
          <img
            src={metadata.image}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML = `<div class="text-xl font-bold text-purple-400">${getInitials(title)}</div>`;
              }
            }}
          />
        ) : (
          <div className="text-xl font-bold text-purple-400">
            {getInitials(title)}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-slate-800 truncate">{title}</h3>
        {metadata?.artist && (
          <p className="text-sm text-slate-600 truncate">{metadata.artist}</p>
        )}
        {metadata?.year && (
          <p className="text-xs text-slate-500">Year: {metadata.year}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {metadata?.url && (
          <a
            href={metadata.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
          >
            <ExternalLink size={18} />
          </a>
        )}
        <button
          onClick={() => onDelete(id)}
          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
