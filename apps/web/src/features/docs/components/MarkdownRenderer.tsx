import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Zap } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <div className="max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-4xl md:text-6xl tracking-tighter text-primary uppercase font-space font-bold mb-8">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-space uppercase font-bold mt-12 mb-6 flex items-center gap-3 text-white">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-space uppercase font-bold mt-8 mb-4 text-white">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-xl opacity-80 leading-relaxed font-work mb-6 text-white">
              {children}
            </p>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-zinc-800 text-primary px-1 py-0.5 font-mono text-sm">
                {children}
              </code>
            ) : (
              <pre className="bg-zinc-950 text-zinc-300 p-6 border-4 border-primary/20 text-sm overflow-x-auto shadow-brutal-sm mb-8">
                <code className={className}>{children}</code>
              </pre>
            );
          },
          blockquote: ({ children }) => (
            <div className="bg-zinc-800/50 p-8 border-l-8 space-y-4 border-4 border-primary/20 my-8">
              <h3 className="text-xl font-bold flex items-center gap-2 text-primary uppercase font-space">
                <Zap size={20} />
                Pro Tip
              </h3>
              <div className="opacity-80 font-work italic text-white">
                {children}
              </div>
            </div>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 opacity-70 font-work mb-8 text-white">
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className="text-white">
              {children}
            </li>
          ),
          a: ({ children, href }) => (
            <a href={href} className="text-primary hover:underline font-bold">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
