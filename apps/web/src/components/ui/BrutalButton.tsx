"use client";

import { motion } from "motion/react";
import React from "react";

interface BrutalButtonProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: "yellow" | "white" | "black";
  className?: string;
  size?: "sm" | "md" | "lg";
  shadow?: "yellow" | "black" | "white" | "yellow-sm" | "black-sm" | "white-sm";
  as?: React.ElementType;
  href?: string;
  to?: string;
  target?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const BrutalButton = ({
  children,
  variant = "yellow",
  className = "",
  size = "md",
  shadow = "yellow-sm",
  as: Component = "button",
  ...props
}: BrutalButtonProps) => {
  const variants = {
    yellow: "bg-primary text-black hover:bg-yellow-400",
    white: "bg-white text-black hover:bg-neutral-100",
    black: "bg-black text-primary hover:bg-neutral-900 border-primary",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-10 py-5 text-xl md:text-2xl",
  };

  const shadows = {
    yellow: "shadow-brutal",
    black: "shadow-brutal-black",
    white: "shadow-brutal-white",
    "yellow-sm": "shadow-brutal-sm",
    "black-sm": "shadow-brutal-black-sm",
    "white-sm": "shadow-brutal-white-sm",
  };

  return (
    <motion.div
      whileHover={{ translateZ: 0, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="inline-block"
    >
      <Component
        className={`
          relative font-space font-bold uppercase border-4 border-primary
          ${variants[variant]} ${sizes[size]} ${shadows[shadow]} ${className}
          active:shadow-none active:translate-x-1 active:translate-y-1 transition-all cursor-pointer
          flex items-center justify-center gap-2
        `}
        {...props}
      >
        {children}
      </Component>
    </motion.div>
  );
};
