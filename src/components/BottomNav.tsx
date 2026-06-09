"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./icons";
import { useFavorites } from "@/lib/useFavorites";

const tabs = [
  { href: "/", label: "Hjem", icon: Icon.Home },
  { href: "/kamper", label: "Kamper", icon: Icon.Trophy },
  { href: "/favoritter", label: "Favoritter", icon: Icon.Heart },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const { favoritesCount } = useFavorites();

  return (
    <nav className="bottom-nav" aria-label="Hovednavigasjon">
      {tabs.map((tab) => {
        const active = tab.href === "/"
          ? pathname === "/"
          : pathname.startsWith(tab.href);
        const TabIcon = tab.icon;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`bottom-nav-item ${active ? "bottom-nav-item--active" : ""}`}
          >
            <span className="bottom-nav-icon">
              <TabIcon
                size={22}
                strokeWidth={active ? 2.4 : 1.8}
                fill={tab.label === "Favoritter" && active ? "currentColor" : "none"}
              />
              {tab.label === "Favoritter" && favoritesCount > 0 && (
                <span className="bottom-nav-badge">{favoritesCount}</span>
              )}
            </span>
            <span className="bottom-nav-label">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
