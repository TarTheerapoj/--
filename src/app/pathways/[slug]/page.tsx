import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { BodyDemandBadges, PathwayLadder } from "@/components/movements/LearningUI";
import { PathwayQuickActions } from "@/components/V3Widgets";
import { getWorkoutById } from "@/lib/data/workouts";
import { getPathwayBySlug, getPathwayMovements, SKILL_PATHWAYS } from "@/lib/pathways";

export function generateStaticParams() {
  return SKILL_PATHWAYS.map(pathway => ({ slug: pathway.slug }));
}

export default async function PathwayDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pathway = getPathwayBySlug(slug);

  if (!pathway) notFound();

  const movements = getPathwayMovements(pathway);
  const relatedWorkouts = pathway.workoutIds
    .map(id => getWorkoutById(id))
    .filter((workout): workout is NonNullable<ReturnType<typeof getWorkoutById>> => !!workout);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f6f8" }}>
      <section className="bg-[#111] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: pathway.accent }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-bold uppercase tracking-widest mb-5 flex-wrap">
            <Link href="/movements" className="hover:text-white/70 transition-colors">คลังท่า</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/pathways" className="hover:text-white/70 transition-colors">เส้นทางฝึก</Link>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: pathway.accent }}>{pathway.title}</span>
          </div>
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="max-w-3xl">
              <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-2" style={{ color: pathway.accent }}>
                เส้นทางฝึก
              </p>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                {pathway.title}
              </h1>
              <p className="text-white/40 text-sm mt-2 leading-relaxed">{pathway.description}</p>
              <div className="mt-4">
                <BodyDemandBadges demands={pathway.focus} />
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-right">
                <p className="text-2xl font-black" style={{ color: pathway.accent }}>{movements.length}</p>
                <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">ขั้น</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">เหมาะกับใคร</p>
            <p className="text-sm text-gray-700 leading-relaxed">{pathway.whoItsFor}</p>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">ลำดับการฝึก</p>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <PathwayLadder pathway={pathway} />
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">ทางลัดหน้านี้</p>
            <PathwayQuickActions slug={pathway.slug} />
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">โฟกัสของเส้นทางนี้</p>
            <ul className="space-y-2">
              {pathway.focus.map(item => (
                <li key={item} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: pathway.accent }} />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {relatedWorkouts.length > 0 && (
            <section className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">เวิร์กเอาท์ที่เกี่ยวข้อง</p>
              <div className="space-y-2">
                {relatedWorkouts.map(workout => (
                  <Link
                    key={workout.id}
                    href="/workouts"
                    className="group flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 hover:bg-white hover:border-gray-300 transition-all"
                  >
                    <div>
                      <p className="text-sm font-black text-gray-800">Open {workout.name}</p>
                      <p className="text-[11px] text-gray-500">{workout.type} · {workout.movements.slice(0, 2).join(" · ")}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">สรุปลำดับท่า</p>
            <div className="space-y-2">
              {movements.map((movement, index) => (
                <Link
                  key={movement.slug}
                  href={`/movements/${movement.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                      style={{ backgroundColor: `${pathway.accent}15`, color: pathway.accent }}
                    >
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-gray-800 truncate">{movement.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
