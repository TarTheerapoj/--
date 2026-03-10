import Link from "next/link";
import { ArrowRight, Sparkles, Target } from "lucide-react";
import { RecommendationBuilder, SavedProgressPanel } from "@/components/V3Widgets";

const ACCENT = "#9BEC00";

export default function RecommendPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f6f8" }}>
      <section className="bg-[#111] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: ACCENT }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: ACCENT }}>
              Movement V3 · Personalized Guide
            </span>
          </div>
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                <span style={{ color: ACCENT }}>Recommendation</span> Builder
              </h1>
              <p className="text-white/40 text-sm mt-2 leading-relaxed">
                ตอบ quick questions 4 ข้อ เพื่อจัด pathway, movement ลำดับถัดไป, และ readiness check ที่เหมาะกับ bottleneck ของคุณตอนนี้
              </p>
              <div className="mt-4 flex gap-3 flex-wrap">
                <Link
                  href="/readiness"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black border border-white/15 text-white hover:border-white/25 transition-all"
                >
                  <Target className="w-3.5 h-3.5" />
                  ดู Readiness Checks
                </Link>
                <Link
                  href="/saved"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all hover:opacity-90"
                  style={{ backgroundColor: ACCENT, color: "#111" }}
                >
                  เปิด Saved Progress
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            <div className="flex gap-6">
              {[
                { label: "Questions", value: 4 },
                { label: "Outputs", value: 3 },
              ].map(item => (
                <div key={item.label} className="text-right">
                  <p className="text-2xl font-black" style={{ color: ACCENT }}>{item.value}</p>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${ACCENT}20`, color: ACCENT }}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black text-gray-900">What this does</p>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                ระบบนี้ยังเป็น rule-based และ local-first สำหรับ MVP แต่ถูกจัดให้ต่อยอดไป backend sync ได้ภายหลังโดยไม่ต้องรื้อโครงสร้างหลัก
              </p>
            </div>
          </div>

          <RecommendationBuilder />
        </div>

        <div className="space-y-6">
          <SavedProgressPanel />
        </div>
      </div>
    </div>
  );
}
