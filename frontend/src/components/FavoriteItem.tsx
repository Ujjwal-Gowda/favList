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
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-4">
      {metadata?.image && (
        <img
          src={metadata.image}
          alt={title}
          className="w-16 h-16 object-cover rounded-lg"
        />
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-slate-900 truncate">{title}</h3>
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
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            <ExternalLink size={18} />
          </a>
        )}
        <button
          onClick={() => onDelete(id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
