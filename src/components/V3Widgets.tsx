"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Sparkles, Target } from "lucide-react";
import { MovementSlugLinks } from "@/components/movements/LearningUI";
import { useV3 } from "@/components/V3Provider";
import { getMovementBySlug, getMovementDetail } from "@/lib/data/movements";
import { getResolvedUserStateGuidance, type UserStateKey } from "@/lib/movement-learning";
import { getPathwayBySlug } from "@/lib/pathways";
import { getCrossFitNewbieTerms, getCrossFitWorkoutTypes } from "@/lib/programming-content";
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

export function MovementQuickActions({ slug }: { slug: string }) {
  const movement = getMovementBySlug(slug);
  const detail = getMovementDetail(slug);
  const guidance = movement ? getResolvedUserStateGuidance(movement, detail) : [];
  const [selectedState, setSelectedState] = useState<UserStateKey>("cannotDoYet");
  const selectedGuidance = guidance.find(item => item.key === selectedState);

  if (!movement) return null;

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">เลือกมุมที่อยากดู</p>
        <p className="text-sm font-black text-gray-900 mt-1">เลือกจุดที่ใกล้กับคุณที่สุดสำหรับ {movement.name}</p>
        <p className="text-xs text-gray-500 mt-1">ไม่ต้องตั้งค่าสถานะอะไรไว้ก่อน ใช้ตัวเลือกนี้เพื่ออ่านคำแนะนำที่ตรงกับระดับของคุณมากขึ้น</p>
      </div>

      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">ตอนนี้คุณอยู่ช่วงไหน</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {(["cannotDoYet", "canDoBasic", "buildPerformance"] as UserStateKey[]).map(key => {
            const active = selectedState === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedState(key)}
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

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">ข้อแนะนำ</p>
        <p className="text-sm text-gray-700 leading-relaxed">
          {selectedGuidance?.data.summary ?? `เริ่มจากจำนวนครั้งที่คุมได้จริงกับ ${movement.name} แล้วค่อยเพิ่มทีละนิด`}
        </p>
      </div>
    </section>
  );
}

export function PathwayQuickActions({ slug }: { slug: string }) {
  const { state } = useV3();
  const pathway = getPathwayBySlug(slug);
  if (!pathway) return null;

  const recommended = state.lastRecommendation?.pathwaySlug === slug;
  const firstMovementSlug = pathway.movementSlugs[0];

  return (
    <div className="space-y-3">
      {recommended && (
        <div
          className="rounded-lg border px-3 py-3 text-xs font-black"
          style={{ backgroundColor: `${pathway.accent}12`, color: pathway.accent, borderColor: `${pathway.accent}25` }}
        >
          เส้นทางนี้ตรงกับคำแนะนำล่าสุดของคุณ
        </div>
      )}
      <div className="flex gap-2 flex-wrap">
        <Link
          href="/recommend"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-black text-gray-600 hover:text-gray-900 hover:border-gray-300"
        >
          <Sparkles className="h-3.5 w-3.5" />
          ปรับคำแนะนำ
        </Link>
        {firstMovementSlug && (
          <Link
            href={`/movements/${firstMovementSlug}`}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-black text-gray-600 hover:text-gray-900 hover:border-gray-300"
          >
            เริ่มจากท่าแรก
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      <p className="text-xs text-gray-500">
        ใช้คำแนะนำนี้เพื่อตัดสินใจก่อนว่าจะเริ่มเส้นทางฝึกไหน แล้วค่อยใช้หน้าเช็กความพร้อมเมื่ออยากเพิ่มความยาก
      </p>
    </div>
  );
}

export function RecommendationResultCard({
  result,
  title = "คำแนะนำของคุณ",
}: {
  result?: RecommendationResult;
  title?: string;
}) {
  const { state } = useV3();
  const resolvedResult = result ?? state.lastRecommendation;
  const pathway = getRecommendedPathway(resolvedResult);
  const movements = getRecommendedMovements(resolvedResult);
  const readinessProfile = getReadinessProfileBySlug(resolvedResult?.readinessProfileSlug ?? "");

  if (!resolvedResult || !pathway) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-white px-5 py-6 text-sm text-gray-500 space-y-4">
        <p>ยังไม่มีคำแนะนำล่าสุด ลองตอบ 2 ข้อสั้น ๆ ก่อน แล้วระบบจะช่วยเลือกจุดเริ่มต้นที่เหมาะกับคุณ</p>
        <div className="flex gap-2 flex-wrap">
          <Link
            href="/recommend"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-black text-gray-600 hover:text-gray-900 hover:border-gray-300"
          >
            เริ่มตอบ 2 ข้อ
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/movements/start-here"
            className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-xs font-black text-gray-600 hover:text-gray-900 hover:border-gray-300"
          >
            ดูหน้าเริ่มต้น
          </Link>
        </div>
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
        <div className="flex gap-2 flex-wrap">
          <Link
            href={`/pathways/${pathway.slug}`}
            className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-xs font-black text-gray-600 hover:text-gray-900 hover:border-gray-300"
          >
            เปิดเส้นทางฝึก
          </Link>
          {readinessProfile && (
            <Link
              href={`/readiness/${readinessProfile.slug}`}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-black text-gray-600 hover:text-gray-900 hover:border-gray-300"
            >
              <Target className="h-3.5 w-3.5" />
              เช็กความพร้อม
            </Link>
          )}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">ทำไมเราแนะนำแบบนี้</p>
        <ul className="space-y-2">
          {resolvedResult.reasons.map(reason => (
            <li key={reason} className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#9BEC00] shrink-0" />
              {reason}
            </li>
          ))}
        </ul>
      </div>

      {movements.length > 0 && (
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">ท่าที่ควรเริ่มต่อ</p>
          <MovementSlugLinks slugs={movements.map(movement => movement.slug)} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">ข้อแนะนำ</p>
          <p className="text-sm text-gray-700 leading-relaxed">{resolvedResult.coachNote}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">อย่าเพิ่งรีบ</p>
          <p className="text-sm text-gray-700 leading-relaxed">{resolvedResult.caution}</p>
        </div>
      </div>

      {resolvedResult.openInsight && (
        <div className="rounded-lg border border-[#9BEC0030] bg-[#9BEC0012] p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">ถ้าอยากลงลึกต่อ</p>
          <p className="text-sm text-gray-700 leading-relaxed">{resolvedResult.openInsight}</p>
        </div>
      )}
    </div>
  );
}

function RecommendationBasicsPanel() {
  const terms = getCrossFitNewbieTerms();
  const workoutTypes = getCrossFitWorkoutTypes();

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-4 space-y-4">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">มือใหม่ควรรู้</p>
        <p className="text-sm font-black text-gray-900 mt-1">คำที่เจอบ่อยใน CrossFit หมายถึงอะไร</p>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          เก็บไว้เป็นสรุปสั้น ๆ เวลาเจอคำอย่าง For Time, EMOM หรือ AMRAP จะได้อ่านตามทันมากขึ้น
        </p>
      </div>

      <div className="space-y-3">
        {terms.map(term => (
          <div key={term.slug} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center rounded-full border border-gray-200 px-2 py-0.5 text-[10px] font-black text-gray-600">
                {term.term}
              </span>
              <p className="text-sm font-black text-gray-900">{term.titleTH}</p>
            </div>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">{term.meaning}</p>
            <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">เวลาอ่านให้คิดง่าย ๆ ว่า {term.howToRead}</p>
            <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{term.beginnerNote}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
        <div>
          <p className="text-sm font-black text-gray-900">ประเภทงานที่เจอบ่อยใน CrossFit</p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            ถ้ามองแบบง่าย ๆ เวิร์กเอาท์ใน CrossFit มักแบ่งตามวิธีนับผลและรูปแบบการทำงาน
          </p>
        </div>
        <div className="space-y-2.5">
          {workoutTypes.map(item => (
            <div key={item.slug} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-black text-gray-900">{item.titleTH}</p>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{item.englishLabel}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.summary}</p>
              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{item.whatYouWillSee}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RecommendationSupportPanel() {
  const { state, clearAll } = useV3();
  const readinessCount = Object.keys(state.readinessResults).length;
  const hasStoredData = !!state.lastRecommendation || readinessCount > 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">เริ่มแบบง่าย</p>
          <p className="text-lg font-black text-gray-900 mt-1">เริ่มง่ายก่อน แล้วค่อยไปต่อ</p>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
            หน้านี้ทำมาเพื่อช่วยให้เริ่มได้เลยโดยไม่ต้องคิดเยอะก่อน ถ้าอยากลงลึกค่อยเปิดเส้นทางฝึก หน้าเช็กความพร้อม หรืออ่านต่อจาก CrossFit.com ภายหลัง
          </p>
        </div>
        {hasStoredData && (
          <button type="button" onClick={clearAll} className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-xs font-black text-red-500 hover:border-red-200">
            ล้างข้อมูลที่เคยเช็ก
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {[
          { href: "/recommend", title: "ตอบ 2 ข้อสั้น ๆ", description: "ให้ระบบช่วยเลือกจุดเริ่มต้นที่เหมาะกับคุณ" },
          { href: "/movements/start-here", title: "ดูหน้าเริ่มต้น", description: "ใช้เมื่อยังไม่แน่ใจว่าจะอ่านอะไรต่อก่อน" },
          { href: "/pathways", title: "ดูเส้นทางฝึกทั้งหมด", description: "ใช้เมื่ออยากลงลึกและเห็นลำดับว่าท่าไหนควรมาก่อนหรือมาหลัง" },
        ].map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-4 hover:bg-white hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-300 shrink-0" />
            </div>
          </Link>
        ))}
      </div>

      <RecommendationBasicsPanel />

      <div className="rounded-lg border border-dashed border-gray-200 px-4 py-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">ข้อมูลตอนนี้</p>
        <p className="text-sm text-gray-700 mt-2">
          {state.lastRecommendation ? "มีคำแนะนำล่าสุดบันทึกไว้แล้ว" : "ยังไม่มีคำแนะนำล่าสุด"}
        </p>
        <p className="text-sm text-gray-700 mt-1">มีผลเช็กความพร้อม {readinessCount} รายการ</p>
      </div>
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
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">เช็กความพร้อม</p>
        <p className="text-sm text-gray-600 mt-1">ตอบคำถามสั้น ๆ เพื่อดูว่าควรกลับไปปูพื้นก่อน หรือเริ่มขยับความยากต่อได้แล้ว</p>
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
      <div className="rounded-xl bg-[#111] px-5 py-4 text-white">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">เริ่มต้นแบบง่าย</p>
        <p className="text-lg font-black mt-2">ตอบแค่ 2 ข้อ แล้วค่อยเริ่มจากจุดที่เหมาะกับคุณ</p>
        <p className="text-sm text-white/55 mt-1 leading-relaxed">
          ไม่ต้องวิเคราะห์ตัวเองละเอียดตั้งแต่แรก แค่เลือกด้านที่ติดอยู่และระดับที่ใกล้กับคุณที่สุดก่อน
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-6">
        {RECOMMENDATION_QUESTIONS.map((question, index) => (
          <div key={question.id}>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#111] text-[11px] font-black text-[#9BEC00]">
                {index + 1}
              </span>
              <p className="text-sm font-black text-gray-900">{question.title}</p>
            </div>
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
          ดูคำแนะนำ
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
          ดูผลความพร้อม
        </button>
      </div>

      {currentResult && bandMeta && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">ผลล่าสุด</p>
              <p className="text-sm text-gray-600 mt-1">{currentResult.summary}</p>
            </div>
            <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-black" style={{ backgroundColor: bandMeta.bg, color: bandMeta.text, borderColor: bandMeta.border }}>
              {bandMeta.label}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">คะแนนรวม</p>
              <p className="text-2xl font-black text-gray-900">{currentResult.score}/{currentResult.maxScore}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">จุดที่ยังติด</p>
              <p className="text-sm text-gray-700 leading-relaxed">{currentResult.blockers.join(" · ")}</p>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">สิ่งที่ควรโฟกัสต่อ</p>
            <MovementSlugLinks slugs={currentResult.recommendationMovementSlugs} />
          </div>

          {currentResult.recommendationPathwaySlug && (
            <Link href={`/pathways/${currentResult.recommendationPathwaySlug}`} className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-xs font-black text-gray-600 hover:text-gray-900 hover:border-gray-300">
              เปิดเส้นทางฝึกที่เกี่ยวข้อง
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
