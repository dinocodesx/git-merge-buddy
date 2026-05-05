import { useState, useRef, useEffect } from "react";
import { Search, Command } from "lucide-react";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";

interface DocsSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const DocsSearch = ({ onSearch, placeholder = "SEARCH..." }: DocsSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useKeyboardShortcut("k", () => inputRef.current?.focus());

  useEffect(() => {
    onSearch(searchQuery);
  }, [searchQuery, onSearch]);

  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
        <Search size={18} />
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-zinc-900 border-4 border-zinc-800 focus:border-primary p-4 pl-12 font-space font-bold text-white outline-none transition-all placeholder:text-zinc-700"
      />
      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
        <div className="flex items-center gap-1 bg-zinc-800 px-2 py-1 border-2 border-zinc-700 rounded text-[10px] font-black text-white/40 group-focus-within:hidden">
          <Command size={10} />
          <span>K</span>
        </div>
      </div>
    </div>
  );
};
