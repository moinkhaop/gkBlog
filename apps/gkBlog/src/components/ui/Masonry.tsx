import clsx from "clsx";
import type { PropsWithChildren } from "react";

interface MasonryProps {
  className?: string;
}

export default function Masonry({
  className,
  children,
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
