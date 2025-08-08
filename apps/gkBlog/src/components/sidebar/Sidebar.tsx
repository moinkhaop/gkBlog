import clsx from "clsx";
import { m } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSound from "use-sound";

import useTwikoo from "@/hooks/useTwikoo";

import Card from "./Card";

interface RecentArticle {
  title: string;
  url: string;
}

interface IArticle {
  title: string;
  slug: string;
}

interface SidebarProps {
  show: string[];
}

function Sidebar({ show }: SidebarProps) {
  const imageUrl = "";
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([]);
  const [tagsWithCount, setTagsWithCount] = useState<Record<string, number>>(
    {}
  );
  const [visibleTags, setVisibleTags] = useState<string[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState<string[]>([]);

  const { recentComments, fetchRecentComments, twikooLoaded } = useTwikoo();

  useEffect(() => {
    if (twikooLoaded) {
      fetchRecentComments(3);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [twikooLoaded]);

  const fetchArticles = async () => {
    try {
      const response = await fetch("/api/content/latest"); // API 路径
      const data = await response.json();
      const articles = data.map((article: IArticle) => ({
        title: article.title,
        url: `/blog/${article.slug}`,
      }));
      setRecentArticles(articles);
    } catch (error) {
      // console.warn('Error fetching recent articles:', error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchTags = async () => {
    const response = await fetch("/api/tags");
    const data = await response.json();

    // 对 tags 按数量排序
    const sortedTags = Object.entries(data).sort(
      ([, countA], [, countB]) => Number(countB) - Number(countA)
    );

    setTagsWithCount(data); // 保存完整标签数据
    setVisibleTags(sortedTags.slice(0, 15).map(([tag]) => tag)); // 初始化只显示前 15 个
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchCategories = async () => {
    const response = await fetch("/api/categories");
    const data = await response.json();
    setVisibleCategories(Object.keys(data));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleShowMore = () => {
    setShowMore(true);
    const sortedTags = Object.entries(tagsWithCount).sort(
      ([, countA], [, countB]) => countB - countA
    );
    setVisibleTags(sortedTags.map(([tag]) => tag));
  };

  const [play] = useSound("/assets/sounds/pop_clean.flac", { preload: true }); // 替换为你的音频文件路径

  return (
    <aside
      aria-label="Sidebar with multiple sections"
      className={clsx("md:space-y-6", "space-y-2")}
    >
      {/* Render sections conditionally based on `show` prop */}
      {show.includes("categories") && (
        <>
          {/* 大屏幕：分类卡片 */}
          <Card title="文章分类" className="hidden md:block">
            <div className="flex flex-wrap gap-4">
              {visibleCategories.map((category) => (
                <a
                  key={category}
                  href={`/blog/category/${category}`}
                  className={clsx(
                    "rounded-full px-3 py-1",
                    "bg-blue-500 bg-opacity-80 text-white",
                    "transform transition-transform hover:scale-105",
                    "hover:bg-blue-600 hover:bg-opacity-90",
                    "dark:bg-blue-700 dark:bg-opacity-80 dark:hover:bg-blue-800 dark:hover:bg-opacity-90",
                    "duration-300"
                  )}
                  onMouseEnter={() => play()}
                >
                  {category}
                </a>
              ))}
            </div>
          </Card>
          {/* 小屏幕：横向滚动分类条 */}
          <div className="md:hidden scrollbar-hide w-full overflow-x-auto px-1">
            <div className="flex gap-3">
              {visibleCategories.map((category) => (
                <a
                  key={category}
                  href={`/blog/category/${category}`}
                  className={clsx(
                    "whitespace-nowrap rounded-full border border-blue-200 bg-blue-100 px-4 py-1 text-lg font-medium text-blue-700 transition hover:bg-blue-200 hover:text-blue-900",
                    "dark:border-blue-700 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 dark:hover:text-blue-100"
                  )}
                >
                  {category}
                </a>
              ))}
            </div>
          </div>
        </>
      )}

      {show.includes("tags") && (
        <Card title="文章标签" className="hidden md:block">
          <div className="relative overflow-hidden">
            <div className="flex flex-wrap space-x-4">
              {visibleTags.map((tag) => (
                <span
                  key={tag}
                  className="relative rounded-md px-2 py-1 text-blue-500 hover:bg-slate-300/50 dark:hover:bg-slate-600/50"
                >
                  <a href={`/blog/tag/${tag}`}>{tag}</a>
                  <sup className="absolute -top-0 -right-2 text-xs text-gray-400">
                    {tagsWithCount[tag]}
                  </sup>
                </span>
              ))}
            </div>

            {!showMore &&
              visibleTags.length < Object.keys(tagsWithCount).length && (
                <div className="relative -mt-8 flex justify-center">
                  <div className="pointer-events-none absolute bottom-5 left-0 right-0 h-12 bg-gradient-to-b from-transparent to-white dark:to-[#161e31]" />
                  <button
                    type="button"
                    onClick={handleShowMore}
                    className={clsx(
                      "z-10 w-full max-w-[90%] rounded-lg bg-slate-200 p-1.5 text-slate-800",
                      "hover:bg-slate-300 sm:ml-0",
                      "dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                    )}
                  >
                    查看全部
                  </button>
                </div>
              )}
          </div>
        </Card>
      )}

      {show.includes("recentArticles") && (
        <Card title="推荐文章" className="hidden md:block">
          <ul className="space-y-2">
            {recentArticles.map((article) => (
              <li key={article.url}>
                <a
                  href={article.url}
                  className="group flex items-center"
                  title={article.title}
                >
                  <span className="bg-accent-100 text-accent-900 group-hover:bg-accent-900 group-hover:text-accent-100 dark:bg-accent-800 dark:text-accent-100 dark:group-hover:bg-accent-100 dark:group-hover:text-accent-800 flex h-10 flex-shrink-0 items-center rounded-md px-1.5 text-sm font-black leading-none">
                    新🔥
                  </span>
                  <span
                    className={clsx(
                      "ml-2 min-w-0 flex-grow overflow-hidden text-ellipsis",
                      "hover:underline",
                      "whitespace-normal", // 允许换行
                      "line-clamp-2", // 限制最多显示两行
                      "text-sm" // 调整字体大小
                    )}
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                    }} // 为 line-clamp 提供支持
                  >
                    {article.title}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {show.includes("recentComments") && (
        <Card title="最近评论" className="hidden md:block">
          <ul className="space-y-2">
            {recentComments.map((comment, index) => (
              <li key={comment.id}>
                <a href={comment.url} className="group flex items-center">
                  <Image
                    src={comment.avatar || "/default-avatar.png"}
                    alt={comment.nick}
                    width={32}
                    height={32}
                    className="mr-3 h-8 w-8 rounded-full"
                  />
                  <div className="flex w-full justify-between">
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        {comment.nick}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {comment.commentText.length > 50
                          ? `${comment.commentText.slice(0, 50)}...`
                          : comment.commentText}
                      </p>
                    </div>
                    {/* 显示评论时间，格式为 MM-DD */}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(comment.created).toLocaleDateString("zh-CN", {
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </p>
                  </div>
                </a>

                {/* 仅在不是最后一条评论时显示分隔线 */}
                {index !== recentComments.length - 1 && (
                  <hr className="my-2 border-t border-dashed border-gray-200 dark:border-gray-600" />
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {show.includes("publicAccount") && (
        <Card title="订阅更新" className="hidden md:block">
          <div className="flex items-center justify-center">
            <m.img
              src={imageUrl}
              alt="Sidebar Image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-lg"
            />
          </div>
        </Card>
      )}
    </aside>
  );
}

export default Sidebar;
