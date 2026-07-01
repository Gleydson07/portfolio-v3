"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const LANGUAGE_MAP: Record<string, string> = {
  typescript: "typescript",
  javascript: "javascript",
  js: "javascript",
  bash: "bash",
  shell: "bash",
  json: "json",
  sql: "sql",
  text: "text",
};

const codeTheme = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    margin: 0,
    padding: "1.25rem",
    background: "transparent",
    overflow: "visible",
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    fontFamily: "var(--font-mono)",
    fontSize: "0.875rem",
    lineHeight: "1.625",
    background: "transparent",
  },
  span: {
    background: "transparent",
  },
};

type CodeBlockProps = {
  code: string;
  language?: string;
};

export function CodeBlock({ code, language }: CodeBlockProps) {
  const mapped = LANGUAGE_MAP[language ?? ""] ?? "javascript";
  const isPlainText = mapped === "text";

  if (isPlainText) {
    return (
      <pre className="my-8 overflow-x-auto rounded-xl border border-glass-border bg-black/40 p-5 font-mono text-sm leading-relaxed text-text-primary">
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <div className="blog-code-block my-8 overflow-x-auto rounded-xl border border-glass-border bg-black/40">
      <SyntaxHighlighter
        language={mapped}
        style={codeTheme}
        showLineNumbers={false}
        wrapLongLines={false}
        customStyle={{
          margin: 0,
          padding: "1.25rem",
          background: "transparent",
          overflowX: "auto",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
