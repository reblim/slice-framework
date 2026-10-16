import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { useRef, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

function Pre({ children }: { children?: ReactNode }) {
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
