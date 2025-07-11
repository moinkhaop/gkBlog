import { z } from "zod";

import { getSessionId } from "@/helpers/server";
import {
  getContentMeta,
  getReactions,
  getReactionsBy,
  getSectionMeta,
} from "@/lib/meta";

import type { TApiResponse, TContentMetaDetail } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TContentMetaDetail | TApiResponse>,
) {
  const slug = z.string().parse(req.query.slug);
  const sessionId = getSessionId(req);

  try {
    if (req.method === "GET") {
      const meta = await getContentMeta(slug);
      const metaSection = await getSectionMeta(slug);
      const reactionsDetail = await getReactions(slug);
      const reactionsDetailUser = await getReactionsBy(slug, sessionId);

      const reactionsSum =
        (reactionsDetail?.AMAZED || 0) +
        (reactionsDetail?.CLAPPING || 0) +
        (reactionsDetail?.THINKING || 0);

      res.status(200).json({
        meta: {
          shares: meta?.shares || 0,
          views: meta?.views || 0,
          reactions: reactionsSum,
          reactionsDetail: reactionsDetail || { CLAPPING: 0, THINKING: 0, AMAZED: 0 },
        },
        metaUser: {
          reactionsDetail: reactionsDetailUser || { CLAPPING: 0, THINKING: 0, AMAZED: 0 },
        },
        metaSection: metaSection || {},
      });
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);

    res.status(500).json({ message: "Internal Server Error" });
  }
}
