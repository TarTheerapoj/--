"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ImageIcon, ExternalLink, GitBranch } from "lucide-react";
import { WORKOUTS, type WorkoutDivision } from "@/lib/data/workouts";
import { useRankingsData, type RankingEntry, type RankingEntry26_2 } from "@/hooks/useRankingsData";
import { cn } from "@/lib/utils";
import { getPathwayBySlug } from "@/lib/pathways";
import { MovementSlugLinks } from "@/components/movements/LearningUI";
import { ReadinessLinksPanel } from "@/components/V3Widgets";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const DIVISION_COLORS: Record<WorkoutDivision["name"], { bg: string; text: string; border: string }> = {
  Rx:          { bg: "#9BEC00", text: "#111", border: "#9BEC00" },
  Scaled:      { bg: "#111",    text: "#9BEC00", border: "#333" },
  Foundations: { bg: "#3b82f6", text: "#fff", border: "#3b82f6" },
};

type GenderFilter = "all" | "men" | "women";

const GENDER_FILTERS: { key: GenderFilter; label: string; color: string; text: string }[] = [
  { key: "all",   label: "ทั้งหมด", color: "#9BEC00", text: "#111" },
  { key: "men",   label: "ชาย ♂",  color: "#3b82f6", text: "#fff" },
  { key: "women", label: "หญิง ♀", color: "#f472b6", text: "#fff" },
];

const BIN_SIZE = 20;

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function buildSharedBins(menReps: number[], womenReps: number[], gender: GenderFilter) {
  const all = [...menReps, ...womenReps];
  if (!all.length) return [];
  const globalMin = Math.floor(Math.min(...all) / BIN_SIZE) * BIN_SIZE;
  const globalMax = Math.ceil(Math.max(...all) / BIN_SIZE) * BIN_SIZE;
  const bins = [];
  for (let start = globalMin; start < globalMax; start += BIN_SIZE) {
    const label = `${start}`;
    bins.push({
      label,
      ชาย: gender !== "women" ? menReps.filter(r => r >= start && r < start + BIN_SIZE).length : undefined,
      หญิง: gender !== "men" ? womenReps.filter(r => r >= start && r < start + BIN_SIZE).length : undefined,
    });
  }
  return bins;
}

function ScoreDistributionChart({
  menReps, womenReps, gender, workoutId,
}: {
  menReps: number[];
  womenReps: number[];
  gender: GenderFilter;
  workoutId?: string;
}) {
  const bins = useMemo(
    () => buildSharedBins(menReps, womenReps, gender),
    [menReps, womenReps, gender]
  );

  if (!bins.length) return (
    <div className="flex items-center justify-center h-36 text-xs text-muted-foreground">
      ยังไม่มีข้อมูล
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={bins} barGap={2} barCategoryGap="20%"
        margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: "#888" }}
          axisLine={false}
          tickLine={false}
          label={{ 
            value: workoutId === "26.2" ? "seconds" : "reps", 
            position: "insideBottom", 
            offset: -2, 
            fontSize: 10, 
            fill: "#aaa" 
          }}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#888" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-card, #fff)",
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: 8,
            fontSize: 12,
          }}
          cursor={{ fill: "rgba(0,0,0,0.04)" }}
          formatter={(value, name) => [`${value ?? 0} คน`, name as string]}
          labelFormatter={(label) => {
            const unit = workoutId === "26.2" ? "seconds" : "reps";
            return `${label}–${Number(label) + BIN_SIZE - 1} ${unit}`;
          }}
        />
        {gender !== "women" && (
          <Bar dataKey="ชาย" fill="#3b82f6" radius={[3, 3, 0, 0]} maxBarSize={28} />
        )}
        {gender !== "men" && (
          <Bar dataKey="หญิง" fill="#f472b6" radius={[3, 3, 0, 0]} maxBarSize={28} />
        )}
        {gender === "all" && <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />}
      </BarChart>
    </ResponsiveContainer>
  );
}

function RxStatsBar({ label, value, color, sub }: { label: string; value: string; color: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-border/50 p-4 space-y-1">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black" style={{ color }}>{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

// ── Parse helpers for 26.2 ──────────────────────────────────────────
function parseScore262(score: string): { type: "finished" | "timed_out" | "none"; value: number } {
  if (!score || score === "(--)" || score === "--") return { type: "none", value: 0 };
  // finished: (8:57) or (8:57 - s) etc — has M:SS pattern
  const timeMatch = score.match(/\((\d+):(\d+)/);
  if (timeMatch) return { type: "finished", value: Number(timeMatch[1]) * 60 + Number(timeMatch[2]) };
  // timed out: (128 reps) or (128 reps - s) etc
  const repsMatch = score.match(/\((\d+) reps/);
  if (repsMatch) return { type: "timed_out", value: Number(repsMatch[1]) };
  return { type: "none", value: 0 };
}

function WorkoutStats({ workout }: { workout: typeof WORKOUTS[0] }) {
  const [gender, setGender] = useState<GenderFilter>("all");
  const { data: raw, loading } = useRankingsData(workout.id as "26.1" | "26.2");

  // ── 26.1 stats (reps) ──────────────────────────────────────────────
  const stats261 = useMemo(() => {
    if (workout.id !== "26.1") return null;
    const isValid = (reps: string, div: string) =>
      reps && reps !== "0" && reps !== "Null" && div && div !== "-";
    const rankingRows = raw as RankingEntry[];
    const menReps = rankingRows
      .filter(r => isValid(r["Reps Men"], r["Division Men"]) && r["Division Men"] === "RX")
      .map(r => Number(r["Reps Men"]));
    const womenReps = rankingRows
      .filter(r => isValid(r["Reps Women"], r["Division Women"]) && r["Division Women"] === "RX")
      .map(r => Number(r["Reps Women"]));
    const avg = (arr: number[]) =>
      arr.length ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length) : 0;
    return {
      men:   { count: menReps.length,   avg: avg(menReps),   top: Math.max(0, ...menReps)   },
      women: { count: womenReps.length, avg: avg(womenReps), top: Math.max(0, ...womenReps) },
      menReps,
      womenReps,
    };
  }, [raw, workout.id]);

  // ── 26.2 stats (time + reps separated) ────────────────────────────
  const stats262 = useMemo(() => {
    if (workout.id !== "26.2") return null;
    const avg = (arr: number[]) =>
      arr.length ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length) : 0;

    const rankingRows = raw as RankingEntry26_2[];
    const parseGroup = (
      scoreKey: "Score Men" | "Score Women",
      divKey: "Division Men" | "Division Women"
    ) => {
      const rxRows = rankingRows.filter(row => {
        const score = row[scoreKey];
        return row[divKey] === "RX" && score && score !== "(--)" && score !== "--";
      });
      const finished = rxRows.flatMap(row => {
        const parsed = parseScore262(row[scoreKey]);
        return parsed.type === "finished" ? [parsed.value] : [];
      });
      const timedOut = rxRows.flatMap(row => {
        const parsed = parseScore262(row[scoreKey]);
        return parsed.type === "timed_out" ? [parsed.value] : [];
      });
      return {
        finishedCount: finished.length,
        timedOutCount: timedOut.length,
        totalRx: rxRows.length,
        fastestSec: finished.length ? Math.min(...finished) : 0,
        avgTimeSec: avg(finished),
        avgReps: avg(timedOut),
        topReps: timedOut.length ? Math.max(...timedOut) : 0,
        repsArr: timedOut,
      };
    };

    return {
      men:   parseGroup("Score Men",   "Division Men"),
      women: parseGroup("Score Women", "Division Women"),
    };
  }, [raw, workout.id]);

  const hasData = workout.id === "26.1" || workout.id === "26.2";
  const showMen   = gender !== "women";
  const showWomen = gender !== "men";

  if (!hasData) {
    return (
      <div className="rounded-xl border border-dashed border-border/40 bg-secondary/20 px-6 py-8 flex flex-col items-center gap-3 text-center">
        <div className="w-10 h-10 rounded-full border border-border/30 flex items-center justify-center">
          <Clock className="w-5 h-5 text-muted-foreground/40" />
        </div>
        <div>
          <p className="text-sm font-black text-muted-foreground/50 uppercase tracking-widest">รอ Update คะแนน</p>
          <p className="text-xs text-muted-foreground/40 mt-1">ข้อมูลสถิติ RX จะแสดงหลังจากปิดรับคะแนน</p>
        </div>
        <div className="flex gap-4 mt-1">
          {[
            { label: "ค่าเฉลี่ย ชาย", color: "#3b82f6" },
            { label: "สูงสุด ชาย",    color: "#3b82f6" },
            { label: "ค่าเฉลี่ย หญิง", color: "#f472b6" },
            { label: "สูงสุด หญิง",   color: "#f472b6" },
          ].map(({ label }) => (
            <div key={label} className="rounded-lg border border-border/30 bg-secondary/30 px-4 py-3 text-center min-w-[80px]">
              <p className="text-[9px] text-muted-foreground/40 uppercase tracking-widest mb-1">{label}</p>
              <p className="text-xl font-black text-muted-foreground/20">—</p>
              <p className="text-[9px] text-muted-foreground/30 mt-0.5">reps</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Section header + filter */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs font-black text-foreground/50 uppercase tracking-widest">
            สถิติ RX · Thailand {workout.name}
          </p>
          {!loading && stats261 && (
            <p className="text-[10px] text-muted-foreground mt-0.5">
              ชาย {stats261.men.count} คน · หญิง {stats261.women.count} คน
            </p>
          )}
          {!loading && stats262 && (
            <p className="text-[10px] text-muted-foreground mt-0.5">
              ชาย {stats262.men.totalRx} คน · หญิง {stats262.women.totalRx} คน
            </p>
          )}
        </div>
        <div className="flex gap-1.5">
          {GENDER_FILTERS.map(f => (
            <button key={f.key} onClick={() => setGender(f.key)}
              className="px-3 py-1 rounded text-xs font-bold transition-all"
              style={{
                backgroundColor: gender === f.key ? f.color : "transparent",
                color: gender === f.key ? f.text : "#888",
                border: `1.5px solid ${gender === f.key ? f.color : "#ccc"}`,
              }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-8 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">กำลังโหลดข้อมูล...</p>
        </div>
      ) : stats261 ? (
        <>
          {/* 26.1: simple reps stat cards */}
          <div className={cn("grid gap-3", showMen && showWomen ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2")}>
            {showMen && <>
              <RxStatsBar label="ค่าเฉลี่ย ชาย" value={`${stats261.men.avg}`} color="#3b82f6" sub="reps" />
              <RxStatsBar label="สูงสุด ชาย"   value={`${stats261.men.top}`} color="#3b82f6" sub="reps" />
            </>}
            {showWomen && <>
              <RxStatsBar label="ค่าเฉลี่ย หญิง" value={`${stats261.women.avg}`} color="#f472b6" sub="reps" />
              <RxStatsBar label="สูงสุด หญิง"   value={`${stats261.women.top}`} color="#f472b6" sub="reps" />
            </>}
          </div>
          <div className="rounded-xl border border-border/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">การกระจายคะแนน · Rx</p>
              <div className="flex gap-3">
                {showMen   && <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-blue-500" />ชาย</span>}
                {showWomen && <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-pink-400" />หญิง</span>}
              </div>
            </div>
            <ScoreDistributionChart menReps={stats261.menReps} womenReps={stats261.womenReps} gender={gender} />
          </div>
        </>
      ) : stats262 ? (
        <>
          {/* 26.2: Finished vs Timed Out breakdown */}
          {(showMen || showWomen) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {showMen && (
                <div className="rounded-xl border border-border/50 p-4 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">ชาย ♂ · RX</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-secondary/50 p-3 text-center">
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">จบทัน</p>
                      <p className="text-xl font-black text-blue-500">{stats262.men.finishedCount}</p>
                      <p className="text-[9px] text-muted-foreground">คน</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3 text-center">
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">ไม่จบ</p>
                      <p className="text-xl font-black text-orange-400">{stats262.men.timedOutCount}</p>
                      <p className="text-[9px] text-muted-foreground">คน</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3 text-center">
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">เร็วสุด</p>
                      <p className="text-lg font-black text-blue-500">{stats262.men.fastestSec ? formatTime(stats262.men.fastestSec) : "—"}</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3 text-center">
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">เฉลี่ย reps</p>
                      <p className="text-lg font-black text-orange-400">{stats262.men.avgReps || "—"}</p>
                      <p className="text-[9px] text-muted-foreground">reps</p>
                    </div>
                  </div>
                </div>
              )}
              {showWomen && (
                <div className="rounded-xl border border-border/50 p-4 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-pink-400">หญิง ♀ · RX</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-secondary/50 p-3 text-center">
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">จบทัน</p>
                      <p className="text-xl font-black text-pink-400">{stats262.women.finishedCount}</p>
                      <p className="text-[9px] text-muted-foreground">คน</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3 text-center">
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">ไม่จบ</p>
                      <p className="text-xl font-black text-orange-400">{stats262.women.timedOutCount}</p>
                      <p className="text-[9px] text-muted-foreground">คน</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3 text-center">
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">เร็วสุด</p>
                      <p className="text-lg font-black text-pink-400">{stats262.women.fastestSec ? formatTime(stats262.women.fastestSec) : "—"}</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3 text-center">
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">เฉลี่ย reps</p>
                      <p className="text-lg font-black text-orange-400">{stats262.women.avgReps || "—"}</p>
                      <p className="text-[9px] text-muted-foreground">reps</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chart: reps distribution for timed-out athletes only */}
          <div className="rounded-xl border border-border/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">การกระจาย reps · Rx (ไม่จบ)</p>
                <p className="text-[9px] text-muted-foreground mt-0.5">เฉพาะนักกีฬาที่ไม่จบทัน Time Cap</p>
              </div>
              <div className="flex gap-3">
                {showMen   && <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-blue-500" />ชาย</span>}
                {showWomen && <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-pink-400" />หญิง</span>}
              </div>
            </div>
            <ScoreDistributionChart
              menReps={showMen ? stats262.men.repsArr : []}
              womenReps={showWomen ? stats262.women.repsArr : []}
              gender={gender}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}

function MovementBadge({ name, slug }: { name: string; slug?: string }) {
  if (slug) {
    return (
      <a
        href={`/movements/${slug}`}
        className="inline-flex items-center gap-1.5 text-xs rounded-full px-3 py-1 font-bold transition-all hover:opacity-90 hover:shadow-md"
        style={{ backgroundColor: "#9BEC00", color: "#111" }}
      >
        {name}
        <ExternalLink className="w-2.5 h-2.5 opacity-60 shrink-0" />
      </a>
    );
  }
  return (
    <Badge variant="outline" className="text-xs border-border/50 text-muted-foreground">{name}</Badge>
  );
}

function WorkoutReadinessPanel({ workout }: { workout: typeof WORKOUTS[0] }) {
  if (!workout.readiness) return null;

  const relatedPathways = workout.readiness.pathwaySlugs
    .map(slug => getPathwayBySlug(slug))
    .filter((pathway): pathway is NonNullable<ReturnType<typeof getPathwayBySlug>> => !!pathway);

  return (
    <div className="rounded-xl border border-border/50 p-5 space-y-5">
      <div className="flex items-center gap-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Workout Readiness</p>
        <div className="flex-1 h-px bg-border/50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Key skill demands</p>
          <div className="flex flex-wrap gap-1.5">
            {workout.readiness.keyDemands.map(demand => (
              <span key={demand} className="text-[10px] px-2 py-1 rounded-md bg-secondary/60 text-foreground/70 border border-border/40 font-bold">
                {demand}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Where athletes get stuck</p>
          <ul className="space-y-2">
            {workout.readiness.commonStickingPoints.map(point => (
              <li key={point} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">If you are blocked here, train this first</p>
          <MovementSlugLinks slugs={workout.readiness.trainFirstMovementSlugs} />
        </div>
      </div>

      {relatedPathways.length > 0 && (
        <div className="pt-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Related pathways</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {relatedPathways.map(pathway => (
              <Link
                key={pathway.slug}
                href={`/pathways/${pathway.slug}`}
                className="group rounded-xl border border-border/50 bg-secondary/20 px-4 py-3 hover:bg-background hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-3.5 h-3.5 shrink-0" style={{ color: pathway.accent }} />
                      <p className="text-sm font-black text-foreground leading-tight">{pathway.title}</p>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{pathway.description}</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <ReadinessLinksPanel workoutId={workout.id} />
    </div>
  );
}

function WorkoutCard({ workout }: { workout: typeof WORKOUTS[0] }) {
  const [activeDivision, setActiveDivision] = useState<WorkoutDivision["name"]>("Rx");
  const div = workout.divisions.find(d => d.name === activeDivision) ?? workout.divisions[0];

  return (
    <Card className="border-border/50 bg-card overflow-hidden">
      <div className="h-1" style={{ background: "linear-gradient(to right, #9BEC00, #9BEC0060, transparent)" }} />

      <CardHeader className="pb-3">
        <div className="flex items-start gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <CardTitle className="text-2xl font-black tracking-tight">{workout.name}</CardTitle>
              <Badge className="bg-primary/15 text-primary border-primary/20 text-xs" variant="outline">
                {workout.type}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {workout.timeCapMinutes} นาที
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {workout.movements.map((m, i) => (
                <MovementBadge
                  key={m}
                  name={m}
                  slug={workout.movementSlugs?.[i]}
                />
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* Row 1: Image + Division description */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Image + Notes */}
          <div className="space-y-3">
            {workout.image ? (
              <div className="w-full rounded-xl overflow-hidden border border-border/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={workout.image} alt={`CrossFit Open ${workout.name}`}
                  className="w-full object-cover object-center" style={{ maxHeight: 280 }} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full min-h-[220px] rounded-xl border-2 border-dashed border-border/40 bg-secondary/30">
                <ImageIcon className="w-8 h-8 text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground/50">อัปโหลดรูปประกอบ workout</p>
              </div>
            )}

            {/* Notes */}
            {workout.notes && workout.notes.length > 0 && (
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <div className="px-3 py-2 bg-secondary/50 border-b border-border/40">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">NOTES</p>
                </div>
                <div className="px-3 py-2.5 space-y-1.5">
                  {workout.notes.map((note, i) => (
                    <p key={i} className="text-xs text-muted-foreground leading-relaxed">• {note}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Division tabs + description + equipment */}
          <div className="space-y-3">
            <div className="flex gap-2">
              {workout.divisions.map(d => {
                const c = DIVISION_COLORS[d.name];
                const isActive = activeDivision === d.name;
                return (
                  <button key={d.name} onClick={() => setActiveDivision(d.name)}
                    className="px-3 py-1 rounded-md text-xs font-black tracking-wide transition-all"
                    style={{
                      backgroundColor: isActive ? c.bg : "transparent",
                      color: isActive ? c.text : "#888",
                      border: `1.5px solid ${isActive ? c.border : "#ccc"}`,
                    }}>
                    {d.name}
                  </button>
                );
              })}
            </div>

            <pre className="text-xs text-muted-foreground whitespace-pre-wrap bg-secondary/50 rounded-lg p-3 font-sans leading-relaxed border border-border/50">
              {div.description}
            </pre>

            <div className="rounded-lg border border-border/50 overflow-hidden">
              <div className="px-3 py-2 bg-secondary/50 border-b border-border/40">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">อุปกรณ์ · {activeDivision}</p>
              </div>
              <div className="grid grid-cols-2 divide-x divide-border/40">
                <div className="px-3 py-2.5">
                  <p className="text-[10px] font-bold text-muted-foreground mb-1">♀ หญิง</p>
                  <p className="text-xs leading-snug">{div.equipment.women}</p>
                </div>
                <div className="px-3 py-2.5">
                  <p className="text-[10px] font-bold text-muted-foreground mb-1">♂ ชาย</p>
                  <p className="text-xs leading-snug">{div.equipment.men}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <WorkoutReadinessPanel workout={workout} />

        <WorkoutStats workout={workout} />

      </CardContent>
    </Card>
  );
}

function ComingSoonWorkoutCard({ workout }: { workout: typeof WORKOUTS[0] }) {
  return (
    <Card className="border-border/50 bg-card overflow-hidden">
      <div className="h-1" style={{ background: "linear-gradient(to right, #9BEC0040, transparent)" }} />
      <CardContent className="py-12 flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-14 h-14 rounded-full border-2 border-dashed border-border/40 flex items-center justify-center">
          <Clock className="w-6 h-6 text-muted-foreground/40" />
        </div>
        <div>
          <p className="text-2xl font-black tracking-tight text-muted-foreground/30">{workout.name}</p>
          <p className="text-sm font-bold text-muted-foreground/50 mt-1">รอประกาศ Workout</p>
          <p className="text-xs text-muted-foreground/40 mt-0.5">Coming Soon · CrossFit Open 2026</p>
        </div>
        <Badge variant="outline" className="text-xs border-border/30 text-muted-foreground/40">
          ยังไม่ประกาศ
        </Badge>
      </CardContent>
    </Card>
  );
}

export default function WorkoutsPage() {
  return (
    <div className="space-y-8">
      {/* Dark hero header */}
      <section className="bg-[#111] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: "#9BEC00" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: "#9BEC00" }}>CrossFit Open 2026 · Thailand</span>
            <div className="h-px w-8" style={{ backgroundColor: "#9BEC00", opacity: 0.4 }} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            <span style={{ color: "#9BEC00" }}>Workouts</span> วิเคราะห์เวิร์คเอาท์
          </h1>
          <p className="text-white/50 text-sm mt-2">
            รายละเอียดและสถิติแต่ละ Workout ใน CrossFit Open 2026
          </p>
          <div className="mt-4 flex gap-3 flex-wrap">
            <Link
              href="/readiness"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all hover:opacity-90"
              style={{ backgroundColor: "#9BEC00", color: "#111" }}
            >
              ดู Readiness Checks
            </Link>
            <Link
              href="/recommend"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black border border-white/15 text-white hover:border-white/25 transition-all"
            >
              Recommendation Builder
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="space-y-10">
          {WORKOUTS.map((workout) =>
            workout.comingSoon ? (
              <ComingSoonWorkoutCard key={workout.id} workout={workout} />
            ) : (
              <WorkoutCard key={workout.id} workout={workout} />
            )
          )}
        </div>
      </div>
    </div>
  );
}
