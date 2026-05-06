"use client";

import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Zap, PlayCircle, Copy, Check } from "lucide-react";
import React, { useState } from "react";
import { slugify } from "@/utils/string";

interface MarkdownRendererProps {
  content: string;
}

/**
 * Typography Components
 */
const H1: Components["h1"] = ({ children }) => {
  const id = typeof children === "string" ? slugify(children) : undefined;
  return (
    <h1
      id={id}
      className="text-4xl md:text-6xl tracking-tighter text-primary uppercase font-space font-bold mb-8"
    >
      {children}
    </h1>
  );
};

const H2: Components["h2"] = ({ children }) => {
  const id = typeof children === "string" ? slugify(children) : undefined;
  return (
    <h2
      id={id}
      className="text-2xl font-space uppercase font-bold mt-12 mb-6 flex items-center gap-3 text-white border-b-4 border-primary/10 pb-2"
    >
      {children}
    </h2>
  );
};

const H3: Components["h3"] = ({ children }) => {
  const id = typeof children === "string" ? slugify(children) : undefined;
  return (
    <h3
      id={id}
      className="text-xl font-space uppercase font-bold mt-8 mb-4 text-white"
    >
      {children}
    </h3>
  );
};

const H4: Components["h4"] = ({ children }) => {
  const id = typeof children === "string" ? slugify(children) : undefined;
  return (
    <h4
      id={id}
      className="text-lg font-space uppercase font-bold mt-6 mb-3 text-white opacity-90"
    >
      {children}
    </h4>
  );
};

const P: Components["p"] = ({ children }) => (
  <p className="text-xl opacity-80 leading-relaxed font-work mb-6 text-white">
    {children}
  </p>
);

/**
 * Code Components
 */
const Code: Components["code"] = ({ children, className }) => {
  const [copied, setCopied] = useState(false);
  const isInline = !className;

  if (isInline) {
    return (
      <code className="bg-zinc-800 text-primary px-1.5 py-0.5 font-mono text-sm border border-primary/20">
        {children}
      </code>
    );
  }

  const language = className?.replace("language-", "") || "code";

  const handleCopy = () => {
    const codeString = String(children).replace(/\n$/, "");
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-8">
      <div className="absolute -top-3 left-4 bg-primary text-black px-2 py-0.5 text-xs font-bold uppercase tracking-wider z-10">
        {language}
      </div>

      <button
        onClick={handleCopy}
        className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 hover:bg-zinc-700 text-white p-2 border-2 border-primary/20 hover:border-primary shadow-brutal-sm flex items-center gap-2 text-xs font-bold uppercase"
      >
        {copied ? (
          <>
            <Check size={14} className="text-primary" />
            <span>Copied</span>
          </>
        ) : (
          <>
            <Copy size={14} />
            <span>Copy</span>
          </>
        )}
      </button>

      <pre className="bg-zinc-950 text-zinc-300 p-6 border-4 border-primary/20 text-sm overflow-x-auto shadow-brutal-sm">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
};

/**
 * List Components
 */
const Ul: Components["ul"] = ({ children }) => (
  <ul className="list-disc list-inside space-y-3 opacity-80 font-work mb-8 text-white ml-4">
    {children}
  </ul>
);

const Ol: Components["ol"] = ({ children }) => (
  <ol className="list-decimal list-inside space-y-3 opacity-80 font-work mb-8 text-white ml-4">
    {children}
  </ol>
);

const Li: Components["li"] = ({ children }) => (
  <li className="text-white marker:text-primary marker:font-bold">
    {children}
  </li>
);

/**
 * Table Components
 */
const Table: Components["table"] = ({ children }) => (
  <div className="overflow-x-auto my-8 border-4 border-primary/20 shadow-brutal-sm">
    <table className="w-full border-collapse">{children}</table>
  </div>
);

const THead: Components["thead"] = ({ children }) => (
  <thead className="bg-zinc-800 border-b-4 border-primary/20">{children}</thead>
);

const Th: Components["th"] = ({ children }) => (
  <th className="p-4 text-left font-space uppercase font-bold text-primary border-2 border-primary/10">
    {children}
  </th>
);

const Td: Components["td"] = ({ children }) => (
  <td className="p-4 font-work border-2 border-primary/10 text-white/80">
    {children}
  </td>
);

/**
 * Media Components
 */
const Media: Components["img"] = ({ src, alt }) => {
  const isVideo = typeof src === "string" ? src.match(/\.(mp4|webm|ogg|mov)$/i) : null;

  const Container = ({ children }: { children: React.ReactNode }) => (
    <div className="my-10">
      <div className="relative border-4 border-primary/20 shadow-brutal-md overflow-hidden bg-zinc-900 group">
        {children}
      </div>
      {alt && (
        <p className="mt-4 text-sm font-work opacity-60 italic text-center text-white">
          {alt}
        </p>
      )}
    </div>
  );

  if (isVideo) {
    return (
      <Container>
        <video src={src} controls className="w-full aspect-video object-cover">
          {alt}
        </video>
        <div className="absolute top-4 right-4 bg-primary text-black p-2 shadow-brutal-sm group-hover:scale-110 transition-transform pointer-events-none">
          <PlayCircle size={24} />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <img
        src={src}
        alt={alt}
        className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500"
      />
    </Container>
  );
};

/**
 * Other Components
 */
const Blockquote: Components["blockquote"] = ({ children }) => (
  <div className="bg-zinc-800/50 p-8 border-l-8 space-y-4 border-4 border-primary/20 my-8">
    <h3 className="text-xl font-bold flex items-center gap-2 text-primary uppercase font-space">
      <Zap size={20} />
      Pro Tip
    </h3>
    <div className="opacity-80 font-work italic text-white">{children}</div>
  </div>
);

const A: Components["a"] = ({ children, href }) => (
  <a
    href={href}
    className="text-primary hover:text-white transition-colors duration-200 font-bold underline decoration-2 underline-offset-4"
    target={href?.startsWith("http") ? "_blank" : undefined}
    rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
  >
    {children}
  </a>
);

/**
 * Formatting Components
 */
const Hr: Components["hr"] = () => (
  <hr className="my-12 border-t-4 border-primary/10" />
);

const Strong: Components["strong"] = ({ children }) => (
  <strong className="font-bold text-primary">{children}</strong>
);

const Em: Components["em"] = ({ children }) => (
  <em className="italic opacity-90 text-white">{children}</em>
);

const Del: Components["del"] = ({ children }) => (
  <del className="line-through opacity-50 decoration-primary decoration-2">
    {children}
  </del>
);

/**
 * Component Mapping
 */
const markdownComponents: Components = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  p: P,
  a: A,
  code: Code,
  blockquote: Blockquote,
  ul: Ul,
  ol: Ol,
  li: Li,
  hr: Hr,
  table: Table,
  thead: THead,
  th: Th,
  td: Td,
  strong: Strong,
  em: Em,
  del: Del,
  img: Media,
};

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <div className="max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
