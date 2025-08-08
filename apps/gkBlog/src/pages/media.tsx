import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => ({
  // {{ AURA: Modify - 移除书影音内容，直接返回 404 }}
  notFound: true,
});

export default function MediaRemoved() {
  return null;
}
