import Head from "next/head";
import { useEffect, useState } from "react";

export default function MailPage() {
  const title = "临时邮箱";
  const url = "https://ehhx.live";
  const [loaded, setLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!loaded) setShowFallback(true);
    }, 2500);
    return () => clearTimeout(t);
  }, [loaded]);

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="w-full mt-16">
        <iframe
          title={title}
          src={url}
          className="block w-full min-h-[calc(100vh-4rem)] bg-white dark:bg-slate-900"
          loading="lazy"
          sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms allow-modals allow-top-navigation-by-user-activation"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
        />

        {showFallback && !loaded && (
          <div className="mx-auto max-w-xl px-4 py-6 text-center text-sm text-slate-600 dark:text-slate-300">
            <p className="mb-3">
              对方站点当前返回错误或禁止内嵌，已无法在本站显示。
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
    </div>
  );
}
