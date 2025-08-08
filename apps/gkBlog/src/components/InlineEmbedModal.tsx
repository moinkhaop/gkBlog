import { Dialog } from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  url: string;
  title: string;
  onClose: () => void;
};

export default function InlineEmbedModal({ open, url, title, onClose }: Props) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (open) setLoaded(false);
  }, [open, url]);

  // 指定 as="div"，避免向 Fragment 传递 data-* 等属性导致报错
  return (
    <Dialog
      as="div"
      open={open}
      onClose={onClose}
      className="relative z-[1100]"
    >
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel
            className={clsx(
              "w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl",
              "dark:border-slate-800 dark:bg-slate-900"
            )}
          >
            <div className="flex items-center justify-between border-b border-slate-200 p-3 dark:border-slate-800">
              <Dialog.Title className="text-sm font-semibold">
                {title}
              </Dialog.Title>
              <div className="flex items-center gap-2">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded bg-slate-100 px-2 py-1 text-xs hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                >
                  新窗口打开
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded bg-slate-100 px-2 py-1 text-xs hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                  aria-label="关闭"
                >
                  关闭
                </button>
              </div>
            </div>

            <div className="relative">
              {!loaded && (
                <div className="absolute inset-0 z-10 grid place-items-center bg-white/60 dark:bg-slate-900/60">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-transparent dark:border-slate-700" />
                </div>
              )}
              <iframe
                title={title}
                src={url}
                onLoad={() => setLoaded(true)}
                className="h-[75vh] w-full"
                loading="lazy"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
                referrerPolicy="no-referrer"
              />
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
