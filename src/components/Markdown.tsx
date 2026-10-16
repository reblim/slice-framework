import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import katex from "katex";
import "katex/dist/katex.min.css";
import { isValidElement, useMemo, useRef, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

function findLatexSource(children: ReactNode): string | null {
  const nodes = Array.isArray(children) ? children : [children];
  for (const node of nodes) {
    if (!isValidElement(node)) continue;
    const props = node.props as { className?: unknown; children?: ReactNode };
    if (typeof props.className === "string" && props.className.includes("language-latex")) {
      const inner = props.children;
      if (typeof inner === "string") return inner;
      if (Array.isArray(inner) && inner.every((part) => typeof part === "string")) return inner.join("");
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
  return <div className="math-display" dangerouslySetInnerHTML={{ __html: html }} />;
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
    await navigator.clipboard.writeText(ref.current?.innerText ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="code-block">
      <button type="button" onClick={copy} className="code-copy" aria-label="Copy code">
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
      <pre ref={ref}>{children}</pre>
    </div>
  );
}

export function Markdown({ source }: { source: string }) {
  return (
    <div className="prose-doc">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={{ pre: Pre }}>
        {source}
      </ReactMarkdown>
    </div>
  );
}
