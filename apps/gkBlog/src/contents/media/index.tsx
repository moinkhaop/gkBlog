import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Item {
  title: string;
  description: string;
  cover_image_url: string;
  rating: number;
  rating_count: number;
  external_resources: Array<{ url: string }>;
  uuid: string;
  category: string;
}

interface MediaData {
  shelf_type: string;
  visibility: number;
  item: Item;
}

function MediaContents() {
  const [mediaData, setMediaData] = useState<MediaData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<MediaData[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("全部");

  useEffect(() => {
    // {{ AURA: Modify - 清空书影音数据，避免加载已删除的数据 }}
    setMediaData([]);
    setFilteredData([]);
    setLoading(false);
  }, []);

  const categories = [
    { label: "全部", value: "全部" },
    { label: "电影", value: "movie" },
    { label: "电视剧", value: "tv" },
    { label: "图书", value: "book" },
    { label: "音乐", value: "music" },
    { label: "游戏", value: "game" },
    { label: "播客", value: "podcast" },
  ];

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    // {{ AURA: Modify - 所有分类均为空 }}
    setFilteredData([]);
  };

  const getResourceName = (url: string) => {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace("www.", "");
    return hostname.charAt(0).toUpperCase() + hostname.slice(1);
  };

  const getShortDescription = (description: string, maxLength: number) =>
    description.length > maxLength
      ? `${description.substring(0, maxLength)}...`
      : description;

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>发生错误: {error}</div>;
  }

  return (
    <div className={clsx("content-wrapper mdx-contents")}>
      <div>
        {categories.map((cat) => (
          <button
            type="button"
            key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
            style={{
              marginRight: "10px",
              marginBottom: "8px",
              padding: "5px 10px",
              backgroundColor:
                activeCategory === cat.value ? "#007bff" : "#f0f0f0",
              color: activeCategory === cat.value ? "white" : "black",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 空状态 */}
      {filteredData.length === 0 && (
        <div
          className={clsx(
            "mt-8 rounded-lg border border-dashed p-8 text-center text-slate-600 dark:text-slate-300"
          )}
        >
          暂无书影音内容
        </div>
      )}

      {/* 保留原结构，若将来恢复数据可直接展示 */}
      <div className="movie">
        {filteredData.map((media) => (
          <div
            key={media.item.uuid}
            className="card"
            onMouseEnter={(e) => {
              const info = e.currentTarget.querySelector(
                ".movie_details"
              ) as HTMLElement;
              if (info) info.style.bottom = "0";
            }}
            onMouseLeave={(e) => {
              const info = e.currentTarget.querySelector(
                ".movie_details"
              ) as HTMLElement;
              if (info) info.style.bottom = "-400px";
            }}
          >
            <div className="poster">
              <Image
                src={`/assets/images/neodb/cover/${media.item.cover_image_url
                  .split("/")
                  .pop()}`}
                alt={media.item.title}
                width={300}
                height={150}
              />
              <div className="movie_details">
                <h2>{media.item.title}</h2>
                <p>{getShortDescription(media.item.description, 30)}</p>
                <p>
                  评分: {media.item.rating} ({media.item.rating_count} 评)
                </p>
                <div className="external-resources">
                  {media.item.external_resources.map((resource) => (
                    <a
                      key={resource.url}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "white",
                        textDecoration: "underline",
                        display: "block",
                        fontSize: "0.8em",
                      }}
                    >
                      {getResourceName(resource.url)}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MediaContents;
