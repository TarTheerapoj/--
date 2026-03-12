import Link from "next/link";
import { ArrowRight, GitBranch } from "lucide-react";
import { PathwayPreviewCard } from "@/components/movements/LearningUI";
import { RecommendationResultCard } from "@/components/V3Widgets";
import { SKILL_PATHWAYS } from "@/lib/pathways";

const ACCENT = "#9BEC00";

export default function PathwaysPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f6f8" }}>
      <section className="bg-[#111] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: ACCENT }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: ACCENT }}>
              เส้นทางฝึก
            </span>
          </div>
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                <span style={{ color: ACCENT }}>เส้นทางฝึก</span>
              </h1>
              <p className="text-white/40 text-sm mt-2 max-w-2xl leading-relaxed">
                เลือกเส้นทางที่ตรงกับจุดที่คุณยังติดอยู่ แล้วค่อยไล่ตามลำดับที่วางไว้แบบไม่ข้ามขั้น
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-right">
                <p className="text-2xl font-black" style={{ color: ACCENT }}>{SKILL_PATHWAYS.length}</p>
                <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">เส้นทาง</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${ACCENT}20`, color: ACCENT }}>
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-black text-gray-900">ใช้เส้นทางฝึกอย่างไร</p>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
              ถ้าคุณติดท่าใดท่าหนึ่งในเวิร์กเอาท์ ให้ย้อนมาดูเส้นทางฝึกที่เกี่ยวข้องก่อน แล้วค่อยฝึกตามลำดับทีละขั้น
            </p>
          </div>
        </div>

        <RecommendationResultCard title="เส้นทางที่แนะนำตอนนี้" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {SKILL_PATHWAYS.map(pathway => (
            <PathwayPreviewCard key={pathway.slug} pathway={pathway} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/movements"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            กลับไปคลังท่า
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
