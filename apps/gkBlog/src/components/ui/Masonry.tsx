import type { PropsWithChildren } from "react";

import clsx from "clsx";

interface MasonryProps {
  className?: string;
}

export default function Masonry({
  className = "",
  children = null,
}: PropsWithChildren<MasonryProps>) {
  return (
    <div
      className={clsx(
        "columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]",
        className
      )}
    >
      {children}
    </div>
  );
}
