import { motion } from "motion/react";

interface BrutalButtonProps {
  children: React.ReactNode;
  variant?: "yellow" | "white" | "black";
  className?: string;
  size?: "sm" | "md" | "lg";
  as?: any;
  [key: string]: any;
}

export const BrutalButton = ({
  children,
  variant = "yellow",
  className = "",
  size = "md",
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

  return (
    <motion.div
      whileHover={{ translateZ: 0, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="inline-block"
    >
      <Component
        className={`
          relative font-space font-bold uppercase border-4 border-primary
          ${variants[variant]} ${sizes[size]} ${className}
          shadow-brutal-sm active:shadow-none active:translate-x-1 active:translate-y-1 transition-all cursor-pointer
          flex items-center justify-center gap-2
        `}
        {...props}
      >
        {children}
      </Component>
    </motion.div>
  );
};
