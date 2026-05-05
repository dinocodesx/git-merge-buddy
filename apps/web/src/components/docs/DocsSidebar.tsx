import { useState, useEffect, useRef } from "react";
import { Search, Command } from "lucide-react";
import { DocSection } from "@/types/DocSection";
import { BrutalButton } from "@/components/ui/BrutalButton";

interface DocsSidebarProps {
  sections: DocSection[];
  activeSectionId: string;
  onSelect: (id: string) => void;
}

export const DocsSidebar = ({
  sections,
  activeSectionId,
  onSelect,
}: DocsSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredSections = sections.filter((sec) =>
    sec.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <aside className="w-full md:w-80 bg-black border-r-4 border-primary p-8 space-y-8 shrink-0 flex flex-col h-screen sticky top-0 overflow-y-auto">
      <div className="space-y-6">
        <div className="text-xs font-black uppercase tracking-widest text-white">
          Documentation
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
            <Search size={18} />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="SEARCH..."
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

        <nav className="flex flex-col gap-2">
          {filteredSections.length > 0 ? (
            filteredSections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => onSelect(sec.id)}
                className={`
                  text-left font-space font-bold uppercase p-3 transition-all border-4
                  ${
                    activeSectionId === sec.id
                      ? "bg-primary text-black border-primary shadow-brutal-sm"
                      : "opacity-60 hover:opacity-100 text-white border-transparent hover:border-primary/20"
                  }
                `}
              >
                {sec.title}
              </button>
            ))
          ) : (
            <div className="p-4 border-4 border-dashed border-zinc-800 text-zinc-600 font-space font-bold text-xs uppercase text-center">
              No results found
            </div>
          )}
        </nav>
      </div>

      <div className="">
        <div className="p-4 bg-zinc-800 border-4 border-primary/20 space-y-4">
          <h4 className="text-sm font-black text-white">NEED HELP?</h4>
          <BrutalButton variant="yellow" size="sm" className="w-full">
            Support
          </BrutalButton>
        </div>
      </div>
    </aside>
  );
};
