import { Link } from "@tanstack/react-router";
import { HEADLINE, LEAD } from "@/config";
import { currentVersion, getDoc } from "@/lib/content";
import { Markdown } from "@/components/Markdown";
import { Button } from "@/components/ui/button";

export function Home() {
  const md = getDoc("alpha/start-here");
  const firstSection = md?.search(/^##\s/m) ?? -1;
  return (
    <main className="home-page">
      <p className="article-eyebrow">Open framework · Public alpha · v{currentVersion.id}</p>
      <h1 className="home-title">{HEADLINE}</h1>
      <p className="home-lead">{LEAD}</p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button asChild>
          <Link to="/alpha/$page" params={{ page: "quick-start" }}>
            Start in 20 minutes
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/calculator">Estimate a feature</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/spec">Read the spec</Link>
        </Button>
      </div>
      {md && firstSection >= 0 ? (
        <div className="home-article">
          <Markdown source={md.slice(firstSection)} />
        </div>
      ) : null}
    </main>
  );
}
