export const LegalPage = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => (
  <div className="min-h-[70vh] bg-zinc-900 p-8 md:p-24 text-white">
    <div className="max-w-4xl mx-auto space-y-12">
      <h1 className="text-5xl md:text-8xl tracking-tighter text-primary uppercase font-space font-bold">
        {title}
      </h1>
      <div className="space-y-8 opacity-80 font-work text-lg leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
    </div>
  </div>
);
