import { getNewPosts } from "@/lib/meta";

import type { TApiResponse } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | {
      slug: string;
      title: string;
      createdAt: Date;
    }[]
    | TApiResponse
  >,
) {
  try {
    if (req.method === "GET") {
      const newPosts = await getNewPosts();

      res.status(200).json(newPosts);
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    if (process.env.NODE_ENV !== "production") console.warn("/api/content/latest error:", err);
    // 本地开发降级为空数组，避免 Prisma 未配置导致的阻塞
    res.status(200).json([]);
  }
}
