import clsx from "clsx";
import type { GetServerSideProps } from "next";
import { useEffect, useState } from "react";

import Page from "@/contents-layouts/Page";

type ToolKey = "gpt" | "mail";

const TOOL_MAP: Record<ToolKey, { title: string; url: string }> = {
  gpt: { title: "GPT", url: "https://voapi.tuguo.me" },
  mail: { title: "临时邮箱", url: "https://ehhx.live" },
};

export const getServerSideProps: GetServerSideProps = async () => ({
  notFound: true,
});

export default function ToolsRemoved() {
  const [active, setActive] = useState<ToolKey>("gpt");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  }, [active]);

  const current = TOOL_MAP[active];

  return (
    <Page
      frontMatter={{
        title: "在线工具",
        description: "内嵌常用在线服务，免跳转更高效",
        caption: "Tools",
      }}
    >
      <div className={clsx("content-wrapper mdx-contents")}>
        {/* 工具切换 */}
        <div className={clsx("mb-4 flex flex-wrap items-center gap-2")}>
          {(Object.keys(TOOL_MAP) as ToolKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              className={clsx(
                "rounded-full border px-3 py-1 text-sm transition",
                active === key
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-300"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              )}
            >
              {TOOL_MAP[key].title}
            </button>
          ))}
          <a
            href={current.url}
            target="_blank"
            rel="noreferrer"
            className={clsx(
              "ml-auto rounded-full border px-3 py-1 text-sm hover:bg-slate-50 dark:hover:bg-slate-800",
              "border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300"
            )}
          >
            新窗口打开
          </a>
        </div>

        {/* 内嵌容器 */}
        <div
          className={clsx(
            "relative overflow-hidden rounded-xl border",
            "border-slate-200 dark:border-slate-800"
          )}
        >
          {loading && (
            <div
              className={clsx(
                "absolute inset-0 z-10 grid place-items-center bg-white/60 dark:bg-slate-900/60"
              )}
            >
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-transparent dark:border-slate-700" />
            </div>
          )}
          <iframe
            key={current.url}
            title={current.title}
            src={current.url}
            onLoad={() => setLoading(false)}
            className={clsx("h-[80vh] w-full bg-white dark:bg-slate-900")}
            loading="lazy"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* 内嵌失败提示 */}
        <p className={clsx("mt-2 text-xs text-slate-500 dark:text-slate-400")}>
          若服务不支持内嵌（站点设置了 X-Frame-Options 或
          CSP），请使用右上角“新窗口打开”。
        </p>
      </div>
    </Page>
  );
}
