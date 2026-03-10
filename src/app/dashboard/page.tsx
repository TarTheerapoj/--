import { Card, CardContent } from "@/components/ui/card";
import { SUMMARY_STATS } from "@/lib/data/workouts";
import ParticipationChart from "@/components/charts/ParticipationChart";
import AffiliateGrowthChart from "@/components/charts/AffiliateGrowthChart";
import OpenRegistrationChart from "@/components/charts/OpenRegistrationChart";

const latest = SUMMARY_STATS.participationByYear[SUMMARY_STATS.participationByYear.length - 1];
const prev   = SUMMARY_STATS.participationByYear[SUMMARY_STATS.participationByYear.length - 2];
const athleteGrowthPct = Math.round(((latest.total - prev.total) / prev.total) * 100);
const menPct   = Math.round((latest.men   / latest.total) * 100);
const womenPct = Math.round((latest.women / latest.total) * 100);

export default function DashboardPage() {
  return (
    <div className="space-y-0">
      {/* ── DARK HERO ── */}
      <section className="bg-[#111] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: "#9BEC00" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: "#9BEC00" }}>CrossFit Open 2026 · Thailand</span>
            <div className="h-px w-8" style={{ backgroundColor: "#9BEC00", opacity: 0.4 }} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            ภาพรวมการแข่งขัน <span style={{ color: "#9BEC00" }}>CrossFit Open Thailand</span>
          </h1>
          <p className="text-white/50 text-sm mt-2 max-w-2xl">
            วิเคราะห์ผลการแข่งขัน CrossFit Open 2026 ของนักกีฬาไทย แยกตาม Division อย่างครอบคลุม
          </p>
        </div>

        {/* ── KPI STRIP (dark, inside hero) ── */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10">
              {[
                { v: SUMMARY_STATS.totalAthletes, unit: "คน",  label: "นักกีฬาทั้งหมด",   badge: `+${athleteGrowthPct}% vs 2025`, badgeColor: "#9BEC00", badgeText: "#111" },
                { v: latest.men,                  unit: "คน",  label: "ชาย (2026)",        badge: `${menPct}%`,                   badgeColor: "#3b82f6", badgeText: "#fff" },
                { v: latest.women,                unit: "คน",  label: "หญิง (2026)",       badge: `${womenPct}%`,                 badgeColor: "#f472b6", badgeText: "#fff" },
                { v: SUMMARY_STATS.totalAffiliates, unit: "แห่ง", label: "Affiliates",    badge: "+118% ใน 4 ปี",                badgeColor: "#22c55e", badgeText: "#fff" },
              ].map(({ v, unit, label, badge, badgeColor, badgeText }) => (
                <div key={label} className="py-6 px-4 sm:px-6 flex flex-col gap-1">
                  <p className="text-[10px] font-black tracking-widest uppercase text-white/40">{label}</p>
                  <p className="text-3xl sm:text-4xl font-black tabular-nums text-white leading-none">
                    {v}<span className="text-sm font-normal text-white/40 ml-1">{unit}</span>
                  </p>
                  <span className="self-start mt-1 text-[10px] font-black px-2 py-0.5 rounded" style={{ backgroundColor: badgeColor, color: badgeText }}>{badge}</span>
                </div>
              ))}
            </div>
            {/* Men/Women full-width bar */}
            <div className="flex w-full h-1 overflow-hidden">
              <div style={{ width: `${menPct}%`,   backgroundColor: "#3b82f6" }} />
              <div style={{ width: `${womenPct}%`, backgroundColor: "#f472b6" }} />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 py-8">

        {/* ── CHARTS SIDE BY SIDE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Participation — takes 2/3 */}
          <Card className="lg:col-span-2 border-border/50 bg-card">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">การเติบโตของผู้เข้าร่วม</p>
                  <p className="text-sm font-bold mt-0.5">2017–2026 · แยกตามเพศหรือดูรวม</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{SUMMARY_STATS.participationByYear[0].total} คน → {latest.total} คน · ผู้เข้าร่วมทั้งหมด</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-green-500">+{Math.round(((latest.total - SUMMARY_STATS.participationByYear[0].total) / SUMMARY_STATS.participationByYear[0].total) * 100)}%</p>
                  <p className="text-[10px] text-muted-foreground">2017→2026</p>
                </div>
              </div>
              <ParticipationChart data={SUMMARY_STATS.participationByYear} />
            </CardContent>
          </Card>

          {/* Affiliate — takes 1/3 */}
          <Card className="border-border/50 bg-card">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">CrossFit Affiliates</p>
                  <p className="text-sm font-bold mt-0.5">2022–2026</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-green-500">+118%</p>
                  <p className="text-[10px] text-muted-foreground">ใน 4 ปี</p>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mb-3">11 แห่ง → {SUMMARY_STATS.totalAffiliates} แห่ง · ไม่มีปีถอยหลัง</p>
              <AffiliateGrowthChart />
              <div className="mt-3 grid grid-cols-5 gap-1">
                {[
                  { year: "2022", v: 11 },
                  { year: "2023", v: 13 },
                  { year: "2024", v: 16 },
                  { year: "2025", v: 19 },
                  { year: "2026", v: 24 },
                ].map(({ year, v }) => (
                  <div key={year} className="text-center">
                    <p className="text-xs font-black">{v}</p>
                    <p className="text-[9px] text-muted-foreground">{year}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>


      </div>

      {/* ─── INSIGHT SECTION ─────────────────────────────────── */}
      <section className="bg-[#111] text-white">
        <div className="absolute left-0 right-0 h-px" style={{ backgroundColor: "#9BEC00", opacity: 0.15 }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">

          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: "#9BEC00" }}>Insight</span>
            <div className="h-px flex-1 max-w-12" style={{ backgroundColor: "#9BEC00", opacity: 0.3 }} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            สัญญาณใหม่ของ <span style={{ color: "#9BEC00" }}>CrossFit Thailand</span>
          </h2>
          <p className="text-white/40 text-sm mb-8">
            CrossFit ไทยอาจกำลังเคลื่อนจากกีฬาของคนวงใน ไปสู่ตลาดเฉพาะทางที่มีแรงส่งมากขึ้น คำถามสำคัญจึงไม่ใช่โตหรือไม่ แต่โตแบบไหน และยั่งยืนเพียงใด
          </p>

          {/* Author */}
          <div className="flex items-center gap-3 mb-10 pb-8 border-b border-white/10">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0" style={{ backgroundColor: "#9BEC00", color: "#111" }}>ต้า</div>
            <div>
              <p className="text-sm font-bold text-white">ต้า ธีระพจน์ งามเลิศไพโรจน์</p>
              <p className="text-xs text-white/40">Certified CrossFit Lv.2 · Coach at IAOT CrossFit, Ontrack Station</p>
            </div>
          </div>

          {/* Article body + charts */}
          <div className="grid lg:grid-cols-5 gap-10">

            {/* Left: article text */}
            <div className="lg:col-span-3 space-y-5 text-[15px] text-white/75 leading-relaxed">
              <p>สำหรับตัวผม กีฬา CrossFit เติบโตจากคอมมูนิตี้มากกว่าจากแมสมีเดีย จุดเปลี่ยนสำคัญมักไม่ใช่วันที่คนพูดถึงมันเยอะขึ้น แต่คือวันที่ <span className="text-white font-semibold">&quot;มีคนลงแข่งขัน&quot;</span> และ <span className="text-white font-semibold">&quot;พบเจอสถานที่ฝึกซ้อม งานแข่งขัน&quot;</span> เริ่มขยับเพิ่มขึ้นพร้อมกันอย่างมีนัยสำคัญ</p>

              <p>ในเชิงข้อมูลตรงๆ กราฟแรกบอกว่า จำนวนผู้ลงทะเบียน CrossFit Open ในไทยเพิ่มจาก <span className="font-bold" style={{ color: "#9BEC00" }}>170 คนในปี 2017 เป็น 604 คนในปี 2026</span> แต่เส้นทางนี้ไม่ได้เป็นเส้นตรงแบบสวยงามตลอดทาง ปี 2018 เคยขึ้นไปถึง 269 ก่อนจะถอยลงในปี 2019 และลงลึกสุดที่ 146 ในปี 2020 จากนั้นค่อยๆ ฟื้นตัวในช่วง 2021–2024 ก่อนจะ<span className="text-white font-semibold">เร่งชันอย่างชัดเจน</span>ในปี 2025 ที่ 360 และกระโดดอีกครั้งในปี 2026 ที่ 604</p>

              <p>กราฟที่สองบอกอีกเรื่องหนึ่ง แต่สำคัญไม่แพ้กัน: จำนวน CrossFit affiliate ในไทยเพิ่มจาก <span className="font-bold" style={{ color: "#9BEC00" }}>11 แห่งในปี 2022 เป็น 24 แห่งในปี 2026</span> หรือเท่ากับเพิ่มขึ้น 100% ในเวลาเพียงสี่ปี และที่สำคัญคือ<span className="text-white font-semibold">ไม่มีปีไหนติดลบเลย</span> เส้นนี้ไม่หวือหวาเท่าจำนวนคนลง Open แต่มีคุณค่ามากในฐานะ<span className="text-white font-semibold">สัญญาณเชิงโครงสร้าง</span></p>

              <p>ในปี 2025–2026 คือภาพอีกแบบหนึ่งเลย นี่ไม่ใช่การไต่ขึ้นแบบช้าๆ ตามปกติอีกแล้ว แต่มีลักษณะของ <span className="text-white font-semibold">step-change</span> หรือการเปลี่ยนระดับของตลาด ตัวเลขจาก 232 ไป 360 และ 604 ภายในสองปี ไม่ใช่แค่การฟื้นหลังโรคระบาดในเชิงพื้นฐาน แต่บอกว่าความสามารถในการดึงคนเข้าสู่ CrossFit Open เริ่มขยายตัวเร็วกว่าจากเดิมในอดีต</p>

              {/* Pull quote */}
              <blockquote className="border-l-2 pl-4 py-1 my-6" style={{ borderColor: "#9BEC00" }}>
                <p className="text-base font-semibold text-white leading-snug">&quot;ไทยกำลังเห็นทั้ง participation และ infrastructure โตพร้อมกัน แต่ด้วยความเร็วไม่เท่ากัน — และนั่นคือสัญญาณที่แข็งแรง&quot;</p>
              </blockquote>

              <p>ในเชิงธุรกิจกีฬา จำนวนคนลง Open กับจำนวน affiliate ไม่ใช่ตัวเลขชนิดเดียวกัน ตัวแรกสะท้อน <span className="text-white font-semibold">participation demand</span> ตัวหลังสะท้อน <span className="text-white font-semibold">infrastructure</span> ตลาดกีฬาใดก็ตามที่มีแต่ demand แต่ไม่มี infrastructure รองรับ มักโตได้ไม่นาน</p>

              <p>สิ่งที่กราฟกำลังบอกจริงๆ คือ CrossFit ไทยอาจกำลังโตแบบมีฐานมากขึ้นกว่าเดิม — ไม่ใช่โตจากกระแสอย่างเดียว ไม่ใช่โตจากภาพลักษณ์อย่างเดียว แต่<span className="text-white font-semibold">โตจากการที่ทั้ง participation และ infrastructure เริ่มส่งสัญญาณไปในทิศทางเดียวกัน</span></p>
            </div>

            {/* Right: charts */}
            <div className="lg:col-span-2 space-y-8">

              {/* Chart 1: Open registration */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: "#9BEC00" }}>CrossFit Open Thailand</p>
                <p className="text-sm font-bold text-white mb-1">ผู้ลงทะเบียน 2017–2026</p>
                <p className="text-[11px] text-white/40 mb-4">170 คน → 604 คน · +255% overall · +160% ตั้งแต่ 2024</p>
                <OpenRegistrationChart />
                <div className="flex flex-wrap gap-3 mt-3">
                  <span className="flex items-center gap-1.5 text-[11px] text-white/40">
                    <span className="w-3 h-px bg-red-400 inline-block opacity-60" />COVID-19 (2020)
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] text-white/40">
                    <span className="w-3 h-px bg-yellow-400 inline-block opacity-60" />Physical: 100 (2023, 2024)
                  </span>
                </div>
              </div>

              {/* Chart 2: Affiliate growth */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: "#9BEC00" }}>CrossFit Affiliates Thailand</p>
                <p className="text-sm font-bold text-white mb-1">จำนวน Affiliate 2022–2026</p>
                <p className="text-[11px] text-white/40 mb-4">11 แห่ง → 24 แห่ง · +118% · ไม่มีปีถอยหลัง</p>
                <AffiliateGrowthChart />
              </div>

              {/* Key stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { v: "+255%", l: "Open registrations\n2017→2026" },
                  { v: "+118%", l: "Affiliate growth\n2022→2026" },
                  { v: "×2.6", l: "เร็วกว่า 2024\nใน 2 ปีล่าสุด" },
                  { v: "0", l: "ปีที่ affiliate\nถอยหลัง" },
                ].map(({ v, l }) => (
                  <div key={v+l} className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="text-xl font-black" style={{ color: "#9BEC00" }}>{v}</p>
                    <p className="text-[11px] text-white/40 mt-0.5 whitespace-pre-line leading-tight">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
