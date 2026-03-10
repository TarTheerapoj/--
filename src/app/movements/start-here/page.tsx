import Link from "next/link";
import { ChevronRight, ArrowRight, BookOpen, Zap, Dumbbell, Star } from "lucide-react";
import { PathwayPreviewCard } from "@/components/movements/LearningUI";
import { SKILL_PATHWAYS } from "@/lib/pathways";

const ACCENT = "#9BEC00";

export default function StartHerePage() {
  const featured = SKILL_PATHWAYS.slice(0, 4);
  const totalSteps = SKILL_PATHWAYS.reduce((sum, pathway) => sum + pathway.movementSlugs.length, 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f6f8" }}>
      <section className="bg-[#111] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: ACCENT }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-bold uppercase tracking-widest mb-5 flex-wrap">
            <Link href="/movements" className="hover:text-white/70 transition-colors">
              Movement Library
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: ACCENT }}>Start Here</span>
          </div>

          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5" style={{ color: ACCENT }} />
                <span
                  className="text-[10px] font-black tracking-[0.25em] uppercase"
                  style={{ color: ACCENT }}
                >
                  Guided Entry
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                <span style={{ color: ACCENT }}>เริ่มต้น</span> จาก Skill Gap ของคุณ
              </h1>
              <p className="text-white/40 text-sm mt-2 max-w-xl leading-relaxed">
                เลือก pathway ที่ตรงกับสิ่งที่คุณติดอยู่ตอนนี้ แล้วไล่ตามลำดับที่ช่วยให้รู้ว่าควรฝึกอะไรต่อจริง ๆ
              </p>
              <div className="mt-4 flex gap-3 flex-wrap">
                <Link
                  href="/pathways"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all hover:opacity-90"
                  style={{ backgroundColor: ACCENT, color: "#111" }}
                >
                  ดู Pathways ทั้งหมด
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/movements"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black border border-white/15 text-white hover:border-white/25 transition-all"
                >
                  สำรวจ Movement Library
                </Link>
              </div>
            </div>
            <div className="flex gap-6 flex-wrap">
              {[
                { icon: Star, label: "Pathways", value: SKILL_PATHWAYS.length },
                { icon: Dumbbell, label: "Key Steps", value: totalSteps },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-white/30" />
                    <p className="text-2xl font-black" style={{ color: ACCENT }}>{value}</p>
                  </div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-2">
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-black text-white" style={{ backgroundColor: ACCENT, color: "#111" }}>!</div>
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong className="text-gray-700">วิธีใช้:</strong> ถ้าคุณไม่รู้ว่าควรฝึก movement ไหนต่อ ให้เริ่มจาก pathway ก่อน แล้วค่อยลงไปอ่าน movement detail ของแต่ละ step
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featured.map(pathway => (
            <PathwayPreviewCard key={pathway.slug} pathway={pathway} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/pathways"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <BookOpen className="w-4 h-4" />
            ดู Skill Pathways ทั้งหมด
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
