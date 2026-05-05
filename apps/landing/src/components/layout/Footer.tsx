import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="bg-black text-primary px-6 py-20 border-t-4 border-primary">
    <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-center md:text-left">
      <div className="md:col-span-1 space-y-6">
        <div className="text-3xl font-black italic tracking-tighter">
          Git Merge Buddy
        </div>
        <p className="text-white/60 font-work font-medium normal-case">
          Automating the senior engineering eye. Built for teams that refuse to
          compromise on code quality.
        </p>
      </div>

      {[
        {
          title: "Product",
          links: [
            { name: "Features", path: "/#features" },
            { name: "Security", path: "/#features" },
            { name: "Enterprise", path: "/pricing" },
          ],
        },
        {
          title: "Resources",
          links: [
            { name: "Twitter", path: "#" },
            { name: "GitHub", path: "#" },
            { name: "Discord", path: "#" },
          ],
        },
        {
          title: "Legal",
          links: [
            { name: "Privacy", path: "/privacy" },
            { name: "Terms", path: "/terms" },
            { name: "Security Policy", path: "/security-policy" },
          ],
        },
      ].map((col, i) => (
        <div key={i} className="space-y-4">
          <h4 className="text-white font-space font-bold border-b-2 border-primary/20 pb-2">
            {col.title}
          </h4>
          <ul className="space-y-2 opacity-60 font-space font-bold">
            {col.links.map((l) => (
              <li key={l.name}>
                <Link
                  to={l.path}
                  className="hover:text-white transition-colors"
                >
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 opacity-40 font-bold uppercase text-xs">
      <div>© 2024 Git Merge Buddy. CODE OR DIE.</div>
      <div className="flex gap-6">
        <span>EST. 2024</span>
        <span>MERGE SMARTER</span>
      </div>
    </div>
  </footer>
);
