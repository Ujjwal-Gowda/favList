import { useState, useRef } from "react";
import "../cssfiles/searchBar.scss";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  onClear?: () => void; // Add this prop
}

export default function SearchBar({
  onSearch,
  placeholder,
  onClear,
}: SearchBarProps) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSearch(value.trim());
  };

  const handleReset = () => {
    setValue("");
    setOpen(false);
    inputRef.current?.blur();
    onClear?.(); // Call the onClear callback
  };

  return (
    <form onSubmit={handleSubmit} className="inline-block">
      <div className="search-box">
        <input
          ref={inputRef}
          type="text"
          value={value}
          placeholder={placeholder || " "}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => value === "" && setOpen(false)}
          className={open || value ? "open" : ""}
        />

        <button
          type="reset"
          onClick={value ? handleReset : undefined}
          className={open || value ? "reset open" : "reset"}
        />
      </div>
    </form>
  );
}
