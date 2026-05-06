"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { NavLinkItem } from "@/types/Common";

const DesktopMenu = ({
  links,
  currentPath,
}: {
  links: NavLinkItem[];
  currentPath: string;
}) => (
  <div className="hidden md:flex gap-8 items-center font-space font-bold uppercase ml-auto mr-8">
    {links.map((link) => (
      <Link
        key={link.name}
        href={link.path}
        className={`transition-all hover:text-primary hover:bg-black px-2 py-1 ${currentPath === link.path ? "bg-black text-primary" : "text-black"}`}
      >
        {link.name}
      </Link>
    ))}
  </div>
);

const MobileMenu = ({
  links,
  isOpen,
  onClose,
}: {
  links: NavLinkItem[];
  isOpen: boolean;
  onClose: () => void;
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute top-full left-0 w-full bg-white border-b-4 border-black p-6 flex flex-col gap-6 md:hidden z-40 shadow-brutal"
      >
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.path}
            onClick={onClose}
            className="text-2xl font-space font-bold uppercase text-black"
          >
            {link.name}
          </Link>
        ))}
        <BrutalButton size="lg" as="a" href="#waitlist" onClick={onClose}>
          Join Beta
        </BrutalButton>
      </motion.div>
    )}
  </AnimatePresence>
);

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links: NavLinkItem[] = [
    { name: "Features", path: "/#features" },
    { name: "Pricing", path: "/pricing" },
    { name: "Docs", path: "/docs" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-4 border-black px-6 py-4 flex justify-between items-center transition-colors">
      <Link
        href="/"
        className="text-2xl font-black italic tracking-tighter text-black"
      >
        Git Merge Buddy
      </Link>

      <DesktopMenu links={links} currentPath={pathname} />

      <div className="flex items-center gap-4">
        <BrutalButton
          size="sm"
          as="a"
          href="/#waitlist"
          className="hidden md:flex"
          shadow="black-sm"
        >
          Join Beta
        </BrutalButton>
        <button
          className="md:hidden border-4 border-primary p-2 bg-black text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <MobileMenu
        links={links}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </nav>
  );
};
