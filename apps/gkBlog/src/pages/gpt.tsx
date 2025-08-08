import Head from "next/head";
import { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/ai",
      permanent: true,
    },
  };
};

export default function RedirectGPT() {
  const title = "GPT";
  const url = "https://voapi.tuguo.me";
  const [loaded, setLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // 若 iframe 在一定时间内未触发 onLoad，大概率被目标站点的 X-Frame-Options 或 CSP 拦截
    const t = setTimeout(() => {
      if (!loaded) setShowFallback(true);
    }, 2500);
    return () => clearTimeout(t);
  }, [loaded]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      {/* 顶栏固定，内容容器添加上边距等于 h-16（4rem） */}
      <div className="w-full mt-16">
        <iframe
          title={title}
          src={url}
          className="block w-full min-h-[calc(100vh-4rem)] bg-white dark:bg-slate-900"
          loading="lazy"
          // 允许同源与脚本、弹窗、表单、模态，及用户触发的顶层导航，有助于部分站点正常工作
          sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms allow-modals allow-top-navigation-by-user-activation"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
        />

        {showFallback && !loaded && (
          <div className="mx-auto max-w-xl px-4 py-6 text-center text-sm text-slate-600 dark:text-slate-300">
            {/* 提示：可能被 X-Frame-Options 或 CSP frame-ancestors 拦截 */}
            <p className="mb-3">
              无法在本站内嵌显示该页面，可能被目标站点的安全策略拦截。
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md bg-slate-900 px-3 py-2 text-white dark:bg-slate-100 dark:text-slate-900"
            >
              在新窗口打开
            </a>
          </div>
        )}
      </div>
    </>
  );
}
