"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "@/components/auth/UserMenu";

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const allLocales = ["en", "fr", "nl", "hi", "te"];
  const segments = pathname.split("/");
  const locale = allLocales.includes(segments[1]) ? segments[1] : "en";
  const basePath = locale === "en" ? "" : `/${locale}`;

  const links = [
    { href: `${basePath}/`, label: t("home") },
    { href: `${basePath}/programs`, label: t("programs") },
    { href: `${basePath}/playground`, label: t("playground") },
    { href: `${basePath}/dashboard`, label: t("dashboard") },
    { href: `${basePath}/about`, label: t("about") },
  ];

  return (
    <nav className="sticky top-0 z-50 glass">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            href={`${basePath}/`}
            className="flex items-center gap-2 font-semibold text-base"
          >
            <span className="text-xl">🎓</span>
            <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
              Open AI School
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[var(--color-primary)] ${
                  pathname === link.href
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-text-muted)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 ml-1">
              <ThemeToggle />
              <LanguageSwitcher />
              <UserMenu />
            </div>
            <Link
              href={`${basePath}/programs/ai-seeds`}
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-full text-sm font-medium hover:brightness-110 transition-all active:scale-95"
            >
              {t("getStarted")}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              className="p-2 text-[var(--color-text-muted)]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2.5 px-4 rounded-xl text-sm font-medium hover:bg-[var(--color-bg-card)] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 py-2">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
