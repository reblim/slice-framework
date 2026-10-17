import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import { SITE_NAME } from "@/config";
import { currentVersion, getDoc, getToc, listDocs, versions } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SiteHeader } from "./SiteHeader";

export function documentSource(pathname: string) {
  if (pathname === "/") return getDoc("alpha/start-here");
  if (/^\/(spec|alpha|research)\//.test(pathname)) return getDoc(pathname.slice(1));
  if (pathname === "/changelog" || pathname === "/decisions") return getDoc(pathname.slice(1));
  return undefined;
}
function Sidebar({ close }: { close: () => void }) {
  const { pathname } = useLocation();
  const spec = pathname.startsWith("/spec/");
  const versionId = pathname.split("/")[2];
  const version = versions.find((item) => item.id === versionId) ?? currentVersion;
  return <nav className="docs-sidebar-nav" aria-label="Documentation navigation">
    {spec && <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="version-picker">v{version.id} · {version.status === "current" ? "Public alpha" : "Archived"}<ChevronDown size={14} /></Button></DropdownMenuTrigger><DropdownMenuContent align="start">{versions.map((item) => <DropdownMenuItem key={item.id} asChild><Link to="/spec/$version" params={{ version: item.id }} onClick={close}>v{item.id}{item.status === "archived" ? <span className="status-badge archived">archived</span> : null}{version.id === item.id && <Check size={14} />}</Link></DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>}
    <div className="sidebar-group"><p className="mono-label">Specification</p><Link to="/spec/$version" params={{ version: currentVersion.id }} className={spec ? "sidebar-item active" : "sidebar-item"} onClick={close}>Specification <span className="status-badge">Current</span></Link><Link to="/calculator" className={`sidebar-item ${pathname === "/calculator" ? "active" : ""}`} onClick={close}>Forecast calculator</Link></div>
    <div className="sidebar-group"><p className="mono-label">Alpha kit</p>{listDocs("alpha").map((doc) => <Link key={doc.page} to="/alpha/$page" params={{ page: doc.page }} className={`sidebar-item ${pathname === `/alpha/${doc.page}` ? "active" : ""}`} onClick={close}>{doc.title}</Link>)}</div>
    <div className="sidebar-group"><p className="mono-label">History</p><Link to="/changelog" className={`sidebar-item ${pathname === "/changelog" ? "active" : ""}`} onClick={close}>Changelog</Link><Link to="/decisions" className={`sidebar-item ${pathname === "/decisions" ? "active" : ""}`} onClick={close}>Decisions</Link></div>
    <div className="sidebar-group"><p className="mono-label">Research</p><Link to="/research" className={`sidebar-item ${pathname === "/research" ? "active" : ""}`} onClick={close}>Research documents</Link>{listDocs("research").map((doc) => <Link key={doc.page} to="/research/$page" params={{ page: doc.page }} className={`sidebar-item ${pathname === `/research/${doc.page}` ? "active" : ""}`} onClick={close}>{doc.title}</Link>)}</div>
  </nav>;
}
export function DocumentationShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const source = documentSource(pathname);
  const toc = source ? getToc(source) : [];
  const wide = pathname === "/calculator";
  useEffect(() => {
    setActive("");
    const headings = Array.from(document.querySelectorAll<HTMLElement>(".prose-doc h2[id], .prose-doc h3[id]"));
    const update = () => { const previous = headings.filter((heading) => heading.getBoundingClientRect().top <= 110); setActive(previous.at(-1)?.id ?? headings[0]?.id ?? ""); };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [pathname]);
  return <><SiteHeader onMenu={() => setOpen(true)} /><div className={`docs-shell ${wide ? "docs-shell-wide" : ""}`}>
    <aside className="docs-left"><Sidebar close={() => setOpen(false)} /></aside>
    <div className="docs-content">{children}</div>
    {!wide && <aside className="docs-right">{toc.length > 0 && <nav aria-label="On this page"><p className="mono-label">On this page</p><ul>{toc.map((item) => <li key={item.id} className={item.depth === 3 ? "toc-nested" : ""}><a href={`#${item.id}`} className={active === item.id ? "active" : ""}>{item.text}</a></li>)}</ul></nav>}</aside>}
  </div><footer className="site-footer"><span>{SITE_NAME} (working name) · Public alpha · Milber Ferreira, 2026</span><Link to="/changelog">Changelog</Link></footer>
  <Sheet open={open} onOpenChange={setOpen}><SheetContent side="left" className="docs-drawer"><SheetTitle className="px-6 pt-6 text-sm">{SITE_NAME} documentation</SheetTitle><Sidebar close={() => setOpen(false)} /></SheetContent></Sheet></>;
}