/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";
import { useMemo } from "react";

import { BarChart } from "@/components/stats/BarChart";
import Heatmap from "@/components/stats/Heatmap";
import PieChart from "@/components/stats/PieChart";
import TagCloud from "@/components/stats/TagCloud";

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}m`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

export interface Stats {
  totalPosts: number;
  totalCategories: number;
  totalTags: number;
  totalWordCount: number;
  posts: Array<{
    date: string;
    title: string;
    wordCount: number;
  }>;
  categories: string[];
  tags: string[];
  postsByCategory: Array<{ category: string; count: number }>;
  postsByYear: Array<{ year: string; count: number }>;
}

interface StatsContentsProps {
  initialStats: Stats;
}

function StatsContents({ initialStats }: StatsContentsProps) {
  const yearProgress = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear() + 1, 0, 1);
    return (
      ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) *
      100
    ).toFixed(2);
  }, []);

  const runningTime = useMemo(() => {
    const startDate = new Date("2020-09-27");
    const now = new Date();

    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let days = now.getDate() - startDate.getDate();

    if (days < 0) {
      months -= 1;
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return { years, months, days };
  }, []);

  return (
    <div className={clsx("content-wrapper mdx-contents")}>
      {/* 发文统计 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">发文统计</h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-6">
          {/* 左侧热力图 */}
          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-200 dark:scrollbar-track-gray-800">
            <div className="w-fit">
              <Heatmap data={initialStats.posts} />
            </div>
          </div>

          {/* 右侧基础统计数据 */}
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border dark:border-gray-700 bg-card text-card-foreground shadow-sm p-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-medium">文章数</h3>
                  <p className="text-xl font-bold ml-8">
                    {formatNumber(initialStats.totalPosts)}
                  </p>
                </div>
              </div>
              <div className="rounded-lg border  dark:border-gray-700 bg-card text-card-foreground shadow-sm p-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-medium">分类数</h3>
                  <p className="text-xl font-bold ml-8">
                    {formatNumber(initialStats.totalCategories)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border dark:border-gray-700 bg-card text-card-foreground shadow-sm p-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-medium">标签数</h3>
                  <p className="text-xl font-bold ml-8">
                    {formatNumber(initialStats.totalTags)}
                  </p>
                </div>
              </div>
              <div className="rounded-lg border dark:border-gray-700 bg-card text-card-foreground shadow-sm p-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-medium">总字数</h3>
                  <p className="text-xl font-bold ml-8">
                    {formatNumber(initialStats.totalWordCount)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 状态和分类统计 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 博客状态 */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">博客状态</h2>
          <div className="blog_status space-y-2">
            <ul>
              <li>年度进度 {yearProgress}%</li>
              <li>
                博客已运行 {runningTime.years} 年 {runningTime.months} 个月
                {runningTime.days} 天
              </li>
              <li>文章总数：{initialStats.totalPosts} 篇</li>
              <li>分类总数：{initialStats.totalCategories} 个</li>
              <li>标签总数：{initialStats.totalTags} 个</li>
              <li>总字数：{initialStats.totalWordCount} 字</li>
            </ul>

            {/* 状态徽章 */}
            <div className="badge status flex flex-wrap gap-2 mt-4">
              <img
                alt="GitHub License"
                src="https://img.shields.io/github/license/ehhx/gkBlog?label=%F0%9F%93%9C%20License"
              />
              <img
                alt="Website"
                src="https://img.shields.io/website?url=https%3A%2F%2Fwww.qladgk.com%2F&up_message=%E8%BF%90%E8%A1%8C%E4%B8%AD&down_message=%E5%A4%B1%E8%B4%A5&label=%E2%9C%85%20%E7%BD%91%E7%AB%99%E6%83%85%E5%86%B5"
              />
              <img
                alt="GitHub deployments"
                src="https://img.shields.io/github/deployments/ehhx/gkBlog/Production?label=%F0%9F%9A%80%20Production"
              />
              <img
                alt="GitHub commit activity"
                src="https://img.shields.io/github/commit-activity/m/ehhx/gkBlog?label=%F0%9F%93%9D%20%E6%8F%90%E4%BA%A4%E9%A2%91%E7%8E%87"
              />
              <img
                alt="GitHub last commit"
                src="https://img.shields.io/github/last-commit/ehhx/gkBlog?label=%F0%9F%93%85%20%E6%9C%80%E8%BF%91%E6%8F%90%E4%BA%A4"
              />
              <img
                alt="GitHub Tag"
                src="https://img.shields.io/github/v/tag/ehhx/gkBlog?label=%F0%9F%94%96%20Tag"
              />
              <img
                alt="GitHub repo size"
                src="https://img.shields.io/github/repo-size/ehhx/gkBlog?label=%F0%9F%93%A6%20%E4%BB%93%E5%BA%93%E5%A4%A7%E5%B0%8F"
              />
            </div>
          </div>
        </div>

        {/* 分类统计 */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">分类统计</h2>
          <PieChart data={initialStats.postsByCategory} />
        </div>
      </div>

      {/* 年份统计 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">年份统计</h2>
        <BarChart data={initialStats.postsByYear} />
      </div>

      {/* 标签云 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">标签云</h2>
        <TagCloud tags={initialStats.tags} />
      </div>
    </div>
  );
}

export default StatsContents;
