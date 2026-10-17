import { Link } from "@tanstack/react-router";
import { TAGLINE } from "@/config";
import { currentVersion, getDoc } from "@/lib/content";
import { Markdown } from "@/components/Markdown";
import { Button } from "@/components/ui/button";

export function Home() {
  const md = getDoc("alpha/start-here");
  const firstSection = md?.search(/^##\s/m) ?? -1;
  const opening = md?.split("\n").find((line) => line.startsWith("**")) ?? "";
  return (
    <main className="home-page">
      <p className="article-eyebrow">Public alpha · v{currentVersion.id}</p>
      <h1 className="home-title">{TAGLINE}</h1>
      <div className="home-lead"><Markdown source={opening} /></div>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button asChild><Link to="/spec">
          Read the spec
        </Link></Button>
        <Button variant="outline" asChild><Link to="/alpha/$page" params={{ page: "quick-start" }}>
          Quick Start
        </Link></Button>
      </div>
      {md ? (
        <div className="home-article">
          <Markdown source={firstSection >= 0 ? md.slice(firstSection) : md} />
        </div>
      ) : (
        <p className="mt-14 text-sm text-muted-foreground">
          The start-here guide isn&rsquo;t published yet. Read the spec in the meantime.
        </p>
      )}
    </main>
  );
}
