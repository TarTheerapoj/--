"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bookmark,
  Brain,
  CheckCircle2,
  Heart,
  Layers3,
  Sparkles,
  Target,
} from "lucide-react";
import { MovementSlugLinks } from "@/components/movements/LearningUI";
import { useV3 } from "@/components/V3Provider";
import { getMovementBySlug, getMovementDetail } from "@/lib/data/movements";
import { getResolvedUserStateGuidance, type UserStateKey } from "@/lib/movement-learning";
import { getPathwayBySlug } from "@/lib/pathways";
import {
  DEFAULT_RECOMMENDATION_ANSWERS,
  READINESS_BAND_META,
  RECOMMENDATION_QUESTIONS,
  USER_STATE_LABELS,
  USER_STATE_SHORT_LABELS,
  getReadinessProfileBySlug,
  getReadinessProfilesForMovement,
  getReadinessProfilesForWorkout,
  getRecommendedMovements,
  getRecommendedPathway,
  type RecommendationAnswers,
  type RecommendationResult,
} from "@/lib/v3";

function ToggleButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Heart;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-black transition-all"
      style={{
        backgroundColor: active ? "#111" : "white",
        color: active ? "#9BEC00" : "#6b7280",
        borderColor: active ? "#111" : "#e5e7eb",
      }}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function ReadinessBandBadge({ profileSlug }: { profileSlug: string }) {
  const { state } = useV3();
  const result = state.readinessResults[profileSlug];
  if (!result) return null;

  const meta = READINESS_BAND_META[result.band];
  return (
    <span
      className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-black"
      style={{ backgroundColor: meta.bg, color: meta.text, borderColor: meta.border }}
    >
      {meta.label}
    </span>
  );
}

export function CoachModeToggle() {
  const { state, setCoachModeEnabled } = useV3();

  return (
    <button
      type="button"
      onClick={() => setCoachModeEnabled(!state.coachModeEnabled)}
      className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-black transition-all"
      style={{
        backgroundColor: state.coachModeEnabled ? "#111" : "white",
        color: state.coachModeEnabled ? "#9BEC00" : "#6b7280",
        borderColor: state.coachModeEnabled ? "#111" : "#e5e7eb",
      }}
    >
      <Brain className="h-3.5 w-3.5" />
      Coach Mode {state.coachModeEnabled ? "On" : "Off"}
    </button>
  );
}

export function MovementQuickActions({ slug }: { slug: string }) {
  const {
    state,
    isFavoriteMovement,
    isTrainLaterMovement,
    setMovementState,
    toggleFavoriteMovement,
    toggleTrainLaterMovement,
  } = useV3();

  const movement = getMovementBySlug(slug);
  const detail = getMovementDetail(slug);
  const guidance = movement ? getResolvedUserStateGuidance(movement, detail) : [];
  const selectedState = state.movementStates[slug] ?? "cannotDoYet";
  const selectedGuidance = guidance.find(item => item.key === selectedState);

  if (!movement) return null;

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">My Progress</p>
          <p className="text-sm font-black text-gray-900 mt-1">ตั้งสถานะของ {movement.name}</p>
        </div>
        <CoachModeToggle />
      </div>

      <div className="flex gap-2 flex-wrap">
        <ToggleButton
          active={isFavoriteMovement(slug)}
          onClick={() => toggleFavoriteMovement(slug)}
          icon={Heart}
          label={isFavoriteMovement(slug) ? "Favorited" : "Favorite"}
        />
        <ToggleButton
          active={isTrainLaterMovement(slug)}
          onClick={() => toggleTrainLaterMovement(slug)}
          icon={Bookmark}
          label={isTrainLaterMovement(slug) ? "Saved for later" : "Train later"}
        />
      </div>

      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Current state</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {(["cannotDoYet", "canDoBasic", "buildPerformance"] as UserStateKey[]).map(key => {
            const active = selectedState === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setMovementState(slug, key)}
                className="rounded-lg border px-3 py-3 text-left transition-all"
                style={{
                  backgroundColor: active ? "#111" : "#f8fafc",
                  color: active ? "#9BEC00" : "#374151",
                  borderColor: active ? "#111" : "#e5e7eb",
                }}
              >
                <p className="text-xs font-black">{USER_STATE_SHORT_LABELS[key]}</p>
                <p className="text-[11px] mt-1 opacity-80">{USER_STATE_LABELS[key]}</p>
              </button>
            );
          })}
        </div>
      </div>

      {state.coachModeEnabled && selectedGuidance && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Coach note</p>
          <p className="text-sm text-gray-700 leading-relaxed">{selectedGuidance.data.summary}</p>
        </div>
      )}
    </section>
  );
}

export function PathwayQuickActions({ slug }: { slug: string }) {
  const { isSavedPathway, toggleSavedPathway, state } = useV3();
  const pathway = getPathwayBySlug(slug);
  if (!pathway) return null;

  const recommended = state.lastRecommendation?.pathwaySlug === slug;

  return (
    <div className="flex gap-2 flex-wrap">
      <ToggleButton
        active={isSavedPathway(slug)}
        onClick={() => toggleSavedPathway(slug)}
        icon={Layers3}
        label={isSavedPathway(slug) ? "Saved pathway" : "Save pathway"}
      />
      {recommended && (
        <span
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-black"
          style={{ backgroundColor: `${pathway.accent}15`, color: pathway.accent, borderColor: `${pathway.accent}30` }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Recommended now
        </span>
      )}
    </div>
  );
}

export function RecommendationResultCard({
  result,
  title = "Your Recommendation",
}: {
  result?: RecommendationResult;
  title?: string;
}) {
  const { state } = useV3();
  const resolvedResult = result ?? state.lastRecommendation;
  const pathway = getRecommendedPathway(resolvedResult);
  const movements = getRecommendedMovements(resolvedResult);

  if (!resolvedResult || !pathway) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-white px-5 py-6 text-sm text-gray-500">
        ยังไม่มี recommendation ที่บันทึกไว้ ลองตอบ quick questions เพื่อให้ระบบจัดลำดับ pathway ให้
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{title}</p>
          <p className="text-lg font-black text-gray-900 mt-1">{pathway.titleTH}</p>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{resolvedResult.summary}</p>
        </div>
        <Link
          href={`/pathways/${pathway.slug}`}
          className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-xs font-black text-gray-600 hover:text-gray-900 hover:border-gray-300"
        >
          เปิด pathway
        </Link>
      </div>

      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Why this fits</p>
        <ul className="space-y-2">
          {resolvedResult.reasons.map(reason => (
            <li key={reason} className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#9BEC00] shrink-0" />
              {reason}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Next movements</p>
        <MovementSlugLinks slugs={movements.map(movement => movement.slug)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Coach note</p>
          <p className="text-sm text-gray-700 leading-relaxed">{resolvedResult.coachNote}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Do not rush</p>
          <p className="text-sm text-gray-700 leading-relaxed">{resolvedResult.caution}</p>
        </div>
      </div>

      {resolvedResult.openInsight && (
        <div className="rounded-lg border border-[#9BEC0030] bg-[#9BEC0012] p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Open tie-in</p>
          <p className="text-sm text-gray-700 leading-relaxed">{resolvedResult.openInsight}</p>
        </div>
      )}
    </div>
  );
}

export function SavedProgressPanel() {
  const { state, clearAll } = useV3();

  const favoriteMovements = state.favoriteMovementSlugs
    .map(slug => getMovementBySlug(slug))
    .filter(Boolean)
    .slice(0, 6);
  const savedPathways = state.savedPathwaySlugs
    .map(slug => getPathwayBySlug(slug))
    .filter(Boolean)
    .slice(0, 4);
  const trackedStates = Object.entries(state.movementStates).slice(0, 4);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Saved Progress</p>
          <p className="text-lg font-black text-gray-900 mt-1">พื้นที่ส่วนตัวของคุณ</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link href="/saved" className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-xs font-black text-gray-600 hover:text-gray-900 hover:border-gray-300">
            เปิดทั้งหมด
          </Link>
          <button type="button" onClick={clearAll} className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-xs font-black text-red-500 hover:border-red-200">
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Favorite movements", value: state.favoriteMovementSlugs.length },
          { label: "Saved pathways", value: state.savedPathwaySlugs.length },
          { label: "Train later", value: state.trainLaterMovementSlugs.length },
          { label: "Readiness checks", value: Object.keys(state.readinessResults).length },
        ].map(item => (
          <div key={item.label} className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-xl font-black text-gray-900">{item.value}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {favoriteMovements.length > 0 && (
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Favorite movements</p>
          <MovementSlugLinks slugs={favoriteMovements.map(movement => movement!.slug)} />
        </div>
      )}

      {savedPathways.length > 0 && (
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Saved pathways</p>
          <div className="flex flex-wrap gap-2">
            {savedPathways.map(pathway => (
              <Link key={pathway!.slug} href={`/pathways/${pathway!.slug}`} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-black text-gray-600 hover:text-gray-900 hover:border-gray-300">
                {pathway!.titleTH}
              </Link>
            ))}
          </div>
        </div>
      )}

      {trackedStates.length > 0 && (
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Tracked movement states</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {trackedStates.map(([slug, userState]) => {
              const movement = getMovementBySlug(slug);
              if (!movement || !userState) return null;
              return (
                <Link key={slug} href={`/movements/${slug}`} className="rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50">
                  <p className="text-sm font-black text-gray-900">{movement.name}</p>
                  <p className="text-[11px] text-gray-500 mt-1">{USER_STATE_LABELS[userState]}</p>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function ReadinessLinksPanel({ movementSlug, workoutId }: { movementSlug?: string; workoutId?: string }) {
  const profiles = useMemo(() => {
    if (movementSlug) return getReadinessProfilesForMovement(movementSlug);
    if (workoutId) return getReadinessProfilesForWorkout(workoutId);
    return [];
  }, [movementSlug, workoutId]);

  if (profiles.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Readiness checks</p>
        <p className="text-sm text-gray-600 mt-1">ตอบ self-check สั้น ๆ เพื่อดูว่าควร build foundation ต่อ หรือพร้อม push ต่อได้แล้ว</p>
      </div>
      <div className="space-y-3">
        {profiles.map(profile => (
          <Link key={profile.slug} href={`/readiness/${profile.slug}`} className="block rounded-lg border border-gray-200 px-4 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-black text-gray-900">{profile.title}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{profile.description}</p>
              </div>
              <ReadinessBandBadge profileSlug={profile.slug} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function RecommendationBuilder() {
  const { state, buildAndSaveRecommendation } = useV3();
  const [answers, setAnswers] = useState<RecommendationAnswers>(DEFAULT_RECOMMENDATION_ANSWERS);
  const [result, setResult] = useState<RecommendationResult | undefined>(state.lastRecommendation);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-6">
        {RECOMMENDATION_QUESTIONS.map(question => (
          <div key={question.id}>
            <p className="text-sm font-black text-gray-900">{question.title}</p>
            <p className="text-xs text-gray-500 mt-1">{question.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
              {question.options.map(option => {
                const active = answers[question.id] === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setAnswers(current => ({ ...current, [question.id]: option.value as never }))}
                    className="rounded-lg border px-4 py-3 text-left transition-all"
                    style={{
                      backgroundColor: active ? "#111" : "#f8fafc",
                      color: active ? "#9BEC00" : "#374151",
                      borderColor: active ? "#111" : "#e5e7eb",
                    }}
                  >
                    <p className="text-sm font-black">{option.label}</p>
                    <p className="text-[11px] mt-1 opacity-80 leading-relaxed">{option.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setResult(buildAndSaveRecommendation(answers))}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black"
          style={{ backgroundColor: "#9BEC00", color: "#111" }}
        >
          <Sparkles className="h-4 w-4" />
          Build my recommendation
        </button>
      </div>

      <RecommendationResultCard result={result} />
    </div>
  );
}

export function ReadinessEvaluator({ profileSlug }: { profileSlug: string }) {
  const { state, evaluateAndSaveReadiness } = useV3();
  const profile = getReadinessProfileBySlug(profileSlug);
  const [answers, setAnswers] = useState<Record<string, "0" | "1" | "2">>({});
  const [result, setResult] = useState(state.readinessResults[profileSlug]);

  if (!profile) return null;

  const allAnswered = profile.questions.every(question => answers[question.id]);
  const currentResult = result ?? state.readinessResults[profileSlug];
  const bandMeta = currentResult ? READINESS_BAND_META[currentResult.band] : undefined;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-5">
        <div>
          <p className="text-lg font-black text-gray-900">{profile.title}</p>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{profile.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {profile.questions.map(question => (
            <div key={question.id} className="rounded-lg border border-gray-200 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{question.demandLabel}</p>
              <p className="text-sm font-semibold text-gray-900 mt-2 leading-relaxed">{question.prompt}</p>
              <div className="grid grid-cols-3 gap-2 mt-3">
                {question.options.map(option => {
                  const active = answers[question.id] === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setAnswers(current => ({ ...current, [question.id]: option.value }))}
                      className="rounded-lg border px-2 py-2 text-center transition-all"
                      style={{
                        backgroundColor: active ? "#111" : "#f8fafc",
                        color: active ? "#9BEC00" : "#4b5563",
                        borderColor: active ? "#111" : "#e5e7eb",
                      }}
                    >
                      <p className="text-[11px] font-black">{option.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          disabled={!allAnswered}
          onClick={() => {
            const next = evaluateAndSaveReadiness(profileSlug, answers);
            if (next) setResult(next);
          }}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: "#111", color: "#9BEC00" }}
        >
          <Target className="h-4 w-4" />
          Evaluate readiness
        </button>
      </div>

      {currentResult && bandMeta && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Latest result</p>
              <p className="text-sm text-gray-600 mt-1">{currentResult.summary}</p>
            </div>
            <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-black" style={{ backgroundColor: bandMeta.bg, color: bandMeta.text, borderColor: bandMeta.border }}>
              {bandMeta.label}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Score</p>
              <p className="text-2xl font-black text-gray-900">{currentResult.score}/{currentResult.maxScore}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Likely blockers</p>
              <p className="text-sm text-gray-700 leading-relaxed">{currentResult.blockers.join(" · ")}</p>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Recommended next work</p>
            <MovementSlugLinks slugs={currentResult.recommendationMovementSlugs} />
          </div>

          {currentResult.recommendationPathwaySlug && (
            <Link href={`/pathways/${currentResult.recommendationPathwaySlug}`} className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-xs font-black text-gray-600 hover:text-gray-900 hover:border-gray-300">
              Open related pathway
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
