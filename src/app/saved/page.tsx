import Link from "next/link";
import { ArrowRight, Bookmark, Heart, Layers3 } from "lucide-react";
import { RecommendationResultCard, SavedProgressPanel } from "@/components/V3Widgets";

const ACCENT = "#9BEC00";

export default function SavedPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f6f8" }}>
      <section className="bg-[#111] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: ACCENT }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: ACCENT }}>
              Movement V3 · My Progress
            </span>
          </div>
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                <span style={{ color: ACCENT }}>Saved</span> Progress
              </h1>
              <p className="text-white/40 text-sm mt-2 leading-relaxed">
                รวม movement ที่ชอบ, pathway ที่อยากไล่, movement state ที่ track ไว้, และ recommendation ล่าสุดของคุณในที่เดียว
              </p>
              <div className="mt-4 flex gap-3 flex-wrap">
                <Link
                  href="/recommend"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all hover:opacity-90"
                  style={{ backgroundColor: ACCENT, color: "#111" }}
                >
                  กลับไป Recommendation Builder
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/readiness"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black border border-white/15 text-white hover:border-white/25 transition-all"
                >
                  ดู Readiness Checks
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Heart, label: "Favorites" },
                { icon: Layers3, label: "Pathways" },
                { icon: Bookmark, label: "Train later" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-center">
                  <Icon className="w-4 h-4 mx-auto" style={{ color: ACCENT }} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mt-2">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-8">
        <SavedProgressPanel />
        <RecommendationResultCard title="Last saved recommendation" />
      </div>
    </div>
  );
}
