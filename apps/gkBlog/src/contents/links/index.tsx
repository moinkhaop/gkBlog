import clsx from "clsx";
import Image from "next/image";

import Code from "@/components/mdx/Code";
import TwikooComments from "@/components/TwikooComments";
import AvatarCircles from "@/components/ui/AvatarCircles";

import Disclaimer from "./Disclaimer";
import Websites from "./Websites";

function AvatarCirclesDemo() {
  return (
    <AvatarCircles
      numPeople={99}
      avatarUrls={Websites.slice(0, 10).map((site) => site.avatar)}
    />
  );
}

function GridList({
  category,
  items,
}: {
  category: string;
  items: typeof Websites;
}) {
  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-bold">{`${category} (${items.length})`}</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((site) => (
          <div key={site.name} className="relative">
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col overflow-hidden rounded-lg  bg-gray-100  dark:bg-gray-800"
            >
              {category === "推荐" && (
                <Image
                  src={site.preview}
                  alt={`${site.name} preview`}
                  width={300}
                  height={150}
                  className="h-32 w-full object-cover"
                />
              )}
              <div className="flex items-center space-x-4 p-4">
                <Image
                  src={site.avatar}
                  alt={`${site.name} avatar`}
                  width={300}
                  height={150}
                  className="h-12 w-12 rounded-full border-2 border-white dark:border-gray-800"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {site.name}
                  </h3>
                  <p
                    className="overflow-hidden text-sm text-gray-600 dark:text-gray-400"
                    style={{
                      maxHeight: "90%",
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {site.description}
                  </p>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function LinksContents() {
  const categories = ["推荐", "技术", "生活"];

  const groupedWebsites = categories.map((category) => ({
    category,
    items: Websites.filter((site) => site.category === category),
  }));

  return (
    <div className={clsx("content-wrapper")}>
      <AvatarCirclesDemo />

      {groupedWebsites.map((group) => (
        <GridList
          key={group.category}
          category={group.category}
          items={group.items}
        />
      ))}

      <h2 className="mt-12 text-xl font-bold">友链申请格式</h2>
      <div className="mt-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <p>如果您希望与我交换友链，请使用以下格式申请：</p>
        <Code language="markdown" lines={6}>
          <span className="text-gray-800 dark:text-gray-100">
            昵称（请勿包含博客等字样）：ehhx
            <br />
            网站地址（要求博客地址，请勿提交个人主页）：https://www.qladgk.com/
            <br />
            头像图片url（请提供尽可能清晰的图片，我会上传到我自己的图床）：https://qiniu.tuguo.me/2025-08/2_1754657632901.png
            <br />
            描述：一名小小的计算机爱好者
            <br />
            类型（生活类或者技术类二选一）：技术类
            <br />
            能看到友情链接的地址：https://www.qladgk.com/links
          </span>
        </Code>

        <p className="mt-4">
          发送申请至: <a href="mailto:qlad_adgk@163.com">qlad_adgk@163.com</a>{" "}
          或者在下方留言。
        </p>
      </div>

      <div className=" mdx-contents">
        <Disclaimer />
      </div>

      <TwikooComments />
    </div>
  );
}

export default LinksContents;
