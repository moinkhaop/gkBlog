// Packages
import clsx from "clsx";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
// Components
import Page from "@/contents-layouts/Page";
import PostPreview from "@/contents/blog/PostPreview";
// Hooks
import useContentMeta from "@/hooks/useContentMeta";
// Lib / utils
import { getPostsByTag, getSortedPosts } from "@/lib/posts";
import { buildPagination } from "@/utils/pagination";
// Types
import type { TPostFrontMatter } from "@/types";

const POSTS_PER_PAGE = 3;

type TagPageProps = {
  tag: string;
  posts: Array<{
    slug: string;
    frontMatter: TPostFrontMatter;
  }>;
};

export default function TagPage({ tag, posts }: TagPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { data } = useContentMeta();
  const router = useRouter();

  const enhancedPosts = useMemo(
    () =>
      posts.map(({ slug, frontMatter }) => {
        const { views = 0, shares = 0 } = (data && data[slug]?.meta) || {};
        return { slug, views, shares, frontMatter };
      }),
    [posts, data]
  );

  const totalPages = Math.ceil(enhancedPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = enhancedPosts.slice(
    startIndex,
    startIndex + POSTS_PER_PAGE
  );

  useEffect(() => {
    const queryPage = router.query.page;
    if (queryPage) {
      const page = parseInt(queryPage as string, 10);
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      } else {
        setCurrentPage(1);
      }
    } else {
      setCurrentPage(1);
    }
  }, [router.query.page, totalPages]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(`/blog/tag/${tag}?page=${page}`);
  };

  const renderPageButtons = () =>
    buildPagination({
      current: currentPage,
      total: totalPages,
      sibling: 1,
    }).map((token) =>
      token === "..." ? (
        <span key={`ellipsis-${Math.random().toString(36).slice(2)}`}>...</span>
      ) : (
        <button
          type="button"
          key={token}
          style={{
            padding: "0 15px",
            backgroundColor: token === currentPage ? "#3B82F6" : "#E5E7EB",
            color: token === currentPage ? "white" : "black",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onClick={() => handlePageChange(token)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#D1D5DB";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor =
              token === currentPage ? "#3B82F6" : "#E5E7EB";
          }}
        >
          {token}
        </button>
      )
    );

  return (
    <Page
      frontMatter={{
        title: `标签：${tag}`,
        description: `所有与 "${tag}" 有关的文章如下`,
        caption: "Tag",
      }}
    >
      <div className={clsx("content-wrapper")}>
        <div
          className={clsx(
            "flex flex-col gap-8",
            "md:flex-row md:gap-8 lg:gap-24"
          )}
        >
          <div className={clsx("flex-1")}>
            {currentPosts.map(({ slug, frontMatter, views, shares }) => (
              <div
                key={slug}
                className={clsx(
                  "mb-8 flex items-start gap-4",
                  "md:mb-4 md:gap-6"
                )}
              >
                <div
                  className={clsx(
                    "border-divider-light mt-14 hidden w-8 -translate-y-1 border-b",
                    "md:mt-16 md:w-20 lg:block",
                    "dark:border-divider-dark"
                  )}
                />
                <div className={clsx("flex-1")}>
                  <PostPreview
                    slug={slug}
                    category={frontMatter.category}
                    title={frontMatter.title}
                    description={frontMatter.description}
                    date={frontMatter.date}
                    lang={frontMatter.lang}
                    tags={frontMatter.tags}
                    views={views}
                    shares={shares}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <div className="flex justify-center space-x-2">
            <button
              type="button"
              className={clsx("btn rounded-md px-4 py-2", {
                "cursor-not-allowed opacity-50": currentPage === 1,
              })}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              上一页
            </button>

            {renderPageButtons()}

            <button
              type="button"
              className={clsx("btn rounded-md px-4 py-2", {
                "cursor-not-allowed opacity-50": currentPage === totalPages,
              })}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              下一页
            </button>
          </div>
          <div className="mt-2 text-sm">
            {`第 ${currentPage} 页，共 ${totalPages} 页`}
          </div>
        </div>
      </div>
    </Page>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getSortedPosts();
  const tagsArray = Array.from(
    new Set(posts.flatMap((post) => post.frontMatter.tags))
  );

  // Filter out inconsistent tag names to prevent build errors
  const filteredTags = tagsArray.filter((tag) => tag !== "Github");
  const paths = filteredTags.map((tag) => ({ params: { tag } }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const posts = getPostsByTag(params.tag as string);
  return { props: { tag: params.tag, posts } };
};
