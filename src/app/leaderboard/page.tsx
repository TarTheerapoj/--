"use client";

import { useState } from "react";
import ComingSoonWrapper from "@/components/ComingSoonWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Building2 } from "lucide-react";
import { ATHLETES, type Division } from "@/lib/data/athletes";
import { WORKOUTS } from "@/lib/data/workouts";

const DIVISIONS: Division[] = [
  "Men Rx",
  "Women Rx",
  "Men Scaled",
  "Women Scaled",
  "Men Masters 35-39",
  "Women Masters 35-39",
  "Men Masters 40-44",
  "Women Masters 40-44",
];

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/30 text-xs font-bold">
        🥇
      </span>
    );
  if (rank === 2)
    return (
      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-400/20 text-zinc-600 ring-1 ring-zinc-400/40 text-xs font-bold">
        🥈
      </span>
    );
  if (rank === 3)
    return (
      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-600/15 text-amber-700 ring-1 ring-amber-600/30 text-xs font-bold">
        🥉
      </span>
    );
  return (
    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary text-foreground/60 text-xs font-bold">
      {rank}
    </span>
  );
}

export default function LeaderboardPage() {
  const [division, setDivision] = useState<Division>("Men Rx");

  const athletes = ATHLETES.filter((a) => a.division === division).sort(
    (a, b) => a.overallRank - b.overallRank
  );

  return (
    <ComingSoonWrapper
      title="ลีดเดอร์บอร์ด"
      description="ข้อมูลอันดับและผลการแข่งขันของนักกีฬาไทยทุก Division กำลังจะถูกอัปเดต ติดตามได้เร็วๆ นี้"
    >
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
            <span style={{ color: "#9BEC00" }}>Leaderboard</span> ลีดเดอร์บอร์ด
          </h1>
          <p className="text-white/50 text-sm mt-2">
            อันดับโดยรวม CrossFit Open 2026 แยกตาม Division
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">

      <div className="flex items-center gap-3">
        <Select value={division} onValueChange={(v) => setDivision(v as Division)}>
          <SelectTrigger className="w-52 bg-card border-border/60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DIVISIONS.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="secondary" className="text-xs">
          {athletes.length} คน
        </Badge>
      </div>

      <Card className="border-border/50 bg-card">
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-semibold text-muted-foreground flex items-end gap-2">
            <span className="w-8" />
            <span className="flex-1">Affiliate / จังหวัด</span>
            {WORKOUTS.map((w) => (
              <span key={w.id} className="w-20 text-center hidden sm:block">
                {w.id}
              </span>
            ))}
            <span className="w-16 text-center">คะแนน</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          {athletes.length === 0 ? (
            <p className="text-center text-muted-foreground py-12 text-sm">
              ยังไม่มีข้อมูลสำหรับ Division นี้
            </p>
          ) : (
            <div className="space-y-2">
              {athletes.map((athlete) => (
                <div
                  key={athlete.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card hover:bg-secondary/60 border border-border/50 hover:border-border transition-all"
                >
                  <RankBadge rank={athlete.overallRank} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      {athlete.affiliate}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {athlete.province}
                    </p>
                  </div>
                  {athlete.workoutScores.map((ws) => (
                    <div key={ws.workoutId} className="w-20 text-center hidden sm:block">
                      <p className="text-xs font-medium">{ws.score}</p>
                      <p className="text-[10px] text-muted-foreground">#{ws.rank}</p>
                    </div>
                  ))}
                  <div className="w-16 text-center">
                    <Badge
                      className="text-xs font-bold bg-primary/15 text-primary border-primary/20 hover:bg-primary/20"
                      variant="outline"
                    >
                      {athlete.overallScore} pts
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {athletes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {athletes.slice(0, 3).map((athlete, i) => (
            <Card key={athlete.id} className="border-border/50 bg-card">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <RankBadge rank={i + 1} />
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{athlete.affiliate}</p>
                    <p className="text-xs text-muted-foreground">{athlete.province}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {athlete.workoutScores.map((ws) => (
                    <div key={ws.workoutId} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">{ws.workoutId}</span>
                      <span className="font-semibold">{ws.score}</span>
                      <Badge variant="secondary" className="text-[10px] px-1.5">
                        #{ws.rank}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>
    </div>
    </ComingSoonWrapper>
  );
}
