import { useState } from "react";
import { DocSection } from "@/types/DocSection";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { DocsSearch } from "./DocsSearch";

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

  const filteredSections = sections.filter((sec) =>
    sec.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <aside className="w-full md:w-80 bg-black border-r-4 border-primary p-8 space-y-8 shrink-0 flex flex-col h-screen sticky top-0 overflow-y-auto">
      <div className="space-y-6">
        <div className="text-xs font-black uppercase tracking-widest text-white">
          Documentation
        </div>

        <DocsSearch onSearch={setSearchQuery} />

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
