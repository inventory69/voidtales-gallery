import { useEffect, useState } from 'preact/hooks';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved === 'dark' || (!saved && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newDark = !dark;
    setDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
    document.documentElement.setAttribute('data-theme', newDark ? 'dark' : 'light');
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
  };

  return (
    <button
      aria-label={dark ? "Wechsle zu hellem Modus" : "Wechsle zu dunklem Modus"}
      onClick={toggleTheme}
      className="modern-theme-toggle"
      type="button"
    >
      <span className="toggle-icon" aria-hidden="true">
        <span className={`icon-sun${dark ? ' icon-hide' : ''}`}>☀️</span>
        <span className={`icon-moon${dark ? '' : ' icon-hide'}`}>🌙</span>
      </span>
    </button>
  );
}