import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import katex from "katex";
import "katex/dist/katex.min.css";
import { isValidElement, useMemo, useRef, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { useLocation } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SITE_ORIGIN } from "@/config";

function opensInNewWindow(href: string) {
  try {
    const url = new URL(href, SITE_ORIGIN);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      url.hostname !== "sliceframework.org"
    );
  } catch {
    return false;
  }
}

function collectText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(collectText).join("");
  if (isValidElement(node)) return collectText((node.props as { children?: ReactNode }).children);
  return "";
}

function tableClass(children: ReactNode): string {
  const labels: string[] = [];
  const nodes = Array.isArray(children) ? children : [children];
  for (const node of nodes) {
    if (!isValidElement(node) || node.type !== "thead") continue;
    const rows = (node.props as { children?: ReactNode }).children;
    for (const row of Array.isArray(rows) ? rows : [rows]) {
      if (!isValidElement(row)) continue;
      const cells = (row.props as { children?: ReactNode }).children;
      for (const cell of Array.isArray(cells) ? cells : [cells])
        labels.push(collectText(cell).trim());
    }
  }
  if (labels[0] === "#") return "table-decisions";
  if (labels[0] === "Version" && labels[1] === "Status" && labels[2] === "Author")
    return "table-versions";
  return "";
}

function Table({ children }: { children?: ReactNode }) {
  return (
    <div className="table-scroll" tabIndex={0}>
      <table className={tableClass(children)}>{children}</table>
    </div>
  );
}

function findLatexSource(children: ReactNode): string | null {
  const nodes = Array.isArray(children) ? children : [children];
  for (const node of nodes) {
    if (!isValidElement(node)) continue;
    const props = node.props as { className?: unknown; children?: ReactNode };
    if (typeof props.className === "string" && props.className.includes("language-latex")) {
      const inner = props.children;
      if (typeof inner === "string") return inner;
      if (Array.isArray(inner) && inner.every((part) => typeof part === "string"))
        return inner.join("");
      return null;
    }
  }
  return null;
}

function MathDisplay({ source }: { source: string }) {
  const html = useMemo(
    () => katex.renderToString(source, { displayMode: true, throwOnError: false, strict: false }),
    [source],
  );
  return <div className="math-display" tabIndex={0} dangerouslySetInnerHTML={{ __html: html }} />;
}

function Pre({ children }: { children?: ReactNode }) {
  const latex = findLatexSource(children);
  if (latex !== null) return <MathDisplay source={latex} />;
  return <CodeBlock children={children} />;
}

function CodeBlock({ children }: { children?: ReactNode }) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ref.current?.innerText ?? "");
    } catch {
      if (ref.current) {
        const range = document.createRange();
        range.selectNodeContents(ref.current);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="code-block">
      <div className="code-header">
        <span>
          {Array.isArray(children)
            ? ""
            : isValidElement(children)
              ? ((children.props as { className?: string }).className?.replace("language-", "") ??
                "text")
              : "text"}
        </span>
        <div className="flex items-center gap-2">
          <span role="status">{copied ? "Copied" : ""}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={copy}
            className="code-copy"
            aria-label="Copy code"
            title="Copy code"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </Button>
        </div>
      </div>
      <pre ref={ref} tabIndex={0}>
        {children}
      </pre>
    </div>
  );
}

export function Markdown({ source }: { source: string }) {
  const { pathname } = useLocation();
  const eyebrow = pathname.startsWith("/spec")
    ? "SPECIFICATION"
    : pathname.startsWith("/research")
      ? "RESEARCH"
      : pathname === "/changelog" || pathname === "/decisions"
        ? "HISTORY"
        : "ALPHA KIT";
  return (
    <div className="prose-doc">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          pre: Pre,
          h1: ({ children, ...props }) => (
            <>
              <p className="article-eyebrow">{eyebrow}</p>
              <h1 {...props}>{children}</h1>
            </>
          ),
          a: ({ href, children, ...props }) =>
            href && opensInNewWindow(href) ? (
              <a href={href} {...props} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ) : (
              <a href={href} {...props}>
                {children}
              </a>
            ),
          table: Table,
          blockquote: ({ children }) => (
            <blockquote className="article-callout">{children}</blockquote>
          ),
          strong: ({ children }) => (
            <strong
              className={
                typeof children === "string" && /^(Public alpha|Archived version)\.$/.test(children)
                  ? "callout-label"
                  : undefined
              }
            >
              {children}
            </strong>
          ),
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
