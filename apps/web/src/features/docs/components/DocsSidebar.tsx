import { DocSection } from "../types";
import { BrutalButton } from "@/components/ui/BrutalButton";

interface DocsSidebarProps {
  sections: DocSection[];
  activeSectionId: string;
  onSelect: (id: string) => void;
}

export const DocsSidebar = ({ sections, activeSectionId, onSelect }: DocsSidebarProps) => {
  return (
    <aside className="w-full md:w-72 bg-black border-r-4 border-primary p-8 space-y-12 shrink-0">
      <div className="space-y-4">
        <div className="text-xs font-black opacity-40 uppercase tracking-widest text-white/40">
          Documentation
        </div>
        <nav className="flex flex-col gap-2">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => onSelect(sec.id)}
              className={`
                text-left font-space font-bold uppercase p-3 transition-all
                ${
                  activeSectionId === sec.id
                    ? "bg-primary text-black border-4 border-primary shadow-brutal-sm"
                    : "opacity-60 hover:opacity-100 text-white"
                }
              `}
            >
              {sec.title}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 bg-zinc-800 border-4 border-primary/20 space-y-4">
        <h4 className="text-sm font-black text-white">NEED HELP?</h4>
        <BrutalButton variant="yellow" size="sm" className="w-full">
          Support
        </BrutalButton>
      </div>
    </aside>
  );
};
