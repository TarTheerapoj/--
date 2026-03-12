import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";
import { ReadinessLinksPanel } from "@/components/V3Widgets";
import { READINESS_PROFILES } from "@/lib/v3";

const ACCENT = "#9BEC00";

export default function ReadinessPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f6f8" }}>
      <section className="bg-[#111] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: ACCENT }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: ACCENT }}>
              Movement V3 · เช็กความพร้อม
            </span>
          </div>
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                <span style={{ color: ACCENT }}>เช็กความพร้อม</span> ก่อนเพิ่มความยาก
              </h1>
              <p className="text-white/40 text-sm mt-2 leading-relaxed">
                ใช้คำถามสั้น ๆ ช่วยดูว่าควรกลับไปปูพื้นก่อน หรือเริ่มขยับความยากและปริมาณการฝึกต่อได้แล้ว
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black" style={{ color: ACCENT }}>{READINESS_PROFILES.length}</p>
              <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">ชุดเช็ก</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${ACCENT}20`, color: ACCENT }}>
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-black text-gray-900">ใช้อย่างไร</p>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
              ไม่ต้องมองว่าเป็นการสอบผ่านหรือไม่ผ่าน ให้มองว่าอะไรคือจุดที่ยังติดอยู่ แล้วค่อยย้อนกลับไปฝึกท่าหรือเส้นทางที่ตรงกับจุดนั้น
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {READINESS_PROFILES.map(profile => (
            <Link key={profile.slug} href={`/readiness/${profile.slug}`} className="group rounded-xl border border-gray-200 bg-white p-5 hover:border-gray-300 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-gray-900">{profile.title}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{profile.description}</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-3">{profile.keyDemands.join(" · ")}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
              </div>
            </Link>
          ))}
        </div>

        <ReadinessLinksPanel workoutId="26.1" />
      </div>
    </div>
  );
}
