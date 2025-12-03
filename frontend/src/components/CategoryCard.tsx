import { type LucideIcon } from "lucide-react";

interface CategoryCardProps {
  icon: LucideIcon;
  label: string;
  count: number;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function CategoryCard({
  icon: Icon,
  label,
  count,
  color,
  isSelected,
  onClick,
}: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 ${
        isSelected
          ? `${color} scale-105 shadow-xl`
          : "bg-white hover:shadow-lg hover:scale-102"
      }`}
    >
      <div
        className={`p-4 rounded-xl mb-3 ${
          isSelected ? "bg-white/20" : "bg-slate-100"
        }`}
      >
        <Icon
          size={32}
          className={isSelected ? "text-white" : "text-slate-700"}
        />
      </div>
      <span
        className={`font-semibold text-sm ${
          isSelected ? "text-white" : "text-slate-700"
        }`}
      >
        {label}
      </span>
      <span
        className={`text-xs mt-1 ${
          isSelected ? "text-white/80" : "text-slate-500"
        }`}
      >
        {count} items
      </span>
    </button>
  );
}
