import Link from "next/link";
import { ArrowRight, BarChart3, Dumbbell, MapPin, ChevronRight, Clock, BookOpen, Sparkles } from "lucide-react";
import { SUMMARY_STATS, WORKOUTS } from "@/lib/data/workouts";
import { RecommendationResultCard, SavedProgressPanel } from "@/components/V3Widgets";

const latest = SUMMARY_STATS.participationByYear[SUMMARY_STATS.participationByYear.length - 1];

const TICKER_ITEMS = [
  "CROSSFIT OPEN 2026 THAILAND",
  `${SUMMARY_STATS.totalAthletes} นักกีฬา · ${SUMMARY_STATS.totalAffiliates} Affiliates · 7 จังหวัด · 4 ภาค`,
  "CROSSFIT OPEN 26.1 · 26.2 · 26.3",
  "MOVEMENT LIBRARY · 127 ท่า · VIDEO PREVIEW →",
  "CROSSFIT OPEN 2026 THAILAND",
  `${SUMMARY_STATS.totalAthletes} นักกีฬา · ${SUMMARY_STATS.totalAffiliates} Affiliates · 7 จังหวัด · 4 ภาค`,
  "CROSSFIT OPEN 26.1 · 26.2 · 26.3",
  "MOVEMENT LIBRARY · 127 ท่า · VIDEO PREVIEW →",
];

const NEWS_CARDS = [
  {
    tag: "CROSSFIT OPEN 2026",
    title: "ภาพรวมการแข่งขัน CrossFit Open Thailand",
    sub: `${SUMMARY_STATS.totalAthletes} Athletes · ${SUMMARY_STATS.totalAffiliates} Affiliates · ดูสถิติ →`,
    href: "/dashboard",
    accent: true,
    comingSoon: false,
    isNew: false,
    iconBg: "#9BEC00",
    iconColor: "#111",
    iconLabel: "LIVE",
  },
  {
    tag: "WORKOUTS",
    title: "วิเคราะห์ 26.1 · 26.2 · 26.3 แบบเจาะลึก",
    sub: "Score Distribution · Rx Rankings · Thailand Stats →",
    href: "/workouts",
    accent: false,
    comingSoon: false,
    isNew: false,
    iconBg: "#111",
    iconColor: "#9BEC00",
    iconLabel: "WOD",
  },
  {
    tag: "MOVEMENT LIBRARY",
    title: "คลังท่าออกกำลังกาย 127 ท่า พร้อม Video",
    sub: "35 ท่าพร้อมรายละเอียด · YouTube Preview · CrossFit Official →",
    href: "/movements",
    accent: false,
    comingSoon: false,
    isNew: true,
    iconBg: "#111",
    iconColor: "#9BEC00",
    iconLabel: "MOV",
  },
  {
    tag: "MOVEMENT V3",
    title: "Recommendation, Saved Progress และ Readiness Checks",
    sub: "Personalized pathway · local save · coach mode →",
    href: "/recommend",
    accent: false,
    comingSoon: false,
    isNew: true,
    iconBg: "#9BEC00",
    iconColor: "#111",
    iconLabel: "V3",
  },
  {
    tag: "PROVINCES & AFFILIATES",
    title: "CrossFit Affiliates ใกล้คุณ แยกตามจังหวัด",
    sub: "24 Box · 7 จังหวัด · 4 ภาค · ค้นหา Box ใกล้คุณ →",
    href: "/provinces",
    accent: false,
    comingSoon: false,
    isNew: true,
    iconBg: "#3b82f6",
    iconColor: "#fff",
    iconLabel: "MAP",
  },
  {
    tag: "LEADERBOARD",
    title: "อันดับนักกีฬาและ Affiliates แยกตาม Division",
    sub: "MEN · WOMEN · MASTERS →",
    href: "/leaderboard",
    accent: false,
    comingSoon: true,
    isNew: false,
    iconBg: "#e8e8e8",
    iconColor: "#bbb",
    iconLabel: "",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#111] text-white overflow-x-hidden">

      {/* ─── DARK HERO ─────────────────────────────────────────── */}
      <section className="relative bg-[#111] pt-8 pb-0 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: "#9BEC00" }} />

        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] font-black tracking-[0.25em] uppercase" style={{ color: "#9BEC00" }}>The CrossFit Open 2026</span>
            <div className="h-px w-12" style={{ backgroundColor: "#9BEC00", opacity: 0.5 }} />
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-end pb-16">
            <div>
              <h1 className="text-[clamp(3.5rem,10vw,8rem)] font-black leading-[0.88] tracking-tight text-white">
                ลุย<span style={{ color: "#9BEC00" }}>ดิวะ</span>
              </h1>
              <p className="text-white/50 text-base sm:text-lg font-light mt-8 max-w-md leading-relaxed">
                วิเคราะห์ผลการแข่งขัน CrossFit Open Thailand 2026
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center gap-2 px-6 py-3 font-black text-sm tracking-widest uppercase transition-all hover:opacity-90"
                  style={{ backgroundColor: "#9BEC00", color: "#111" }}
                >
                  ดูผลการแข่งขัน
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/workouts"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-bold text-sm tracking-widest uppercase hover:border-primary hover:text-primary transition-all"
                >
                  <Dumbbell className="w-4 h-4" />
                  Workouts
                </Link>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-px bg-white/10 self-end">
              <div className="bg-[#1a1a1a] px-6 py-8">
                <p className="text-[2.5rem] font-black leading-none tabular-nums" style={{ color: "#9BEC00" }}>{SUMMARY_STATS.totalAthletes}</p>
                <p className="text-white/60 text-xs font-bold tracking-widest uppercase mt-1">Athletes</p>
              </div>
              <div className="bg-[#1a1a1a] px-6 py-8">
                <p className="text-[2.5rem] font-black leading-none tabular-nums" style={{ color: "#9BEC00" }}>{SUMMARY_STATS.totalAffiliates}</p>
                <p className="text-white/60 text-xs font-bold tracking-widest uppercase mt-1">Affiliates</p>
              </div>
              <Link href="/provinces" className="bg-[#1a1a1a] px-6 py-8 hover:bg-[#222] transition-colors block">
                <p className="text-[2.5rem] font-black leading-none tabular-nums text-white">7</p>
                <p className="text-white/60 text-xs font-bold tracking-widest uppercase mt-1">Provinces</p>
                <p className="text-[9px] font-black tracking-widest uppercase mt-1" style={{ color: "#9BEC00" }}>LIVE NOW ↗</p>
              </Link>
              <div className="bg-[#1a1a1a] px-6 py-8">
                <p className="text-lg font-black leading-none text-white/20">—</p>
                <p className="text-white/30 text-xs font-bold tracking-widest uppercase mt-1">Divisions</p>
                <p className="text-[9px] font-black tracking-widest uppercase mt-1" style={{ color: "#9BEC00", opacity: 0.6 }}>Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TICKER ─────────────────────────────────────────────── */}
      <div className="overflow-hidden py-3 select-none" style={{ backgroundColor: "#9BEC00" }}>
        <div className="flex gap-12 whitespace-nowrap" style={{ animation: "marquee 15s linear infinite" }}>
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className="text-[#111] text-xs font-black tracking-[0.2em] uppercase shrink-0">
              {item} <span className="opacity-40 mx-2">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── NEW TODAY SPOTLIGHT ─────────────────────────────────── */}
      <section className="bg-[#f4f4f4] border-b border-[#e0e0e0]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-black text-[10px] tracking-widest uppercase" style={{ backgroundColor: "#9BEC00", color: "#111" }}>
              <Sparkles className="w-3 h-3" />
              อัพเดทวันนี้
            </div>
            <div className="h-px flex-1 bg-[#ddd]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/movements" className="group flex items-center gap-4 bg-white border border-[#e8e8e8] hover:border-primary hover:shadow-sm transition-all px-5 py-4 rounded-xl">
              <div className="w-11 h-11 shrink-0 flex items-center justify-center rounded-lg" style={{ backgroundColor: "#111" }}>
                <BookOpen className="w-5 h-5" style={{ color: "#9BEC00" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-black text-[#111]">Movement Library</p>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded" style={{ backgroundColor: "#9BEC00", color: "#111" }}>NEW</span>
                </div>
                <p className="text-xs text-[#888] truncate">35 ท่าพร้อมรายละเอียด · YouTube Preview · 127 ท่าทั้งหมด</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#ccc] group-hover:text-primary shrink-0 transition-colors" />
            </Link>
            <Link href="/provinces" className="group flex items-center gap-4 bg-white border border-[#e8e8e8] hover:border-[#3b82f6] hover:shadow-sm transition-all px-5 py-4 rounded-xl">
              <div className="w-11 h-11 shrink-0 flex items-center justify-center rounded-lg" style={{ backgroundColor: "#3b82f6" }}>
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-black text-[#111]">Provinces & Affiliates</p>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded" style={{ backgroundColor: "#3b82f6", color: "#fff" }}>NEW</span>
                </div>
                <p className="text-xs text-[#888] truncate">24 Box · 7 จังหวัด · 4 ภาค · ค้นหา CrossFit ใกล้คุณ</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#ccc] group-hover:text-[#3b82f6] shrink-0 transition-colors" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── NEWS-STYLE CARDS ───────────────────────────────────── */}
      <section className="bg-[#f4f4f4] text-[#111]">
        <div className="max-w-7xl mx-auto">
          {NEWS_CARDS.map(({ tag, title, sub, href, accent, comingSoon, isNew, iconBg, iconColor, iconLabel }) => (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-6 px-6 sm:px-10 py-7 border-b border-[#ddd] transition-colors ${comingSoon ? "opacity-50 pointer-events-none" : "hover:bg-white"}`}
            >
              <div className="hidden sm:flex w-16 h-16 shrink-0 items-center justify-center font-black text-xs" style={{ backgroundColor: iconBg, color: iconColor }}>
                {comingSoon ? <Clock className="w-5 h-5" /> : href === "/workouts" ? <Dumbbell className="w-6 h-6" /> : href === "/movements" ? <BookOpen className="w-6 h-6" /> : href === "/provinces" ? <MapPin className="w-6 h-6" /> : iconLabel}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: accent && !comingSoon ? "#9BEC00" : "#999" }}>{tag}</p>
                  {isNew && <span className="text-[8px] font-black px-1.5 py-0.5 rounded" style={{ backgroundColor: "#9BEC00", color: "#111" }}>NEW</span>}
                </div>
                <p className="text-base sm:text-lg font-black leading-tight text-[#111] truncate">{title}</p>
                {comingSoon
                  ? <p className="text-xs font-black tracking-widest uppercase mt-1" style={{ color: "#9BEC00", opacity: 0.7 }}>Coming Soon · รอ Update</p>
                  : <p className="text-xs text-[#888] font-bold tracking-widest uppercase mt-1">{sub}</p>
                }
              </div>
              {!comingSoon && <ChevronRight className="w-5 h-5 text-[#bbb] group-hover:text-primary transition-colors shrink-0" />}
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#f9f9f9] border-t border-[#eee] text-[#111]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10 space-y-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: "#9BEC00" }}>Movement V3</p>
              <p className="text-sm text-[#666] mt-1">ระบบแนะนำฝึก, saved progress, และ readiness checks แบบ local-first</p>
            </div>
            <Link href="/recommend" className="text-xs font-bold text-[#888] hover:text-primary transition-colors">เปิด Recommendation Builder →</Link>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-6">
            <RecommendationResultCard title="Your current recommendation" />
            <SavedProgressPanel />
          </div>
        </div>
      </section>

      {/* ─── WORKOUT LIST ──────────────────────────────────────── */}
      <section className="bg-[#f9f9f9] border-t border-[#eee] text-[#111]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10">
          <div className="flex items-center justify-between mb-5">
            <p className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: "#9BEC00" }}>CrossFit Open 2026 · Workouts</p>
            <Link href="/workouts" className="text-xs font-bold text-[#888] hover:text-primary transition-colors">ดูทั้งหมด →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {WORKOUTS.map(w => (
              <Link key={w.id} href="/workouts"
                className="group bg-white rounded-xl border border-[#e8e8e8] p-4 hover:border-primary hover:shadow-sm transition-all flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-black text-xs"
                  style={{ backgroundColor: w.comingSoon ? "#f0f0f0" : "#9BEC00", color: w.comingSoon ? "#bbb" : "#111" }}>
                  {w.comingSoon ? <Clock className="w-4 h-4" /> : w.name}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm text-[#111]">{w.name}</p>
                  {w.comingSoon ? (
                    <p className="text-xs text-[#bbb]">รอประกาศ</p>
                  ) : (
                    <p className="text-xs text-[#888] truncate">{w.movements.slice(0, 2).join(" · ")}</p>
                  )}
                </div>
                {!w.comingSoon && (
                  <ChevronRight className="w-4 h-4 text-[#ccc] group-hover:text-primary transition-colors shrink-0" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PARTICIPATION SNAPSHOT ─────────────────────────────── */}
      <section className="bg-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] font-black tracking-[0.25em] text-white/40 uppercase mb-1">ภาพรวม · CrossFit Open Thailand</p>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">การเติบโต <span style={{ color: "#9BEC00" }}>2017–2026</span></h2>
            </div>
            <Link href="/dashboard"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 border border-white/20 text-white text-xs font-bold tracking-widest uppercase hover:border-primary hover:text-primary transition-all">
              ดูภาพรวม <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10">
            {[
              { v: `${SUMMARY_STATS.totalAthletes}`, l: "นักกีฬา 2026", accent: true },
              { v: `${latest.men}`, l: "ชาย (2026)", accent: false },
              { v: `${latest.women}`, l: "หญิง (2026)", accent: false },
              { v: `${SUMMARY_STATS.totalAffiliates}`, l: "Affiliates", accent: false },
            ].map(({ v, l, accent }) => (
              <div key={l} className="bg-[#222] px-6 py-6">
                <p className="text-3xl font-black leading-none" style={{ color: accent ? "#9BEC00" : "white" }}>{v}</p>
                <p className="text-white/40 text-xs font-bold tracking-widest uppercase mt-1">{l}</p>
              </div>
            ))}
          </div>

          {/* Men/Women bar */}
          <div className="mt-4">
            <div className="flex justify-between text-[10px] text-white/40 mb-1.5">
              <span>ชาย {Math.round((latest.men / latest.total) * 100)}%</span>
              <span>หญิง {Math.round((latest.women / latest.total) * 100)}%</span>
            </div>
            <div className="flex w-full h-2 rounded-full overflow-hidden">
              <div style={{ width: `${Math.round((latest.men / latest.total) * 100)}%`, backgroundColor: "#3b82f6" }} />
              <div style={{ width: `${Math.round((latest.women / latest.total) * 100)}%`, backgroundColor: "#f472b6" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── EXPLORE NAV STRIP ─────────────────────────────────── */}
      <section className="bg-[#f4f4f4] border-t border-[#ddd]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#ddd]">
          {[
            { href: "/dashboard",  icon: BarChart3, title: "ภาพรวม",       desc: `${SUMMARY_STATS.totalAthletes} Athletes · ${SUMMARY_STATS.totalAffiliates} Affiliates · Charts`, iconBg: "#9BEC00", iconColor: "#111",    isNew: false },
            { href: "/workouts",   icon: Dumbbell,  title: "เวิร์คเอาท์",   desc: "26.1 · 26.2 · 26.3 · Score Stats",                                                          iconBg: "#111",    iconColor: "#9BEC00", isNew: false },
            { href: "/movements",  icon: BookOpen,  title: "Movements",     desc: "127 ท่า · 35 Detail · YouTube Preview",                                                     iconBg: "#111",    iconColor: "#9BEC00", isNew: true  },
            { href: "/provinces",  icon: MapPin,    title: "จังหวัด",       desc: "24 Box · 7 จังหวัด · 4 ภาค",                                                              iconBg: "#3b82f6", iconColor: "#fff",    isNew: true  },
          ].map(({ href, icon: Icon, title, desc, iconBg, iconColor, isNew }) => (
            <Link key={href} href={href} className="group bg-[#f4f4f4] hover:bg-white px-8 py-8 flex items-start gap-4 transition-colors">
              <div className="p-2.5 transition-all shrink-0" style={{ backgroundColor: iconBg, color: iconColor }}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-black text-[#111] text-base">{title}</p>
                  {isNew && <span className="text-[8px] font-black px-1 py-0.5 rounded" style={{ backgroundColor: "#9BEC00", color: "#111" }}>NEW</span>}
                </div>
                <p className="text-xs text-[#888] font-medium mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────── */}
      <footer className="bg-[#111] border-t border-white/10 py-8 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-primary flex items-center justify-center text-[#111] font-black text-[11px]">LD</div>
            <span className="font-black text-sm text-white tracking-wide">ลุยดิวะ</span>
            <span className="text-white/30 text-xs">· CrossFit Open Thailand 2026</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-white/30 font-bold tracking-widest uppercase">
            <span>{SUMMARY_STATS.totalAthletes} Athletes</span>
            <span>{SUMMARY_STATS.totalAffiliates} Affiliates</span>
            <span>Season 2026</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
