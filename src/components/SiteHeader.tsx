import { Link, useLocation } from "@tanstack/react-router";
import { ChevronDown, Menu, Moon, Sun } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
    <Button type="button" variant="ghost" size="icon" onClick={toggle} className="header-icon shrink-0" aria-label="Toggle theme" title={dark ? "Switch to light mode" : "Switch to dark mode"}>
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  );
}

export function SiteHeader({ onMenu }: { onMenu: () => void }) {
  const { pathname } = useLocation();
  const nav = "header-link";
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="header-brand"><Link to="/" className="site-logo">{SITE_NAME}</Link><span className="alpha-badge">alpha</span></div>
        <nav aria-label="Main navigation" className="header-nav" data-path={pathname}>
          <Link to="/spec/$version" params={{ version: currentVersion.id }} className={nav}>Spec</Link>
          <Link to="/calculator" className={nav}>Calculator</Link>
          <Link to="/alpha/$page" params={{ page: "start-here" }} className={nav}>Alpha kit</Link>
          <Link to="/changelog" className={nav}>Changelog</Link>
          <Link to="/decisions" className={nav}>Decisions</Link>
          <Link to="/research" className={nav}>Research</Link>
        </nav>
        <div className="header-tools"><Button variant="ghost" size="icon" className="header-icon lg:hidden" aria-label="Open navigation" title="Open navigation" onClick={onMenu}><Menu size={16} /></Button><ThemeToggle /></div>
      </div>
    </header>
  );
}
