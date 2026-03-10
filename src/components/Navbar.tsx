"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, Dumbbell, BarChart3, MapPin, BookOpen, Menu, X, Sparkles, Bookmark } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard",   label: "ภาพรวม",          icon: BarChart3,  comingSoon: false },
  { href: "/workouts",    label: "เวิร์คเอาท์",       icon: Dumbbell,   comingSoon: false },
  { href: "/movements",   label: "Movements",        icon: BookOpen,   comingSoon: false },
  { href: "/recommend",   label: "แนะนำ",           icon: Sparkles,   comingSoon: false },
  { href: "/saved",       label: "ของฉัน",          icon: Bookmark,   comingSoon: false },
  { href: "/leaderboard", label: "ลีดเดอร์บอร์ด",  icon: Trophy,     comingSoon: true  },
  { href: "/provinces",   label: "จังหวัด",          icon: MapPin,     comingSoon: false },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground font-black text-sm shrink-0 group-hover:opacity-90 transition-opacity">
            LD
          </div>
          <div className="leading-tight">
            <p className="text-base font-bold text-foreground tracking-tight">ลุยดิวะ</p>
            <p className="text-[10px] text-muted-foreground -mt-0.5 font-medium tracking-widest uppercase">
              CrossFit Open Thailand
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon, comingSoon }) => (
            comingSoon ? (
              <span
                key={href}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground/50 cursor-not-allowed select-none"
                title="Coming Soon"
              >
                <Icon className="w-4 h-4" />
                {label}
                <span className="absolute -top-1 -right-1 text-[8px] font-black tracking-wide px-1 py-0.5 rounded" style={{ backgroundColor: "#9BEC00", color: "#111", lineHeight: 1 }}>SOON</span>
              </span>
            ) : (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === href || pathname.startsWith(`${href}/`)
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-black/5"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            )
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold ring-1 ring-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            CrossFit Open 2026
          </span>
          <button
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon, comingSoon }) => (
              comingSoon ? (
                <span
                  key={href}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground/50 cursor-not-allowed select-none"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  <span className="ml-auto text-[9px] font-black tracking-wide px-1.5 py-0.5 rounded" style={{ backgroundColor: "#9BEC00", color: "#111" }}>SOON</span>
                </span>
              ) : (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    pathname === href || pathname.startsWith(`${href}/`)
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-black/5"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              )
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
