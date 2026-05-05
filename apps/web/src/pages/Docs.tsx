import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";
import { TableOfContents } from "@/components/docs/TableOfContents";
import { DocSection } from "@/types/DocSection";
import { BrutalButton } from "@/components/ui/BrutalButton";

const docSections: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    filePath: "/docs/getting-started.md",
  },
  {
    id: "configuration",
    title: "Configuration",
    filePath: "/docs/configuration.md",
  },
  {
    id: "security-policies",
    title: "Security Policies",
    filePath: "/docs/security-policies.md",
  },
];

export const DocsPage = () => {
  const [activeSectionId, setActiveSectionId] = useState("getting-started");
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      setIsLoading(true);
      const section = docSections.find((s) => s.id === activeSectionId);
      if (section) {
        try {
          const response = await fetch(section.filePath);
          const text = await response.text();
          setContent(text);
        } catch (error) {
          console.error("Failed to fetch doc:", error);
          setContent("# Error\nFailed to load documentation.");
        }
      }
      setIsLoading(false);
    };

    fetchDoc();
  }, [activeSectionId]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-zinc-900 transition-colors">
      <DocsSidebar
        sections={docSections}
        activeSectionId={activeSectionId}
        onSelect={setActiveSectionId}
      />

      <div className="flex-1 flex flex-col xl:flex-row gap-8 xl:gap-16 p-8 md:p-16 overflow-hidden">
        <main className="flex-1 max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSectionId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-primary font-space font-bold text-2xl animate-pulse">
                    LOADING...
                  </div>
                </div>
              ) : (
                <MarkdownRenderer content={content} />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-24 pt-8 border-t-4 border-primary/20 flex justify-between items-center">
            <BrutalButton
              variant="white"
              size="sm"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Back to Top
            </BrutalButton>
            <div className="flex gap-4 opacity-40 font-bold uppercase text-xs text-white">
              <span>Last Updated: 2024</span>
            </div>
          </div>
        </main>

        {!isLoading && <TableOfContents content={content} />}
      </div>
    </div>
  );
};
