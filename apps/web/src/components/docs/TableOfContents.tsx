import React, { useMemo } from "react";
import { List } from "lucide-react";
import { slugify } from "@/utils/string";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

const TOCHeader = () => (
  <div className="flex items-center gap-2 mb-6 text-primary border-b-4 border-primary/20 pb-2">
    <List size={20} />
    <h3 className="font-space font-black uppercase text-lg tracking-tighter">
      ON THIS PAGE
    </h3>
  </div>
);

const TOCProTip = () => (
  <div className="mt-12 p-4 bg-zinc-800 border-2 border-primary/20 shadow-brutal-sm">
    <p className="text-[10px] font-work font-bold text-white/40 uppercase leading-tight">
      Pro Tip: Use <span className="text-primary">CMD+K</span> to search through
      our entire documentation instantly.
    </p>
  </div>
);

export const TableOfContents = ({ content }: TableOfContentsProps) => {
  const headings = useMemo(() => {
    const headingRegex = /^(#{1,4})\s+(.+)$/gm;
    const items: TOCItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].replace(/\[(.*?)\]\(.*?\)/g, "$1");
      items.push({
        id: slugify(text),
        text,
        level,
      });
    }

    return items;
  }, [content]);

  if (headings.length === 0) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <aside className="hidden xl:block w-64 sticky top-8 h-fit max-h-[calc(100vh-4rem)] overflow-y-auto pr-4">
      <TOCHeader />

      <nav className="space-y-4">
        {headings.map((heading, index) => (
          <a
            key={`${heading.id}-${index}`}
            href={`#${heading.id}`}
            onClick={(e) => handleClick(e, heading.id)}
            className={`block font-space font-bold uppercase transition-all duration-200 hover:text-primary ${
              heading.level === 1
                ? "text-sm text-white"
                : heading.level === 2
                  ? "text-xs text-white/80 ml-3"
                  : heading.level === 3
                    ? "text-[10px] text-white/60 ml-6"
                    : "text-[10px] text-white/40 ml-9"
            }`}
          >
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              {heading.text}
            </span>
          </a>
        ))}
      </nav>

      <TOCProTip />
    </aside>
  );
};
