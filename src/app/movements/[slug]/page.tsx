import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, AlertTriangle, BookOpen, Youtube, GitBranch } from "lucide-react";
import {
  MOVEMENT_CATALOG,
  MOVEMENTS,
  CATEGORY_LABEL,
  CATEGORY_COLOR,
  DIFFICULTY_LABEL,
  getMovementBySlug,
  getMovementDetail,
  type Movement,
  type DifficultyLevel,
} from "@/lib/data/movements";
import { getWorkoutsContainingMovement } from "@/lib/data/workouts";
import {
  getMovementBodyDemands,
  getResolvedUserStateGuidance,
} from "@/lib/movement-learning";
import { getPathwaysForMovement } from "@/lib/pathways";
import {
  BodyDemandBadges,
  DifficultyBandBadge,
  PathwayLadder,
} from "@/components/movements/LearningUI";
import MovementStateTabs from "@/components/movements/MovementStateTabs";
import { MovementQuickActions, ReadinessLinksPanel } from "@/components/V3Widgets";

const ACCENT = "#9BEC00";

export async function generateStaticParams() {
  const allSlugs = new Set([
    ...MOVEMENTS.map(m => m.slug),
    ...MOVEMENT_CATALOG.map(m => m.slug),
  ]);
  return [...allSlugs].map(slug => ({ slug }));
}

function DifficultyDots({ level }: { level: DifficultyLevel }) {
  return (
    <div className="flex gap-1">
      {([1, 2, 3, 4, 5] as DifficultyLevel[]).map(i => (
        <span
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: i <= level ? ACCENT : "rgba(255,255,255,0.2)" }}
        />
      ))}
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</p>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

function MovementChip({
  slug,
  role,
}: {
  slug: string;
  role: "prerequisite" | "regression" | "progression" | "related";
}) {
  const m = getMovementBySlug(slug);
  if (!m) return null;
  const colors = {
    prerequisite: { bg: "#fef9c3", text: "#854d0e", border: "#fde68a" },
    regression:   { bg: "#fee2e2", text: "#991b1b", border: "#fca5a5" },
    progression:  { bg: "#dcfce7", text: "#166534", border: "#86efac" },
    related:      { bg: "#f1f5f9", text: "#475569", border: "#cbd5e1" },
  };
  const c = colors[role];
  const detail = m as Partial<Movement>;
  return (
    <Link
      href={`/movements/${m.slug}`}
      className="group flex items-center gap-2 px-3 py-2.5 border rounded-lg transition-all hover:shadow-sm"
      style={{ backgroundColor: c.bg, borderColor: c.border }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold truncate" style={{ color: c.text }}>{m.name}</p>
        {detail.nameTH && (
          <p className="text-[9px] opacity-60 truncate" style={{ color: c.text }}>{detail.nameTH}</p>
        )}
      </div>
      <ChevronRight className="w-3 h-3 shrink-0 opacity-40" style={{ color: c.text }} />
    </Link>
  );
}

export default async function MovementDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getMovementBySlug(slug);
  if (!entry) notFound();

  const detail = getMovementDetail(slug); // full Movement or undefined (stub)
  const catColor = CATEGORY_COLOR[entry.category];
  const m = detail as Movement | undefined;
  const appearsInWorkouts = getWorkoutsContainingMovement(slug);
  const bodyDemands = getMovementBodyDemands(entry, m);
  const relatedPathways = getPathwaysForMovement(slug);
  const stateGuidance = getResolvedUserStateGuidance(entry, m);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f6f8" }}>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-[#111] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: ACCENT }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-bold uppercase tracking-widest mb-5 flex-wrap">
            <Link href="/movements" className="hover:text-white/70 transition-colors">คลังท่า</Link>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: catColor }}>{CATEGORY_LABEL[entry.category]}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/60">{entry.subcategory}</span>
            {entry.group && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-white/40">{entry.group}</span>
              </>
            )}
          </div>

          {/* Title + Thumbnail */}
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                {entry.name}
              </h1>
              {m?.nameTH && (
                <p className="text-white/35 text-sm mt-1">{m.nameTH}</p>
              )}
              <div className="mt-3">
                <DifficultyDots level={entry.difficulty} />
              </div>
            </div>

            {/* YouTube Thumbnail Card */}
            {entry.youtubeId && (
              <a
                href={`https://www.youtube.com/watch?v=${entry.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative shrink-0 rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all hover:shadow-xl"
                style={{ width: 220, minWidth: 160 }}
              >
                {/* Thumbnail image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://img.youtube.com/vi/${entry.youtubeId}/mqdefault.jpg`}
                  alt={`${entry.name} video`}
                  width={220}
                  height={124}
                  className="w-full object-cover block"
                  style={{ aspectRatio: "16/9" }}
                />
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-all">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: "#FF0000" }}
                  >
                    <Youtube className="w-5 h-5 text-white" />
                  </div>
                </div>
                {/* Label strip */}
                <div className="absolute bottom-0 left-0 right-0 px-2.5 py-1.5 bg-black/60 backdrop-blur-sm">
                  <p className="text-[10px] font-bold text-white/90 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                    ดูวิดีโอบน YouTube
                  </p>
                </div>
              </a>
            )}
          </div>

          {/* Quick info strip */}
          <div className="flex flex-wrap gap-5 mt-6">
            <div>
              <p className="text-[9px] text-white/25 uppercase tracking-widest mb-1">หมวดหมู่</p>
              <span className="text-xs font-black px-2.5 py-1 rounded"
                style={{ backgroundColor: `${catColor}25`, color: catColor }}>
                {CATEGORY_LABEL[entry.category]}
              </span>
            </div>
            <div>
              <p className="text-[9px] text-white/25 uppercase tracking-widest mb-1">ระดับ</p>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-white">{DIFFICULTY_LABEL[entry.difficulty]}</p>
                <DifficultyBandBadge level={entry.difficulty} />
              </div>
            </div>
            {m?.patterns && m.patterns.length > 0 && (
              <div>
                <p className="text-[9px] text-white/25 uppercase tracking-widest mb-1">รูปแบบ</p>
                <p className="text-xs font-bold text-white">{m.patterns.join(" · ")}</p>
              </div>
            )}
            <div>
              <p className="text-[9px] text-white/25 uppercase tracking-widest mb-1">อุปกรณ์</p>
              <p className="text-xs font-bold" style={{ color: entry.equipment.length ? "white" : ACCENT }}>
                {entry.equipment.length ? entry.equipment.join(", ") : "ไม่ต้องใช้อุปกรณ์"}
              </p>
            </div>
          </div>
          {bodyDemands.length > 0 && (
            <div className="mt-4">
              <p className="text-[9px] text-white/25 uppercase tracking-widest mb-2">ส่วนที่ใช้</p>
              <BodyDemandBadges demands={bodyDemands} />
            </div>
          )}
        </div>
      </section>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* STUB — no detailed data yet */}
        {!m && (
          <div className="max-w-3xl mx-auto py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-200 flex items-center justify-center mx-auto mb-5">
              <BookOpen className="w-6 h-6 text-gray-300" />
            </div>
            <h2 className="text-lg font-black text-gray-800 mb-2">{entry.name}</h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              ยังไม่มีรายละเอียดสำหรับท่านี้<br />
              <span className="text-gray-300">กำลังเพิ่มเร็ว ๆ นี้</span>
            </p>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-left space-y-3 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-medium">หมวดหมู่</span>
                <span className="font-bold text-gray-700">{CATEGORY_LABEL[entry.category]}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-medium">หมวดย่อย</span>
                <span className="font-bold text-gray-700">{entry.subcategory}</span>
              </div>
              {entry.group && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">กลุ่ม</span>
                  <span className="font-bold text-gray-700">{entry.group}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-medium">ระดับ</span>
                <span className="font-bold text-gray-700">{DIFFICULTY_LABEL[entry.difficulty]}</span>
              </div>
              {entry.equipment.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">อุปกรณ์</span>
                  <span className="font-bold text-gray-700">{entry.equipment.join(", ")}</span>
                </div>
              )}
            </div>
            {bodyDemands.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-left mb-6">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">ส่วนที่ใช้</p>
                <BodyDemandBadges demands={bodyDemands} />
              </div>
            )}
            {stateGuidance.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-left mb-6">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">คำแนะนำการฝึก</p>
                <MovementStateTabs items={stateGuidance} />
              </div>
            )}
            <div className="mb-6">
              <MovementQuickActions slug={slug} />
            </div>
            <div className="mb-6">
              <ReadinessLinksPanel movementSlug={slug} />
            </div>
            {/* Appears in Open Workouts (stub page) */}
            {appearsInWorkouts.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-left mb-6">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">ปรากฏใน Open Workout</p>
                <div className="space-y-2">
                  {appearsInWorkouts.map(w => (
                    <Link
                      key={w.id}
                      href="/workouts"
                      className="group flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300 transition-all"
                    >
                      <div>
                        <p className="text-xs font-bold text-gray-700">CrossFit Open {w.name}</p>
                        <p className="text-[9px] text-gray-400">{w.type} · {w.timeCapMinutes}นาที</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {relatedPathways.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-left mb-6">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">เกี่ยวข้องกับเส้นทางฝึก</p>
                <div className="space-y-4">
                  {relatedPathways.map(pathway => (
                    <div key={pathway.slug} className="rounded-lg border border-gray-200 p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <GitBranch className="w-3.5 h-3.5" style={{ color: pathway.accent }} />
                        <Link href={`/pathways/${pathway.slug}`} className="text-sm font-black hover:opacity-80" style={{ color: pathway.accent }}>
                          {pathway.title}
                        </Link>
                      </div>
                      <PathwayLadder pathway={pathway} highlightSlug={slug} compact />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Link
              href="/movements"
              className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← กลับไปคลังท่า
            </Link>
          </div>
        )}

        {/* FULL DETAIL */}
        {m && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left Column ────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-10">

              {/* Overview */}
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">ภาพรวม</p>
                  <div className="flex-1 h-px bg-gray-200 mt-1.5" />
                  {m.youtubeId && (
                    <a
                      href={`https://www.youtube.com/watch?v=${m.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold shrink-0 transition-all hover:opacity-80"
                      style={{ backgroundColor: "#FF000015", color: "#CC0000", border: "1px solid #FF000030" }}
                    >
                      <Youtube className="w-3 h-3" />
                      YouTube
                    </a>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-gray-700">{m.shortDesc}</p>
                <div className="mt-4 p-4 border-l-2 bg-gray-50 rounded-r-lg" style={{ borderColor: ACCENT }}>
                  <p className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: ACCENT }}>
                    ทำไมต้องฝึกท่านี้
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">{m.whyMatters}</p>
                </div>
              </section>

              {stateGuidance.length > 0 && (
                <section className="bg-white rounded-xl border border-gray-200 p-6">
                  <SectionHeader label="เลือกสถานะของคุณ" />
                  <MovementStateTabs items={stateGuidance} />
                </section>
              )}

              {/* Progression Chain */}
              {(m.regressions.length > 0 || m.progressions.length > 0) && (
                <section className="bg-white rounded-xl border border-gray-200 p-6">
                  <SectionHeader label="ลำดับพัฒนาท่า" />
                  <div className="flex items-stretch gap-2 overflow-x-auto pb-1">
                    {m.regressions.map((s: string) => {
                      const rm = getMovementBySlug(s);
                      return rm ? (
                        <Link key={s} href={`/movements/${s}`}
                          className="flex-1 min-w-[110px] flex flex-col items-center gap-1.5 p-3 rounded-lg border border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors text-center group">
                          <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">ก่อนหน้า</p>
                          <p className="text-xs font-semibold text-gray-500 group-hover:text-gray-800 transition-colors leading-tight">{rm.name}</p>
                        </Link>
                      ) : null;
                    })}
                    {m.regressions.length > 0 && (
                      <div className="flex items-center text-gray-300 text-base font-black self-center px-1">→</div>
                    )}
                    <div className="flex-1 min-w-[120px] flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 text-center"
                      style={{ borderColor: ACCENT, backgroundColor: `${ACCENT}10` }}>
                      <p className="text-[8px] font-black uppercase tracking-widest" style={{ color: ACCENT }}>ท่านี้</p>
                      <p className="text-xs font-bold text-gray-800 leading-tight">{m.name}</p>
                    </div>
                    {m.progressions.length > 0 && (
                      <div className="flex items-center text-gray-300 text-base font-black self-center px-1">→</div>
                    )}
                    {m.progressions.map((s: string) => {
                      const pm = getMovementBySlug(s);
                      return pm ? (
                        <Link key={s} href={`/movements/${s}`}
                          className="flex-1 min-w-[110px] flex flex-col items-center gap-1.5 p-3 rounded-lg border border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors text-center group">
                          <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">ถัดไป</p>
                          <p className="text-xs font-semibold text-gray-500 group-hover:text-gray-800 transition-colors leading-tight">{pm.name}</p>
                        </Link>
                      ) : null;
                    })}
                  </div>
                </section>
              )}

              {relatedPathways.length > 0 && (
                <section className="bg-white rounded-xl border border-gray-200 p-6">
                  <SectionHeader label="เส้นทางฝึกที่เกี่ยวข้อง" />
                  <div className="space-y-5">
                    {relatedPathways.map(pathway => (
                      <div key={pathway.slug} className="rounded-xl border border-gray-200 p-4">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <GitBranch className="w-4 h-4 shrink-0" style={{ color: pathway.accent }} />
                              <Link
                                href={`/pathways/${pathway.slug}`}
                                className="text-sm font-black hover:opacity-80"
                                style={{ color: pathway.accent }}
                              >
                                {pathway.title}
                              </Link>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">{pathway.description}</p>
                          </div>
                          <Link
                            href={`/pathways/${pathway.slug}`}
                            className="text-xs font-bold px-3 py-1.5 rounded-md border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-colors"
                          >
                            ดูเส้นทางฝึก
                          </Link>
                        </div>
                        <div className="mt-4">
                          <PathwayLadder pathway={pathway} highlightSlug={slug} compact />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Common Faults */}
              {m.faults.length > 0 && (
                <section className="bg-white rounded-xl border border-gray-200 p-6">
                  <SectionHeader label="ข้อผิดพลาดที่พบบ่อย" />
                  <ul className="space-y-3">
                    {m.faults.map((fault: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                        <span className="mt-0.5 w-5 h-5 rounded-full bg-red-50 text-red-400 text-[9px] font-black flex items-center justify-center shrink-0 border border-red-100">
                          {i + 1}
                        </span>
                        {fault}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Coaching Cues */}
              {m.cues.length > 0 && (
                <section className="bg-white rounded-xl border border-gray-200 p-6">
                  <SectionHeader label="จุดสำคัญที่ต้องโฟกัส" />
                  <ul className="space-y-3">
                    {m.cues.map((cue: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: ACCENT }} />
                        {cue}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Beginner Note + Scaling */}
              {m.beginnerNote && (
                <section className="space-y-3">
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-400 mb-1.5">ถ้ายังทำไม่ได้ — เริ่มตรงนี้</p>
                    <p className="text-sm text-blue-800 leading-relaxed">{m.beginnerNote}</p>
                  </div>
                  {m.scalingNote && (
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">ตัวเลือกการปรับ</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{m.scalingNote}</p>
                    </div>
                  )}
                </section>
              )}

              {/* Safety Note */}
              {m.safetyNote && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-amber-600 mb-1">ข้อควรระวัง</p>
                    <p className="text-sm text-amber-800 leading-relaxed">{m.safetyNote}</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right Column (sidebar) ─────────────────────────── */}
            <div className="space-y-6">
              <MovementQuickActions slug={slug} />

              <ReadinessLinksPanel movementSlug={slug} />

              {/* Requirements */}
              {(m.mobilityNeeds.length > 0 || m.strengthNeeds.length > 0) && (
                <section className="bg-white rounded-xl border border-gray-200 p-5">
                  <SectionHeader label="ความต้องการ" />
                  <div className="space-y-4">
                    {m.mobilityNeeds.length > 0 && (
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Mobility</p>
                        <div className="flex flex-wrap gap-1.5">
                          {m.mobilityNeeds.map((n: string) => (
                            <span key={n} className="text-[10px] px-2 py-0.5 bg-purple-50 text-purple-600 border border-purple-100 rounded-md font-medium">
                              {n}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {m.strengthNeeds.length > 0 && (
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Strength</p>
                        <div className="flex flex-wrap gap-1.5">
                          {m.strengthNeeds.map((n: string) => (
                            <span key={n} className="text-[10px] px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-100 rounded-md font-medium">
                              {n}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Prerequisites */}
              {m.prerequisites.length > 0 && (
                <section className="bg-white rounded-xl border border-gray-200 p-5">
                  <SectionHeader label="ท่าที่ต้องทำได้ก่อน" />
                  <div className="space-y-2">
                    {m.prerequisites.map((s: string) => (
                      <MovementChip key={s} slug={s} role="prerequisite" />
                    ))}
                  </div>
                </section>
              )}

              {/* Progressions */}
              {m.progressions.length > 0 && (
                <section className="bg-white rounded-xl border border-gray-200 p-5">
                  <SectionHeader label="ท่าถัดไปที่ควรฝึก" />
                  <div className="space-y-2">
                    {m.progressions.map((s: string) => (
                      <MovementChip key={s} slug={s} role="progression" />
                    ))}
                  </div>
                </section>
              )}

              {/* Related */}
              {m.related.length > 0 && (
                <section className="bg-white rounded-xl border border-gray-200 p-5">
                  <SectionHeader label="ท่าที่เกี่ยวข้อง" />
                  <div className="space-y-2">
                    {m.related.map((s: string) => (
                      <MovementChip key={s} slug={s} role="related" />
                    ))}
                  </div>
                </section>
              )}

              {/* Tags */}
              {m.tags.length > 0 && (
                <section className="bg-white rounded-xl border border-gray-200 p-5">
                  <SectionHeader label="แท็ก" />
                  <div className="flex flex-wrap gap-1.5">
                    {m.tags.map((tag: string) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Appears in Open Workouts */}
              {appearsInWorkouts.length > 0 && (
                <section className="bg-white rounded-xl border border-gray-200 p-5">
                  <SectionHeader label="ปรากฏใน Open Workout" />
                  <div className="space-y-2 mt-3">
                    {appearsInWorkouts.map(w => (
                      <Link
                        key={w.id}
                        href="/workouts"
                        className="group flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-black shrink-0"
                            style={{ backgroundColor: `${ACCENT}20`, color: ACCENT }}
                          >
                            {w.name}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-700 group-hover:text-gray-900 transition-colors">
                              CrossFit Open {w.name}
                            </p>
                            <p className="text-[9px] text-gray-400">{w.type} · {w.timeCapMinutes}นาที</p>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <Link
                href="/movements"
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors pt-1"
              >
                ← กลับไปคลังท่า
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
