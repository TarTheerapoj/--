import Link from "next/link";
import { ArrowRight, ChevronRight, GitBranch } from "lucide-react";
import { DIFFICULTY_LABEL, getMovementBySlug, type DifficultyLevel } from "@/lib/data/movements";
import { getBodyDemandStyle, getDifficultyBand, type BodyDemand } from "@/lib/movement-learning";
import { getPathwayMovements, type SkillPathway } from "@/lib/pathways";

export function DifficultyBandBadge({ level }: { level: DifficultyLevel }) {
  const band = getDifficultyBand(level);
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full"
      style={{ backgroundColor: band.bg, color: band.text }}
    >
      {band.label}
    </span>
  );
}

export function BodyDemandBadges({ demands }: { demands: BodyDemand[] }) {
  if (demands.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {demands.map(demand => {
        const style = getBodyDemandStyle(demand);
        return (
          <span
            key={demand}
            className="text-[10px] font-bold px-2 py-0.5 rounded-md border"
            style={{ backgroundColor: style.bg, color: style.text, borderColor: style.border }}
          >
            {style.label}
          </span>
        );
      })}
    </div>
  );
}

export function PathwayPreviewCard({ pathway }: { pathway: SkillPathway }) {
  const movements = getPathwayMovements(pathway);

  return (
    <Link
      href={`/pathways/${pathway.slug}`}
      className="group block rounded-xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all overflow-hidden"
    >
      <div className="px-4 py-4" style={{ backgroundColor: `${pathway.accent}08`, borderBottom: `1px solid ${pathway.accent}20` }}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: pathway.accent }}>
                Skill Pathway
              </span>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded" style={{ backgroundColor: `${pathway.accent}18`, color: pathway.accent }}>
                {movements.length} steps
              </span>
            </div>
            <h3 className="text-base font-black text-gray-900 mt-1">{pathway.title}</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{pathway.description}</p>
          </div>
          <GitBranch className="w-4 h-4 shrink-0" style={{ color: pathway.accent }} />
        </div>
      </div>
      <div className="px-4 py-4">
        <div className="flex items-center gap-1 flex-wrap">
          {movements.slice(0, 4).map((movement, index) => (
            <div key={movement.slug} className="flex items-center gap-1">
              <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-gray-50 text-gray-700 border border-gray-200">
                {movement.name}
              </span>
              {index < Math.min(movements.length, 4) - 1 && <ArrowRight className="w-3 h-3 text-gray-300" />}
            </div>
          ))}
          {movements.length > 4 && (
            <span className="text-[10px] font-bold text-gray-400">+{movements.length - 4} more</span>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-[11px] text-gray-500 truncate">{pathway.whoItsFor}</p>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
        </div>
      </div>
    </Link>
  );
}

export function PathwayLadder({
  pathway,
  highlightSlug,
  compact = false,
}: {
  pathway: SkillPathway;
  highlightSlug?: string;
  compact?: boolean;
}) {
  const movements = getPathwayMovements(pathway);

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {movements.map((movement, index) => {
          const active = highlightSlug === movement.slug;
          return (
            <div key={movement.slug} className="flex items-center gap-2">
              <Link
                href={`/movements/${movement.slug}`}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all"
                style={{
                  backgroundColor: active ? `${pathway.accent}15` : "#f8fafc",
                  borderColor: active ? `${pathway.accent}40` : "#e5e7eb",
                  color: active ? pathway.accent : "#475569",
                }}
              >
                {movement.name}
              </Link>
              {index < movements.length - 1 && <ArrowRight className="w-3 h-3 text-gray-300" />}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {movements.map((movement, index) => {
        const active = highlightSlug === movement.slug;
        return (
          <div key={movement.slug} className="flex items-start gap-3">
            <div className="flex flex-col items-center shrink-0">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                style={{ backgroundColor: active ? pathway.accent : `${pathway.accent}18`, color: active ? "white" : pathway.accent }}
              >
                {index + 1}
              </div>
              {index < movements.length - 1 && <div className="w-px min-h-[24px] mt-1" style={{ backgroundColor: `${pathway.accent}30` }} />}
            </div>
            <Link
              href={`/movements/${movement.slug}`}
              className="group flex-1 rounded-xl border px-4 py-3 transition-all hover:shadow-sm"
              style={{
                backgroundColor: active ? `${pathway.accent}08` : "white",
                borderColor: active ? `${pathway.accent}35` : "#e5e7eb",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-black text-gray-900 leading-tight">{movement.name}</p>
                    <DifficultyBandBadge level={movement.difficulty} />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">{DIFFICULTY_LABEL[movement.difficulty]}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export function MovementSlugLinks({ slugs }: { slugs: string[] }) {
  if (slugs.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {slugs.map(slug => {
        const movement = getMovementBySlug(slug);
        if (!movement) return null;
        return (
          <Link
            key={slug}
            href={`/movements/${slug}`}
            className="text-[10px] font-bold px-2 py-1 rounded-md bg-gray-50 text-gray-600 border border-gray-200 hover:bg-white hover:text-gray-800 transition-colors"
          >
            {movement.name}
          </Link>
        );
      })}
    </div>
  );
}
