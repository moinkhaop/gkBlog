import Image from "next/image";
import { useEffect, useState } from "react";
import Zoom from "react-medium-image-zoom";

interface Essay {
  id: string;
  username: string;
  time: string;
  content: string;
  avatar_url: string;
  images?: string[];
}

function EssayContents() {
  const [essays, setEssays] = useState<Essay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/assets/data/essays.json");
        if (!response.ok) throw new Error("网络错误");
        const data: Essay[] = await response.json();

        const sortedEssays = [...data].sort(
          (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
        );

        setEssays(sortedEssays);
      } catch (err) {
        setError(err instanceof Error ? err.message : "未知错误");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>加载中...</p>;
  if (error) return <p>出错了: {error}</p>;

  return (
    <div className="content-wrapper p-6">
      {/* 空状态 */}
      {essays.length === 0 && (
        <div className="mt-8 rounded-lg border border-dashed p-8 text-center text-slate-600 dark:text-slate-300">
          暂无回忆录内容
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:grid-cols-3">
        {essays.map((essay) => (
          <div
            key={essay.id}
            className="flex flex-col overflow-hidden rounded-xl bg-gray-100 transition-transform hover:-translate-y-1 dark:bg-gray-800"
          >
            <div className="flex items-center gap-4 py-3 px-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 bg-gray-200 dark:border-gray-900">
                <Image
                  src={essay.avatar_url}
                  alt={`${essay.username} 的头像`}
                  width={50}
                  height={50}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="font-bold text-gray-800 dark:text-white">
                  {essay.username}
                </h2>
                <p className="text-gray-500 text-sm dark:text-gray-400">
                  {essay.time}
                </p>
              </div>
            </div>
            <p className="text-gray-600 py-1 px-6 leading-relaxed dark:text-gray-400">
              {essay.content}
            </p>
            {essay.images && (
              <div className="py-1 px-6 flex flex-wrap gap-4">
                {(Array.isArray(essay.images)
                  ? essay.images
                  : [essay.images]
                ).map((img, imgIndex) => (
                  <Zoom key={img}>
                    <div className="w-32 h-32 relative rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105">
                      <Image
                        src={img}
                        alt={`图片 ${imgIndex + 1}`}
                        layout="fill"
                        objectFit="cover"
                        className="object-cover"
                      />
                    </div>
                  </Zoom>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EssayContents;
