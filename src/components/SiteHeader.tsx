import { Link } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { SITE_NAME } from "@/config";
import { currentVersion } from "@/lib/content";

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const d = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
  }, []);
  const toggle = () => {
    const d = !dark;
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
    localStorage.setItem("theme", d ? "dark" : "light");
  };
  return (
    <button type="button" onClick={toggle} className="icon-btn" aria-label="Toggle theme">
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

export function SiteHeader() {
  const nav = "text-muted-foreground hover:text-foreground";
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <Link to="/" className="font-semibold tracking-wide text-foreground">{SITE_NAME}</Link>
        <nav className="flex flex-1 items-center gap-4 overflow-x-auto text-sm">
          <Link to="/spec/$version" params={{ version: currentVersion.id }} className={nav}>Spec</Link>
          <Link to="/changelog" className={nav}>Changelog</Link>
          <Link to="/decisions" className={nav}>Decisions</Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
