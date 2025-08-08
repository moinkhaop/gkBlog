/* eslint-disable no-template-curly-in-string */
import jsonata from "jsonata";

import dayjs from "@/utils/dayjs";
import { prisma } from "@/utils/prisma";

import type { TContentActivity, TContentMeta, TReaction } from "@/types";
import type { ContentType, ReactionType, ShareType } from "@prisma/client";

const hasDb = !!process.env.DATABASE_URL && process.env.DATABASE_URL !== 'placeholder';

export const getAllContentMeta = async (): Promise<
  Record<string, TContentMeta>
> => {
  if (!hasDb) return {};
  try {
    const result = await prisma.contentMeta.findMany({
      include: {
        _count: {
          select: {
            shares: true,
            views: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return result && result.length > 0
      ? result.reduce(
        (acc, cur) => ({
          ...acc,
          [cur.slug]: {
            meta: {
              views: cur._count.views,
              shares: cur._count.shares,
            },
          },
        }),
        {} as Record<string, TContentMeta>,
      )
      : {};
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      // console.warn("getAllContentMeta prisma error:", e);
    }
    return {};
  }
};

export const getContentMeta = async (
  slug: string,
): Promise<{ shares: number; views: number }> => {
  if (!hasDb) return { shares: 0, views: 0 };
  try {
    const result = await prisma.contentMeta.findFirst({
      where: { slug },
      include: {
        _count: { select: { shares: true, views: true } },
      },
    });
    return { shares: result?._count.shares || 0, views: result?._count.views || 0 };
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      // console.warn("getContentMeta prisma error:", e);
    }
    return { shares: 0, views: 0 };
  }
};

export const getContentActivity = async (): Promise<TContentActivity[]> => {
  // last 24 hours
  const date = dayjs().subtract(24, "hours").toDate();

  if (!hasDb) return [];
  const result = await prisma.contentMeta.findMany({
    include: {
      reactions: {
        select: { type: true, count: true, createdAt: true, content: { select: { slug: true, title: true, type: true } } },
        orderBy: { createdAt: "asc" },
        where: { createdAt: { gte: date } },
        take: 5,
      },
      shares: {
        select: { type: true, createdAt: true, content: { select: { slug: true, title: true, type: true } } },
        orderBy: { createdAt: "asc" },
        where: { createdAt: { gte: date } },
        take: 5,
      },
    },
  });

  const expression = `
    $sort([
      $.reactions.{
        'activityType': 'REACTION',
        'type': type,
        'count': count,
        'createdAt': createdAt,
        'slug': content.slug,
        'contentTitle': content.title,
        'contentType': content.type
      }, 
      $.shares.{
        'activityType': 'SHARE',
        'type': type,
        'createdAt': createdAt,
        'slug': content.slug,
        'contentTitle': content.title,
        'contentType': content.type
      }
    ], function($l, $r) {
      $string($l.createdAt) < $string($r.createdAt)
    })[[0..4]]
  `;

  // transform result
  try {
    const transformed = await jsonata(expression).evaluate(result);
    return transformed || [];
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      // console.warn("getContentActivity transform error:", e);
    }
    return [];
  }
};

export const getNewPosts = async (): Promise<
  {
    slug: string;
    title: string;
    createdAt: Date;
  }[]
> => {
  // 若未配置数据库连接，直接返回空
  if (!hasDb) return [];

  // last 14 days
  const date = dayjs().subtract(14, "days").toDate();

  try {
    const result = await prisma.contentMeta.findMany({
      where: {
        type: "POST",
        AND: {
          createdAt: {
            gte: date,
          },
        },
      },
      select: {
        slug: true,
        title: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
    });

    return result;
  } catch (e) {
    // 开发环境下容错：数据库不可达时返回空数组并避免打断页面
    // eslint-disable-next-line no-console
    if (process.env.NODE_ENV !== "production") console.warn("getNewPosts prisma error:", e);
    return [];
  }
};

export const getReactions = async (slug: string): Promise<TReaction> => {
  if (!hasDb) return { CLAPPING: 0, THINKING: 0, AMAZED: 0 };
  let result: any = [];
  try {
    result = await prisma.reaction.groupBy({
      by: ["type"],
      _sum: { count: true },
      where: { content: { slug } },
    });
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      // console.warn("getReactions prisma error:", e);
    }
    return { CLAPPING: 0, THINKING: 0, AMAZED: 0 };
  }

  const expression = `$merge([
    {
      'CLAPPING': 0,
      'THINKING': 0,
      'AMAZED': 0
    },
    $.{
      type: _sum.count
    }
  ])`;

  try {
    // transform result
    const transformed = await jsonata(expression).evaluate(result);
    return transformed || { CLAPPING: 0, THINKING: 0, AMAZED: 0 };
  } catch (error) {
    // Return default values if transformation fails
    return { CLAPPING: 0, THINKING: 0, AMAZED: 0 };
  }
};

export const getSectionMeta = async (
  slug: string,
): Promise<
  Record<
    string,
    {
      reactionsDetail: TReaction;
    }
  >
> => {
  if (!hasDb) return {};
  let result: any = [];
  try {
    result = await (prisma.reaction.groupBy as any)({
      by: ["section", "type"],
      _sum: { count: true },
      where: { section: { not: null }, content: { slug } },
      orderBy: { section: "asc" },
    });
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      // console.warn("getSectionMeta prisma error:", e);
    }
    return {};
  }

  const expression = `$\
    {
      section: {
        'reactionsDetail': $merge([
          {
            'CLAPPING': 0,
            'THINKING': 0,
            'AMAZED': 0
          },
          {
            type: _sum.count
          }
        ])
      }
    }`;

  try {
    // transform result
    const transformed = await jsonata(expression).evaluate(result);
    return transformed || {};
  } catch (error) {
    // Return empty object if transformation fails
    return {};
  }
};

export const getReactionsBy = async (
  slug: string,
  sessionId: string,
): Promise<TReaction> => {
  if (!hasDb) return { CLAPPING: 0, THINKING: 0, AMAZED: 0 };
  let result: any = [];
  try {
    result = await (prisma.reaction.groupBy as any)({
      by: ["type"],
      _sum: { count: true },
      where: { sessionId, content: { slug } },
    });
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      // console.warn("getReactionsBy prisma error:", e);
    }
    return { CLAPPING: 0, THINKING: 0, AMAZED: 0 };
  }

  const expression = `$merge([
    {
      'CLAPPING': 0,
      'THINKING': 0,
      'AMAZED': 0
    },
    $.{
      type: _sum.count
    }
  ])`;

  try {
    // transform result
    const transformed = await jsonata(expression).evaluate(result);
    return transformed || { CLAPPING: 0, THINKING: 0, AMAZED: 0 };
  } catch (error) {
    // Return default values if transformation fails
    return { CLAPPING: 0, THINKING: 0, AMAZED: 0 };
  }
};

export const setReaction = async ({
  slug,
  contentType,
  contentTitle,
  count,
  section,
  sessionId,
  type,
}: {
  slug: string;
  contentType: ContentType;
  contentTitle: string;
  count: number;
  section: string;
  sessionId: string;
  type: ReactionType;
}) => {
  if (!hasDb) return null as any;
  try {
    const result = await prisma.reaction.create({
      data: {
        count,
        type,
        section,
        sessionId,
        content: {
          connectOrCreate: {
            where: { slug },
            create: { slug, type: contentType, title: contentTitle },
          },
        },
      },
    });
    return result;
  } catch (e) {
    if (process.env.NODE_ENV !== "production") console.warn("setReaction prisma error:", e);
    return null as any;
  }
};

export const getSharesBy = async (
  slug: string,
  sessionId: string,
): Promise<number> => {
  if (!hasDb) return 0;
  try {
    const result = await prisma.share.count({
      where: { sessionId, content: { slug } },
    });
    return result || 0;
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      // console.warn("getSharesBy prisma error:", e);
    }
    return 0;
  }
};

export const setShare = async ({
  slug,
  contentType,
  contentTitle,
  type,
  sessionId,
}: {
  slug: string;
  contentType: ContentType;
  contentTitle: string;
  type: ShareType;
  sessionId: string;
}) => {
  if (!hasDb) return null as any;
  try {
    const result = await prisma.share.create({
      data: {
        type,
        sessionId,
        content: {
          connectOrCreate: {
            where: { slug },
            create: { slug, type: contentType, title: contentTitle },
          },
        },
      },
    });
    return result;
  } catch (e) {
    if (process.env.NODE_ENV !== "production") console.warn("setShare prisma error:", e);
    return null as any;
  }
};

export const getViewsBy = async (
  slug: string,
  sessionId: string,
): Promise<number> => {
  if (!hasDb) return 0;
  try {
    const result = await prisma.view.count({
      where: { sessionId, content: { slug } },
    });
    return result || 0;
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      // console.warn("getViewsBy prisma error:", e);
    }
    return 0;
  }
};

export const setView = async ({
  slug,
  contentType,
  contentTitle,
  sessionId,
}: {
  slug: string;
  contentType: ContentType;
  contentTitle: string;
  sessionId: string;
}) => {
  if (!hasDb) return null as any;
  try {
    const result = await prisma.view.create({
      data: {
        sessionId,
        content: {
          connectOrCreate: {
            where: { slug },
            create: { slug, type: contentType, title: contentTitle },
          },
        },
      },
    });
    return result;
  } catch (e) {
    if (process.env.NODE_ENV !== "production") console.warn("setView prisma error:", e);
    return null as any;
  }
};
