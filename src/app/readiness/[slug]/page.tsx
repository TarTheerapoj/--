import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, Target } from "lucide-react";
import { ReadinessEvaluator } from "@/components/V3Widgets";
import { READINESS_PROFILES, getReadinessProfileBySlug } from "@/lib/v3";

const ACCENT = "#9BEC00";

export function generateStaticParams() {
  return READINESS_PROFILES.map(profile => ({ slug: profile.slug }));
}

export default async function ReadinessDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = getReadinessProfileBySlug(slug);

  if (!profile) notFound();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f6f8" }}>
      <section className="bg-[#111] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: ACCENT }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-bold uppercase tracking-widest mb-5 flex-wrap">
            <Link href="/readiness" className="hover:text-white/70 transition-colors">เช็กความพร้อม</Link>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: ACCENT }}>{profile.title}</span>
          </div>
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4" style={{ color: ACCENT }} />
                <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: ACCENT }}>
                  เช็กตัวเอง
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">{profile.title}</h1>
              <p className="text-white/40 text-sm mt-2 leading-relaxed">{profile.description}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black" style={{ color: ACCENT }}>{profile.questions.length}</p>
              <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">ข้อ</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="rounded-xl border border-[#9BEC0030] bg-[#9BEC0012] p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">มุมที่ควรรู้ก่อน</p>
          <p className="text-sm text-gray-700 leading-relaxed">{profile.openInsight}</p>
        </div>

        <ReadinessEvaluator profileSlug={profile.slug} />

        <div className="flex justify-start">
          <Link href="/recommend" className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-black text-gray-600 hover:text-gray-900 hover:border-gray-300">
            กลับไปหน้าจุดเริ่มต้น
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
