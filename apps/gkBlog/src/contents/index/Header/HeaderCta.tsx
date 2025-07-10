import clsx from "clsx";
import { m, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

import { DocumentIcon } from "@/components/Icons";
import AccentDemo from "@/components/mdx/AccentDemo";

const animation = {
  hide: {
    x: -16,
    opacity: 0,
  },
  show: {
    x: 0,
    opacity: 1,
  },
};

interface ButtonContactMeProps {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function ButtonContactMe({ onMouseEnter, onMouseLeave }: ButtonContactMeProps) {
  return (
    <Link
      href="mailto:moinkhao@qq.com"
      className={clsx(
        "button button--solid min-w-[128px]",
        "shadow",
        "md:button--big",
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      联系我
    </Link>
  );
}

function ChangeColor() {
  return (
    <div>
      <button
        type="button"
        className={clsx(
          "button button--solid",
          "shadow",
          "md:button--big md:my-0 md:inline-block",
        )}
      >
        <AccentDemo />
      </button>
    </div>
  );
}

function ButtonResume() {
  return (
    <Link
      rel="noreferrer nofollow"
      href="/about-me"
      className={clsx("button button--ghost px-2", "md:button--big md:px-2")}
    >
      <DocumentIcon className={clsx("h-5 w-5")} />
      关于我
    </Link>
  );
}

function AvailableForHire() {
  return (
    <div
      className={clsx(
        "button button--ghost text-accent-500 pointer-events-none gap-2.5 px-2.5",
        "md:button--big md:px-2.5",
        "dark:text-accent-400",
      )}
    >
      <span className={clsx("relative flex h-2 w-2")}>
        <span
          className={clsx(
            "bg-accent-600 absolute -top-1 -left-1 inline-flex h-4 w-4 animate-ping rounded-full opacity-75",
            "dark:bg-accent-300",
          )}
        />
        <span
          className={clsx(
            "bg-accent-500 relative inline-flex h-2 w-2 rounded-full",
            "dark:bg-accent-400",
          )}
        />
      </span>
      当前在线
    </div>
  );
}

interface HeaderCtaProps {
  isFree?: boolean;
  isFreeAnimationDuration?: number;
}

function HeaderCta({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isFree = true,
  isFreeAnimationDuration = 4,
}: HeaderCtaProps) {
  const shouldReduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [isAvailableVisible, setIsAvailableVisible] = useState(true);

  useEffect(() => {
    setIsAvailableVisible(hovered);
  }, [hovered]);

  let isFreeVariants = {
    hide: {
      x: 0,
      opacity: 1,
    },
    show: {
      x: -48,
      opacity: 0,
    },
  };

  if (shouldReduceMotion) {
    isFreeVariants = {
      hide: {
        x: 0,
        opacity: 1,
      },
      show: {
        x: 0,
        opacity: 0,
      },
    };
  }

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <>
      <m.div className={clsx("flex gap-2")} initial="hide" animate="show">
        <m.div
          className={clsx("relative z-20")}
          variants={animation}
          transition={{ delay: 0.4 }}
        >
          <ButtonContactMe
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        </m.div>
        {isAvailableVisible ? (
          <m.div
            variants={animation}
            transition={{ delay: 2.8 }}
            className={clsx("relative z-10")}
          >
            <m.div
              variants={isFreeVariants}
              transition={{
                delay: isFreeAnimationDuration + 1.5,
                duration: 0.4,
              }}
            >
              <AvailableForHire />
            </m.div>
            <m.div
              className={clsx("absolute top-0 left-0")}
              initial={{ x: -48, opacity: 0, pointerEvents: "none" }}
              animate={{ x: 0, opacity: 1, pointerEvents: "auto" }}
              transition={{
                delay: isFreeAnimationDuration + 1.6,
                duration: 0.4,
              }}
            >
              <ButtonResume />
            </m.div>
          </m.div>
        ) : (
          <m.div
            variants={animation}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <ButtonResume />
          </m.div>
        )}
      </m.div>
      <m.div
        className={clsx("top-20 mx-0")}
        initial={{ y: 40, opacity: 0, pointerEvents: "none" }}
        animate={{ y: 10, opacity: 1, pointerEvents: "auto" }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <ChangeColor />
      </m.div>
    </>
  );
}

export default HeaderCta;
