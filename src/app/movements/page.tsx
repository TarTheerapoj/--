"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronRight, BookOpen, CheckCircle2, List, GitBranch, ChevronDown, ChevronRight as ChevronRightIcon, Youtube, SlidersHorizontal, X, Zap, ArrowUpDown } from "lucide-react";
import {
  getAllMovements,
  CATEGORY_LABEL,
  CATEGORY_COLOR,
  DIFFICULTY_LABEL,
  type MovementCategory,
  type MovementCatalogEntry,
  type DifficultyLevel,
} from "@/lib/data/movements";
import { PathwayPreviewCard } from "@/components/movements/LearningUI";
import { RecommendationResultCard, SavedProgressPanel } from "@/components/V3Widgets";
import { SKILL_PATHWAYS } from "@/lib/pathways";

const ACCENT = "#9BEC00";

const ALL_MOVEMENTS = getAllMovements();

// Derive all unique equipment values from catalog (sorted, capped for UI)
const ALL_EQUIPMENT: string[] = [
  ...new Set(
    ALL_MOVEMENTS.flatMap(m => m.equipment)
      .filter(Boolean)
      .sort()
  ),
];

type SortOption = "default" | "name-asc" | "difficulty-asc" | "difficulty-desc" | "detail-first";

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: "default",        label: "ค่าเริ่มต้น" },
  { key: "name-asc",       label: "A → Z" },
  { key: "difficulty-asc", label: "ง่าย → ยาก" },
  { key: "difficulty-desc",label: "ยาก → ง่าย" },
  { key: "detail-first",   label: "มี Detail ก่อน" },
];

function sortMovements(list: MovementCatalogEntry[], sort: SortOption): MovementCatalogEntry[] {
  const copy = [...list];
  if (sort === "name-asc")        return copy.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "difficulty-asc")  return copy.sort((a, b) => a.difficulty - b.difficulty);
  if (sort === "difficulty-desc") return copy.sort((a, b) => b.difficulty - a.difficulty);
  if (sort === "detail-first")    return copy.sort((a, b) => {
    const aD = "shortDesc" in a && !!(a as {shortDesc?:string}).shortDesc ? 1 : 0;
    const bD = "shortDesc" in b && !!(b as {shortDesc?:string}).shortDesc ? 1 : 0;
    return bD - aD;
  });
  return copy;
}

// ── Mind Map Components ───────────────────────────────────────────────────────

function MindMapMovement({ m, catColor }: { m: MovementCatalogEntry; catColor: string }) {
  const hasDetail = "shortDesc" in m && !!(m as { shortDesc?: string }).shortDesc;
  const hasYoutube = !!(m as { youtubeId?: string }).youtubeId;
  return (
    <Link
      href={`/movements/${m.slug}`}
      className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all hover:shadow-md hover:-translate-y-0.5"
      style={{
        backgroundColor: hasDetail ? `${catColor}10` : "#f9fafb",
        borderColor: hasDetail ? `${catColor}40` : "#e5e7eb",
        color: hasDetail ? catColor : "#6b7280",
      }}
    >
      {hasDetail && <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />}
      {hasYoutube && <Youtube className="w-2.5 h-2.5 shrink-0 opacity-60" />}
      <span>{m.name}</span>
      <span
        className="text-[8px] px-1 py-0.5 rounded font-bold ml-0.5 opacity-70"
        style={{ backgroundColor: `${catColor}15` }}
      >
        {m.difficulty}
      </span>
    </Link>
  );
}

function MindMapGroup({
  groupName,
  items,
  catColor,
}: {
  groupName: string;
  items: MovementCatalogEntry[];
  catColor: string;
}) {
  const [open, setOpen] = useState(true);
  // sub-groups within this group
  const subgroupMap = useMemo(() => {
    const m = new Map<string, MovementCatalogEntry[]>();
    for (const item of items) {
      const sg = item.subgroup || "";
      if (!m.has(sg)) m.set(sg, []);
      m.get(sg)!.push(item);
    }
    return m;
  }, [items]);

  return (
    <div className="relative pl-5">
      {/* Vertical line */}
      <div className="absolute left-0 top-0 bottom-0 w-px" style={{ backgroundColor: `${catColor}25` }} />
      {/* Horizontal connector */}
      <div className="absolute left-0 top-3 w-4 h-px" style={{ backgroundColor: `${catColor}40` }} />

      {groupName ? (
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-1.5 mb-2 group/btn"
        >
          {open
            ? <ChevronDown className="w-3 h-3" style={{ color: catColor }} />
            : <ChevronRightIcon className="w-3 h-3" style={{ color: catColor }} />
          }
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: catColor }}>
            {groupName}
          </span>
          <span className="text-[9px] text-gray-400">({items.length})</span>
        </button>
      ) : null}

      {open && (
        <div className="space-y-3 pl-1">
          {[...subgroupMap.entries()].map(([sg, sgItems]) => (
            <div key={sg} className="relative pl-4">
              <div className="absolute left-0 top-0 bottom-0 w-px" style={{ backgroundColor: `${catColor}15` }} />
              <div className="absolute left-0 top-3 w-3 h-px" style={{ backgroundColor: `${catColor}25` }} />
              {sg && (
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{sg}</p>
              )}
              <div className="flex flex-wrap gap-1.5">
                {sgItems.map(m => (
                  <MindMapMovement key={m.slug} m={m} catColor={catColor} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MindMapSubcat({
  subcat,
  movements,
  catColor,
}: {
  subcat: string;
  movements: MovementCatalogEntry[];
  catColor: string;
}) {
  const [open, setOpen] = useState(true);
  const groupMap = useMemo(() => {
    const m = new Map<string, MovementCatalogEntry[]>();
    for (const item of movements) {
      const g = item.group || "";
      if (!m.has(g)) m.set(g, []);
      m.get(g)!.push(item);
    }
    return m;
  }, [movements]);

  return (
    <div className="relative pl-6">
      <div className="absolute left-0 top-0 bottom-0 w-px" style={{ backgroundColor: `${catColor}35` }} />
      <div className="absolute left-0 top-4 w-5 h-px" style={{ backgroundColor: `${catColor}50` }} />
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 mb-3 py-1.5 px-3 rounded-lg border transition-colors hover:bg-gray-50"
        style={{ borderColor: `${catColor}30`, backgroundColor: `${catColor}08` }}
      >
        {open
          ? <ChevronDown className="w-3.5 h-3.5" style={{ color: catColor }} />
          : <ChevronRightIcon className="w-3.5 h-3.5" style={{ color: catColor }} />
        }
        <span className="text-xs font-black" style={{ color: catColor }}>{subcat}</span>
        <span className="text-[10px] text-gray-400 font-medium">({movements.length})</span>
      </button>

      {open && (
        <div className="space-y-4 mb-2">
          {[...groupMap.entries()].map(([groupName, items]) => (
            <MindMapGroup
              key={groupName}
              groupName={groupName}
              items={items}
              catColor={catColor}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MindMapView({
  grouped,
  visibleCats,
}: {
  grouped: Map<MovementCategory, Map<string, MovementCatalogEntry[]>>;
  visibleCats: MovementCategory[];
}) {
  return (
    <div className="space-y-10">
      {visibleCats.map(cat => {
        const subMap = grouped.get(cat);
        if (!subMap || subMap.size === 0) return null;
        const catColor = CATEGORY_COLOR[cat];
        const totalInCat = [...subMap.values()].reduce((s, a) => s + a.length, 0);

        return (
          <section key={cat} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Category root node */}
            <div
              className="px-6 py-4 flex items-center gap-3"
              style={{ backgroundColor: `${catColor}12`, borderBottom: `2px solid ${catColor}30` }}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: catColor }} />
              <h2 className="text-base font-black" style={{ color: catColor }}>{CATEGORY_LABEL[cat]}</h2>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${catColor}20`, color: catColor }}
              >
                {totalInCat} movements
              </span>
            </div>

            {/* Tree body */}
            <div className="px-6 py-5 space-y-4">
              {[...subMap.entries()].map(([subcat, movements]) => (
                <MindMapSubcat
                  key={subcat}
                  subcat={subcat}
                  movements={movements}
                  catColor={catColor}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

const CAT_TABS: { key: "all" | MovementCategory; label: string; emoji: string }[] = [
  { key: "all",           label: "ทั้งหมด",      emoji: "🏋️" },
  { key: "weightlifting", label: "Weightlifting", emoji: "🏋️" },
  { key: "gymnastics",    label: "Gymnastics",    emoji: "🤸" },
  { key: "monostructural",label: "Monostructural",emoji: "🏃" },
];

const DIFF_COLORS: Record<DifficultyLevel, { bg: string; text: string }> = {
  1: { bg: "#f0fdf4", text: "#16a34a" },
  2: { bg: "#eff6ff", text: "#2563eb" },
  3: { bg: "#fefce8", text: "#ca8a04" },
  4: { bg: "#fff7ed", text: "#ea580c" },
  5: { bg: "#fef2f2", text: "#dc2626" },
};

function DifficultyBadge({ level }: { level: DifficultyLevel }) {
  const c = DIFF_COLORS[level];
  return (
    <span
      className="text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {DIFFICULTY_LABEL[level]}
    </span>
  );
}

function DifficultyDots({ level, color }: { level: DifficultyLevel; color: string }) {
  return (
    <div className="flex gap-0.5 items-center">
      {([1, 2, 3, 4, 5] as DifficultyLevel[]).map(i => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full transition-colors"
          style={{ backgroundColor: i <= level ? color : "#e5e7eb" }}
        />
      ))}
    </div>
  );
}

function MovementRow({ m, catColor }: { m: MovementCatalogEntry; catColor: string }) {
  const hasDetail = "shortDesc" in m && !!(m as { shortDesc?: string }).shortDesc;
  return (
    <Link
      href={`/movements/${m.slug}`}
      className="group flex items-center gap-3 px-4 py-3 bg-white hover:bg-[#f8fafb] border-b border-gray-100 last:border-0 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-800 group-hover:text-gray-950 transition-colors truncate">
            {m.name}
          </span>
          {m.subgroup && (
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap hidden sm:inline-block"
              style={{ backgroundColor: `${catColor}12`, color: catColor }}
            >
              {m.subgroup}
            </span>
          )}
          {hasDetail && (
            <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
          )}
        </div>
        {m.equipment.length > 0 && (
          <p className="text-[10px] text-gray-400 mt-0.5 truncate">
            {m.equipment.slice(0, 3).join(" · ")}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <DifficultyDots level={m.difficulty} color={catColor} />
        <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors" />
      </div>
    </Link>
  );
}

export default function MovementsPage() {
  const [activeCategory, setActiveCategory] = useState<"all" | MovementCategory>("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "mindmap">("list");
  const [filterEquipment, setFilterEquipment] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<DifficultyLevel | "all">("all");
  const [filterDetailOnly, setFilterDetailOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFilterCount = [
    filterEquipment !== "all",
    filterDifficulty !== "all",
    filterDetailOnly,
    sortBy !== "default",
  ].filter(Boolean).length;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const base = ALL_MOVEMENTS.filter(m => {
      const matchCat = activeCategory === "all" || m.category === activeCategory;
      const matchSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.subcategory.toLowerCase().includes(q) ||
        m.group.toLowerCase().includes(q) ||
        m.subgroup.toLowerCase().includes(q) ||
        m.equipment.some(e => e.toLowerCase().includes(q));
      const matchEquip =
        filterEquipment === "all" ||
        (filterEquipment === "none" ? m.equipment.length === 0 : m.equipment.includes(filterEquipment));
      const matchDiff = filterDifficulty === "all" || m.difficulty === filterDifficulty;
      const matchDetail = !filterDetailOnly ||
        ("shortDesc" in m && !!(m as {shortDesc?:string}).shortDesc);
      return matchCat && matchSearch && matchEquip && matchDiff && matchDetail;
    });
    return sortMovements(base, sortBy);
  }, [activeCategory, search, filterEquipment, filterDifficulty, filterDetailOnly, sortBy]);

  // Group: category → subcategory → movements
  const grouped = useMemo(() => {
    const map = new Map<MovementCategory, Map<string, MovementCatalogEntry[]>>();
    for (const m of filtered) {
      if (!map.has(m.category)) map.set(m.category, new Map());
      const sub = map.get(m.category)!;
      if (!sub.has(m.subcategory)) sub.set(m.subcategory, []);
      sub.get(m.subcategory)!.push(m);
    }
    return map;
  }, [filtered]);

  const CAT_ORDER: MovementCategory[] = ["weightlifting", "gymnastics", "monostructural"];
  const visibleCats = activeCategory === "all"
    ? CAT_ORDER
    : ([activeCategory] as MovementCategory[]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f6f8" }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-[#111] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: ACCENT }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: ACCENT }}>
              CrossFit Open 2026 · Thailand
            </span>
          </div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                <span style={{ color: ACCENT }}>Movement</span> Library
              </h1>
              <p className="text-white/40 text-sm mt-1.5 max-w-lg leading-relaxed">
                จาก movement library ไปสู่ guided learning system — ค้นหาท่า, เข้าใจสิ่งที่ติด, แล้วรู้ว่าควรฝึกอะไรต่อ
              </p>
              <div className="mt-4 flex gap-3 flex-wrap">
                <Link
                  href="/movements/start-here"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all hover:opacity-90"
                  style={{ backgroundColor: ACCENT, color: "#111" }}
                >
                  <Zap className="w-3.5 h-3.5" />
                  ไม่รู้จะเริ่มที่ไหน? Start Here →
                </Link>
                <Link
                  href="/pathways"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black border border-white/15 text-white hover:border-white/25 transition-all"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  ดู Skill Pathways
                </Link>
              </div>
            </div>
            <div className="flex gap-5">
              {[
                { label: "Movements",   value: ALL_MOVEMENTS.length },
                { label: "มี Detail",   value: ALL_MOVEMENTS.filter(m => "shortDesc" in m && !!(m as {shortDesc?:string}).shortDesc).length },
                { label: "Pathways",    value: SKILL_PATHWAYS.length },
              ].map(({ label, value }) => (
                <div key={label} className="text-right">
                  <p className="text-2xl font-black" style={{ color: ACCENT }}>{value}</p>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Guided Pathways</p>
            <p className="text-sm text-gray-600 mt-1">เข้า pathway ก่อน ถ้าคุณอยากรู้ว่า movement ไหนควรมาก่อนหรือมาหลัง</p>
          </div>
          <Link href="/pathways" className="text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors">
            ดูทั้งหมด →
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {SKILL_PATHWAYS.slice(0, 3).map(pathway => (
            <PathwayPreviewCard key={pathway.slug} pathway={pathway} />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-6">
          <RecommendationResultCard title="Current recommendation" />
          <SavedProgressPanel />
        </div>
      </div>

      {/* ── Sticky Filter Bar ─────────────────────────────────────────── */}
      <div className="sticky top-16 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 flex-wrap">
          {/* Category tabs */}
          <div className="flex gap-1.5 flex-wrap">
            {CAT_TABS.map(({ key, label }) => {
              const count = key === "all"
                ? ALL_MOVEMENTS.length
                : ALL_MOVEMENTS.filter(m => m.category === key).length;
              const active = activeCategory === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className="px-3 py-1.5 rounded-md text-xs font-bold transition-all"
                  style={{
                    backgroundColor: active ? ACCENT : "#f3f4f6",
                    color:           active ? "#111" : "#6b7280",
                  }}
                >
                  {label}
                  <span className="ml-1.5 opacity-60">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-gray-200 hidden sm:block" />

          {/* Search */}
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาท่า..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
            />
          </div>

          {(search || activeFilterCount > 0) && (
            <p className="text-xs text-gray-500">
              พบ <strong>{filtered.length}</strong> ท่า
            </p>
          )}

          {/* Filter toggle */}
          <button
            onClick={() => setFiltersOpen(v => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-bold transition-all border"
            style={{
              backgroundColor: filtersOpen || activeFilterCount > 0 ? ACCENT : "#f3f4f6",
              color: filtersOpen || activeFilterCount > 0 ? "#111" : "#6b7280",
              borderColor: filtersOpen || activeFilterCount > 0 ? ACCENT : "#e5e7eb",
            }}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ตัวกรอง</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#111] text-white text-[9px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* View toggle */}
          <div className="ml-auto flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all"
              style={{
                backgroundColor: viewMode === "list" ? "white" : "transparent",
                color: viewMode === "list" ? "#111" : "#9ca3af",
                boxShadow: viewMode === "list" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">รายการ</span>
            </button>
            <button
              onClick={() => setViewMode("mindmap")}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all"
              style={{
                backgroundColor: viewMode === "mindmap" ? "white" : "transparent",
                color: viewMode === "mindmap" ? "#111" : "#9ca3af",
                boxShadow: viewMode === "mindmap" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mind Map</span>
            </button>
          </div>
        </div>

        {/* ── Filter Panel ─────────────────────────────────────────── */}
        {filtersOpen && (
          <div className="border-t border-gray-100 px-4 sm:px-6 py-4 space-y-4 bg-gray-50">

            {/* Sort */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 w-16 shrink-0 flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3" /> เรียง
              </span>
              <div className="flex gap-1.5 flex-wrap">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setSortBy(opt.key)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all"
                    style={{
                      backgroundColor: sortBy === opt.key ? "#111" : "white",
                      color: sortBy === opt.key ? ACCENT : "#6b7280",
                      borderColor: sortBy === opt.key ? "#111" : "#e5e7eb",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 w-16 shrink-0">ระดับ</span>
              <div className="flex gap-1.5 flex-wrap">
                {(["all", 1, 2, 3, 4, 5] as ("all" | DifficultyLevel)[]).map(lv => (
                  <button
                    key={lv}
                    onClick={() => setFilterDifficulty(lv)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all"
                    style={{
                      backgroundColor: filterDifficulty === lv ? "#111" : "white",
                      color: filterDifficulty === lv ? ACCENT : "#6b7280",
                      borderColor: filterDifficulty === lv ? "#111" : "#e5e7eb",
                    }}
                  >
                    {lv === "all" ? "ทั้งหมด" : DIFFICULTY_LABEL[lv]}
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div className="flex items-start gap-3 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 w-16 shrink-0 mt-1">อุปกรณ์</span>
              <div className="flex gap-1.5 flex-wrap">
                {(["all", "none", ...ALL_EQUIPMENT.slice(0, 12)]).map(eq => (
                  <button
                    key={eq}
                    onClick={() => setFilterEquipment(eq)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all capitalize"
                    style={{
                      backgroundColor: filterEquipment === eq ? "#111" : "white",
                      color: filterEquipment === eq ? ACCENT : "#6b7280",
                      borderColor: filterEquipment === eq ? "#111" : "#e5e7eb",
                    }}
                  >
                    {eq === "all" ? "ทั้งหมด" : eq === "none" ? "ไม่ต้องอุปกรณ์" : eq}
                  </button>
                ))}
              </div>
            </div>

            {/* Has Detail toggle + Reset */}
            <div className="flex items-center justify-between gap-3 flex-wrap pt-1 border-t border-gray-200">
              <button
                onClick={() => setFilterDetailOnly(v => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-bold border transition-all"
                style={{
                  backgroundColor: filterDetailOnly ? "#111" : "white",
                  color: filterDetailOnly ? ACCENT : "#6b7280",
                  borderColor: filterDetailOnly ? "#111" : "#e5e7eb",
                }}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                แสดงเฉพาะท่าที่มี Coaching Detail
              </button>
              {activeFilterCount > 0 && (
                <button
                  onClick={() => {
                    setFilterEquipment("all");
                    setFilterDifficulty("all");
                    setFilterDetailOnly(false);
                    setSortBy("default");
                  }}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-red-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-3 h-3" /> รีเซ็ตตัวกรอง
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">ไม่พบ movement ที่ค้นหา</p>
          </div>
        ) : viewMode === "mindmap" ? (
          <MindMapView grouped={grouped} visibleCats={visibleCats} />
        ) : (
          visibleCats.map(cat => {
            const subMap = grouped.get(cat);
            if (!subMap || subMap.size === 0) return null;
            const catColor = CATEGORY_COLOR[cat];
            const totalInCat = [...subMap.values()].reduce((s, a) => s + a.length, 0);

            return (
              <section key={cat}>
                {/* Category header */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-1 h-7 rounded-full shrink-0"
                    style={{ backgroundColor: catColor }}
                  />
                  <h2 className="text-lg font-black text-gray-900">{CATEGORY_LABEL[cat]}</h2>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${catColor}15`, color: catColor }}
                  >
                    {totalInCat} ท่า
                  </span>
                </div>

                {/* Subcategory blocks */}
                <div className="space-y-4">
                  {[...subMap.entries()].map(([subcat, movements]) => (
                    <div key={subcat} className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                      {/* Subcategory header */}
                      <div
                        className="px-4 py-2.5 flex items-center justify-between"
                        style={{ backgroundColor: `${catColor}0a`, borderBottom: `1px solid ${catColor}20` }}
                      >
                        <span
                          className="text-xs font-black uppercase tracking-wider"
                          style={{ color: catColor }}
                        >
                          {subcat}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {movements.length} movements
                        </span>
                      </div>

                      {/* Movements grouped by group/subgroup within subcategory */}
                      {(() => {
                        // Further group by group name
                        const groupMap = new Map<string, MovementCatalogEntry[]>();
                        for (const m of movements) {
                          const g = m.group || "";
                          if (!groupMap.has(g)) groupMap.set(g, []);
                          groupMap.get(g)!.push(m);
                        }
                        return [...groupMap.entries()].map(([groupName, items]) => (
                          <div key={groupName}>
                            {groupName && (
                              <div className="px-4 py-1.5 bg-gray-50 border-b border-gray-100">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                  {groupName}
                                </span>
                              </div>
                            )}
                            <div>
                              {items.map(m => (
                                <MovementRow key={m.slug} m={m} catColor={catColor} />
                              ))}
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  ))}
                </div>
              </section>
            );
          })
        )}

        {/* Legend */}
        {!search && (
          <div className="pt-4 border-t border-gray-200 flex flex-wrap items-center gap-4">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">ระดับความยาก:</span>
            {([1, 2, 3, 4, 5] as DifficultyLevel[]).map(lv => (
              <div key={lv} className="flex items-center gap-1.5">
                <DifficultyDots level={lv} color="#6b7280" />
                <DifficultyBadge level={lv} />
              </div>
            ))}
            <div className="flex items-center gap-1 ml-4">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              <span className="text-[10px] text-gray-400">= มี coaching detail</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
