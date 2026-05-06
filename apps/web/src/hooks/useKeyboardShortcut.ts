import { useEffect } from "react";

export const useKeyboardShortcut = (
  key: string,
  callback: () => void,
  metaOrCtrl = true,
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMatch = e.key.toLowerCase() === key.toLowerCase();
      if (!isMatch) return;

      const hasModifier = metaOrCtrl ? e.metaKey || e.ctrlKey : true;
      if (!hasModifier) return;

      e.preventDefault();
      callback();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, callback, metaOrCtrl]);
};
