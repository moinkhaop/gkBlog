import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: "/portfolio",
    permanent: true,
  },
});

export default function AlbumRedirect() {
  return null;
}
