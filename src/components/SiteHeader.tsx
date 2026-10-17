import { Link } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { SITE_NAME } from "@/config";
import { currentVersion } from "@/lib/content";
import { Button } from "@/components/ui/button";

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
    <Button type="button" variant="outline" size="icon" onClick={toggle} className="shrink-0" aria-label="Toggle theme" title={dark ? "Switch to light mode" : "Switch to dark mode"}>
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  );
}

export function SiteHeader() {
  const nav = "text-muted-foreground hover:text-foreground";
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <Link to="/" className="shrink-0 font-semibold tracking-wide text-foreground">{SITE_NAME}</Link>
        <nav aria-label="Main navigation" className="flex min-w-0 flex-1 items-center gap-4 overflow-x-auto whitespace-nowrap text-sm">
          <Link to="/spec/$version" params={{ version: currentVersion.id }} className={nav}>Spec</Link>
          <Link to="/calculator" className={nav}>Calculator</Link>
          <Link to="/alpha/$page" params={{ page: "start-here" }} className={nav}>Alpha kit</Link>
          <Link to="/changelog" className={nav}>Changelog</Link>
          <Link to="/decisions" className={nav}>Decisions</Link>
          <Link to="/research" className={nav}>Research</Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
