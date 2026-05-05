import { useEffect } from "react";

export const useKeyboardShortcut = (
  key: string,
  callback: () => void,
  metaOrCtrl = true
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const matchKey = e.key.toLowerCase() === key.toLowerCase();
      const matchModifier = metaOrCtrl ? e.metaKey || e.ctrlKey : true;

      if (matchKey && matchModifier) {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, callback, metaOrCtrl]);
};
