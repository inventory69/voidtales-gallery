import { useEffect, useState } from 'preact/hooks';

/*
 * ThemeToggle component for switching between dark and light mode.
 * Stores preference in localStorage and updates the document's theme class and attribute.
 */
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved === 'dark' || (!saved && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, []);

  // Toggle theme and persist preference
  const toggleTheme = () => {
    const newDark = !dark;
    setDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
    document.documentElement.setAttribute('data-theme', newDark ? 'dark' : 'light');
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
  };

  return (
    <button
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
      className="modern-theme-toggle"
      type="button"
    >
      {/* Minimalistic toggle button, no icon */}
    </button>
  );
}