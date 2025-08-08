import { Menu } from "@headlessui/react";
import { ChevronRightIcon } from "@/components/Icons";
import clsx from "clsx";
import { m } from "framer-motion";
import Link from "next/link";
import { forwardRef, useCallback, useEffect, useState } from "react";

import type { HTMLAttributes, Ref } from "react";
import type { UrlObject } from "url";

const animation = {
  hide: { opacity: 0, y: -16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18 } },
};

type LinkRefProps = HTMLAttributes<HTMLAnchorElement> & {
  href: string | UrlObject;
  // eslint-disable-next-line react/require-default-props
  onClick?: () => void;
};

const LinkRef = forwardRef(
  (
    { href, onClick, children, ...rest }: LinkRefProps,
    ref: Ref<HTMLAnchorElement>
  ) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Link href={href} ref={ref} {...rest} onClick={onClick}>
      {children}
    </Link>
  )
);

LinkRef.displayName = "LinkRef";

type NavLink = {
  href: string;
  title: string;
};

interface NavLinkDropdownProps {
  title: string;
  items: Array<NavLink>;
  onOpenClick?: () => void;
  onCloseClick?: () => void;
  onLinkClick?: () => void;
}

interface MenuContentProps {
  open: boolean;
  title: string;
  items: Array<NavLink>;
  onLinkClick?: () => void;
  handleMenuToggle: (open: boolean) => void;
}

function MenuContent({
  open,
  title,
  items,
  onLinkClick,
  handleMenuToggle,
}: MenuContentProps) {
  useEffect(() => {
    handleMenuToggle(open);
  }, [open, handleMenuToggle]);

  return (
    <div>
      <Menu.Button className={clsx("nav-link nav-link--label ml-2")}>
        {title}
        <ChevronRightIcon
          className={clsx("h-3 w-3 transition-transform duration-200", {
            "rotate-90": open,
          })}
        />
      </Menu.Button>
      {open && (
        <Menu.Items
          static
          as={m.div}
          variants={animation}
          initial="hide"
          animate="show"
          className={clsx(
            "border-divider-light absolute top-11 flex w-40 flex-col rounded-2xl border bg-white/70 p-2 backdrop-blur",
            "dark:border-divider-dark dark:bg-slate-900/80"
          )}
        >
          {items.map((item) => (
            <Menu.Item key={item.href}>
              {({ active }) => (
                <LinkRef
                  href={item.href}
                  className={clsx("nav-link h-8 text-xs", [
                    active && "nav-link--focus",
                  ])}
                  onClick={onLinkClick}
                >
                  {item.title}
                </LinkRef>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      )}
    </div>
  );
}

function NavLinkDropdown({
  title,
  items,
  onOpenClick = () => {},
  onCloseClick = () => {},
  onLinkClick = () => {},
}: NavLinkDropdownProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = useCallback(
    (open: boolean) => {
      if (open !== isMenuOpen) {
        if (open) {
          onOpenClick?.(); // 播放打开菜单声音
        } else {
          onCloseClick?.(); // 播放关闭菜单声音
        }
        setIsMenuOpen(open);
      }
    },
    [isMenuOpen, onOpenClick, onCloseClick]
  );

  return (
    <div className="relative">
      <Menu>
        {({ open }) => (
          <MenuContent
            open={open}
            title={title}
            items={items}
            onLinkClick={onLinkClick}
            handleMenuToggle={handleMenuToggle}
          />
        )}
      </Menu>
    </div>
  );
}

export default NavLinkDropdown;
