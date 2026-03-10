import {
  getMovementBySlug,
  type DifficultyLevel,
  type Movement,
  type MovementCatalogEntry,
} from "@/lib/data/movements";

export type BodyDemand =
  | "pulling"
  | "overhead"
  | "core"
  | "grip"
  | "coordination"
  | "engine"
  | "squat"
  | "hanging";

export type UserStateKey = "cannotDoYet" | "canDoBasic" | "buildPerformance";

export interface UserStateGuidance {
  summary: string;
  priorities: string[];
  blockers?: string[];
  nextMovementSlugs?: string[];
}

export interface MovementLearningProfile {
  bodyDemands?: BodyDemand[];
  userStates?: Partial<Record<UserStateKey, UserStateGuidance>>;
}

const MOVEMENT_LEARNING_PROFILES: Record<string, MovementLearningProfile> = {
  "air-squat": {
    bodyDemands: ["squat", "coordination", "core"],
    userStates: {
      cannotDoYet: {
        summary: "เริ่มจาก squat ที่ depth สม่ำเสมอและ balance ดี ก่อนคิดเรื่อง speed หรือ volume",
        priorities: [
          "ใช้ box squat หรือ counterbalance ช่วยให้ลงลึกได้จริง",
          "ฝึกให้เข่าไปตามแนวนิ้วเท้าและส้นเท้าไม่ลอย",
          "สร้าง 10–20 reps ที่ form คงที่ก่อน",
        ],
        blockers: ["ankle dorsiflexion จำกัด", "ลงลึกแล้วเสีย balance"],
        nextMovementSlugs: ["goblet-squat", "front-squat"],
      },
      canDoBasic: {
        summary: "ตอนนี้โฟกัสคุณภาพ reps และความทนทานของ squat pattern",
        priorities: [
          "คุม tempo ตอนลงไม่ให้ collapse ที่ก้นล่างสุด",
          "เพิ่ม volume แบบไม่เสียทรงใน workout ยาว",
          "เริ่มเชื่อม squat เข้ากับ wall ball และ burpee",
        ],
        blockers: ["เข่าพับเข้าด้านในเมื่อเหนื่อย", "อกตกเมื่อทำ reps ต่อเนื่อง"],
        nextMovementSlugs: ["front-squat", "wall-ball", "thruster"],
      },
      buildPerformance: {
        summary: "ใช้ air squat เป็น base ของ squat endurance, cycling, และ transition efficiency",
        priorities: [
          "ฝึก breathing rhythm ใน rep สูง",
          "พัฒนา speed ตอน rebound โดยยังคุมตำแหน่งได้",
          "เชื่อมไปสู่ front squat, wall ball, thruster อย่างมีคุณภาพ",
        ],
        blockers: ["รีบเกินจนเสีย depth", "fatigue ทำให้ chest ตกเร็ว"],
        nextMovementSlugs: ["wall-ball", "thruster"],
      },
    },
  },
  "front-squat": {
    bodyDemands: ["squat", "core", "coordination"],
    userStates: {
      cannotDoYet: {
        summary: "ถ้ายัง rack position ไม่ดีหรือยืนขึ้นจากก้นไม่ได้ ให้สร้างฐานก่อน",
        priorities: [
          "ใช้ goblet squat เพื่อฝึก torso upright",
          "พัฒนา front rack mobility และ bracing",
          "เริ่มจากน้ำหนักที่ลงลึกได้จริง",
        ],
        blockers: ["front rack ตึง", "ลุกขึ้นจากก้นแล้วอกตก"],
        nextMovementSlugs: ["goblet-squat", "air-squat"],
      },
      canDoBasic: {
        summary: "โฟกัส consistency ของ rack position และการออกแรงจากก้นหลุม",
        priorities: [
          "หยุดค้าง 1–2 วินาทีที่ bottom position เป็นบางเซ็ต",
          "ฝึกให้ข้อศอกสูงตลอด rep",
          "เชื่อมต่อกับ clean receiving position",
        ],
        blockers: ["ข้อศอกตกเมื่อหนักขึ้น", "เข่ากับสะโพกออกจากก้นไม่พร้อมกัน"],
        nextMovementSlugs: ["power-clean", "squat-clean", "thruster"],
      },
      buildPerformance: {
        summary: "ตอนนี้พัฒนาความสามารถในการรับบาร์และยืนขึ้นใน fatigue",
        priorities: [
          "สร้าง squat recovery หลัง clean หนักหรือ rep สูง",
          "พัฒนา speed ออกจาก bottom position",
          "ใช้ front squat เพื่อเพิ่ม capacity ของ thruster และ wall ball",
        ],
        blockers: ["เสีย brace เมื่อเหนื่อย", "collapse ตอน recovery rep สูง"],
        nextMovementSlugs: ["squat-clean", "thruster"],
      },
    },
  },
  "wall-ball": {
    bodyDemands: ["squat", "overhead", "engine", "coordination"],
    userStates: {
      cannotDoYet: {
        summary: "เริ่มจาก squat mechanics และ timing การส่งลูกขึ้นเป้าให้ลื่นก่อน",
        priorities: [
          "ใช้ลูกเบาหรือ target ต่ำลงถ้ายังไม่คุม trajectory",
          "ทำ set สั้น 5–10 reps เพื่อจัด rhythm",
          "ซ้อมรับลูกใกล้ตัวและลงสู่ squat ทันที",
        ],
        blockers: ["ขว้างลูกสูงไม่สม่ำเสมอ", "รับลูกแล้วเสีย balance"],
        nextMovementSlugs: ["air-squat", "thruster"],
      },
      canDoBasic: {
        summary: "ตอนนี้สิ่งสำคัญคือ breathing, cycle rate, และการไม่เสียท่าจากความเหนื่อย",
        priorities: [
          "ซ้อม set 15–25 reps โดยรักษา target line เดิม",
          "ฝึก catch low และรีบกลับลง squat",
          "หา rep scheme ที่ไม่พังเร็วใน workout",
        ],
        blockers: ["หัวใจขึ้นเร็วเกิน", "target เริ่มเพี้ยนเมื่อ reps สูง"],
        nextMovementSlugs: ["thruster", "box-jump-over"],
      },
      buildPerformance: {
        summary: "พัฒนาความสามารถในการคง pace และลด rest time ใน Open-style workouts",
        priorities: [
          "ทำ unbroken sets ให้นานขึ้นโดยไม่เสีย target",
          "ฝึก transition จาก wall ball ไป movement ถัดไป",
          "บริหารแขนและขาร่วมกันไม่ให้ fatigue ฝั่งใดพังก่อน",
        ],
        blockers: ["ยืนพักนานเกินในแต่ละเซ็ต", "แขนล้าเร็วจากการขว้างด้วยแขนมากเกินไป"],
        nextMovementSlugs: ["thruster", "burpee"],
      },
    },
  },
  "burpee": {
    bodyDemands: ["engine", "coordination", "core"],
    userStates: {
      cannotDoYet: {
        summary: "เริ่มจาก burpee ที่ flow ต่อเนื่องและลุกขึ้นได้ปลอดภัยก่อน",
        priorities: [
          "ลด range หรือทำ step-back/step-up ก่อนถ้ากระแทกมากเกินไป",
          "ซ้อมวางมือ-ลงพื้น-ลุกขึ้นเป็นจังหวะเดิมทุก rep",
          "สร้าง sets สั้น ๆ โดยไม่หยุดหายใจทุก rep",
        ],
        blockers: ["ลุกขึ้นแล้วมึนหรือหอบทันที", "เสียทรงตอนลงพื้น"],
        nextMovementSlugs: ["air-squat", "push-up"],
      },
      canDoBasic: {
        summary: "ตอนนี้ต้องทำให้ burpee ประหยัดแรงและคง pace ได้นานขึ้น",
        priorities: [
          "หา cadence ที่รักษาได้ 30–60 reps",
          "ลดท่าทางฟุ่มเฟือยตอนกระโดดขึ้น",
          "เชื่อม burpee เข้ากับ box jump หรือ barbell transition",
        ],
        blockers: ["pace ตกแรงหลัง 10–15 reps", "ยืนตรงนานเกินในทุก rep"],
        nextMovementSlugs: ["box-jump-over", "bar-facing-burpee"],
      },
      buildPerformance: {
        summary: "พัฒนาการฟื้นตัวและ turnover เพื่อให้ burpee ไม่ใช่ตัวตัดเกมใน workout",
        priorities: [
          "ฝึก breathing pattern ระหว่างลง-ขึ้น",
          "ลด ground contact time โดยยังคุม quality ได้",
          "ซ้อม burpee ภายใต้ fatigue จาก movement อื่น",
        ],
        blockers: ["หัวใจไม่ลงหลัง movement เร็ว", "ขาไหม้จนกระโดดช้าลงเรื่อย ๆ"],
        nextMovementSlugs: ["box-jump-over", "wall-ball"],
      },
    },
  },
  "strict-pull-up": {
    bodyDemands: ["pulling", "grip", "core"],
    userStates: {
      cannotDoYet: {
        summary: "ถ้ายังดึงคางข้ามบาร์ไม่ได้ ให้สร้าง pulling strength จริงก่อน",
        priorities: [
          "ใช้ ring row หรือ jumping negative เพื่อสร้างแรงดึงพื้นฐาน",
          "ฝึก hollow body และ scapular control ทุกครั้ง",
          "สะสม reps คุณภาพสูงแบบไม่ถึง failure ทุกเซ็ต",
        ],
        blockers: ["lat และ grip ยังไม่พอ", "core ไม่แข็งจนเสีย hollow position"],
        nextMovementSlugs: ["ring-row"],
      },
      canDoBasic: {
        summary: "ตอนนี้ต้องเพิ่มจำนวน reps โดยยังคุม hollow และ tempo ได้",
        priorities: [
          "ทำ sets ย่อยหลายเซ็ตแทนการฝืนจนฟอร์มพัง",
          "ซ้อม strict volume ก่อนเพิ่ม kipping",
          "รักษา range เต็มจาก dead hang ถึงคางข้ามบาร์",
        ],
        blockers: ["รีบกระตุกตัวช่วย rep", "reps หลัง ๆ ขาด range"],
        nextMovementSlugs: ["kipping-pull-up", "chest-to-bar"],
      },
      buildPerformance: {
        summary: "strict strength ที่ดีจะทำให้ kipping และ chest-to-bar มีคุณภาพและปลอดภัยขึ้น",
        priorities: [
          "เพิ่ม strict capacity เพื่อรองรับ gymnastics volume",
          "ใช้ weighted or tempo work บางวันเพื่อสร้าง headroom",
          "โอนถ่ายแรงไปสู่ kipping แบบไม่เสีย mechanics",
        ],
        blockers: ["strict volume ต่ำเกินไปเมื่อเทียบกับ kipping ambition", "กริปล้าเร็วจนเสียคุณภาพ"],
        nextMovementSlugs: ["kipping-pull-up", "chest-to-bar", "kipping-muscle-up"],
      },
    },
  },
  "kipping-pull-up": {
    bodyDemands: ["pulling", "coordination", "grip", "hanging"],
    userStates: {
      cannotDoYet: {
        summary: "ถ้ายัง kip แล้วไม่ส่งแรงขึ้นบาร์ได้ ให้ย้อนกลับไปสร้าง strict และ swing control",
        priorities: [
          "แยกฝึก hollow-arch rhythm ก่อนรวมเป็น rep",
          "มี strict pull-up พื้นฐานก่อนเพิ่ม volume kipping",
          "เริ่มจาก singles หรือ small sets ที่ควบคุมได้",
        ],
        blockers: ["kip ไม่เชื่อมกับแรงดึง", "เสีย shoulder position ตอน swing"],
        nextMovementSlugs: ["strict-pull-up", "ring-row"],
      },
      canDoBasic: {
        summary: "ตอนนี้โฟกัส efficiency ของ kip และการรักษาชุด reps โดยไม่หลุด rhythm",
        priorities: [
          "ใช้ smaller sets เพื่อรักษา timing",
          "ฝึกกลับสู่ hollow หลังคางข้ามบาร์ทันที",
          "เพิ่ม volume อย่างค่อยเป็นค่อยไปก่อน chase unbroken ใหญ่",
        ],
        blockers: ["kip ใหญ่เกินจำเป็น", "หลุด rhythm เมื่อเริ่มเหนื่อย"],
        nextMovementSlugs: ["chest-to-bar", "toes-to-bar"],
      },
      buildPerformance: {
        summary: "พัฒนาความประหยัดแรงและ consistency เพื่อใช้ใน Open-style volume ได้จริง",
        priorities: [
          "ลด grip fatigue ด้วย swing ที่สั้นและแม่นยำ",
          "ซ้อม transition เข้า-ออกบาร์กับ movement อื่น",
          "สร้าง chest-to-bar readiness จาก pull timing ที่ดี",
        ],
        blockers: ["burn out grip เร็ว", "ดึงด้วยแขนมากเกินจน kip ไม่ช่วย"],
        nextMovementSlugs: ["chest-to-bar", "kipping-muscle-up"],
      },
    },
  },
  "chest-to-bar": {
    bodyDemands: ["pulling", "coordination", "grip", "hanging"],
    userStates: {
      cannotDoYet: {
        summary: "ถ้ายังดึงได้แค่คางข้ามบาร์ ให้เพิ่ม line of pull และ hip drive ก่อน",
        priorities: [
          "สร้าง kipping pull-up ที่สม่ำเสมอก่อน",
          "ฝึก chest-up timing และ elbow drive ลงหลัง",
          "ใช้ small sets หรือ banded drills เพื่อหาตำแหน่งแตะบาร์",
        ],
        blockers: ["kip ไม่ส่งตัวสูงพอ", "ดึงแขนเร็วเกินจนเสียจังหวะ"],
        nextMovementSlugs: ["kipping-pull-up", "strict-pull-up"],
      },
      canDoBasic: {
        summary: "ตอนนี้โฟกัส volume tolerance และการแตะบาร์ตำแหน่งเดิมทุก rep",
        priorities: [
          "จัด set ให้รักษา kip quality ได้",
          "ฝึกเชื่อม 3–6 reps แบบไม่เสีย line",
          "พัฒนาความอึดของ grip และ lats ใน volume ปานกลาง",
        ],
        blockers: ["แตะต่ำลงเรื่อย ๆ เมื่อเหนื่อย", "kip เริ่มใหญ่และเสียจังหวะ"],
        nextMovementSlugs: ["kipping-muscle-up"],
      },
      buildPerformance: {
        summary: "ใช้ chest-to-bar เป็นสะพานไปสู่ higher-skill gymnastics และ workout readiness",
        priorities: [
          "พัฒนา cycle rate โดยไม่เสียมาตรฐาน rep",
          "ซ้อมภายใต้ fatigue จาก lunges, dumbbell, หรือ barbell work",
          "ยกระดับ pulling capacity ไปสู่ muscle-up progression",
        ],
        blockers: ["grip fail ก่อน engine", "kip เริ่มแตกเมื่อเข้าเซ็ตใหญ่"],
        nextMovementSlugs: ["kipping-muscle-up", "rope-climb"],
      },
    },
  },
  "toes-to-bar": {
    bodyDemands: ["core", "hanging", "coordination", "grip"],
    userStates: {
      cannotDoYet: {
        summary: "ถ้ายังแตะบาร์ไม่ได้ ให้สร้าง hollow compression และ hanging control ก่อน",
        priorities: [
          "เริ่มจาก hollow hold/rock และ hanging knee raise pattern",
          "ฝึกให้ไหล่ active ใน hanging position",
          "ทำ singles ที่แตะมาตรฐานก่อนค่อยเพิ่ม volume",
        ],
        blockers: ["hip flexor และ core compression ยังไม่พอ", "เสีย swing control ตอนยกขา"],
        nextMovementSlugs: ["hollow-rock", "knees-to-elbows", "kipping-pull-up"],
      },
      canDoBasic: {
        summary: "ตอนนี้เน้น rhythm และการกลับสู่ hollow เพื่อรักษา rep ต่อเนื่อง",
        priorities: [
          "แบ่งเป็นเซ็ตเล็กเพื่อไม่ให้ kip พัง",
          "ฝึก touch-and-return ที่สั้นและประหยัดแรง",
          "สร้าง grip capacity สำหรับ hanging volume",
        ],
        blockers: ["โยนขามากเกินจำเป็น", "แตะบาร์แล้วปล่อยตัวเสีย control"],
        nextMovementSlugs: ["strict-toes-to-bar"],
      },
      buildPerformance: {
        summary: "พัฒนาการคง pace และ transition under fatigue เพื่อให้ TTB ไม่เป็นจุดแตกใน workout",
        priorities: [
          "หา rep scheme ที่เหมาะกับ grip ของตัวเอง",
          "ฝึก TTB หลัง pulling หรือ dumbbell work",
          "ลด swing ที่สูญเสียพลังงานเกินจำเป็น",
        ],
        blockers: ["grip หมดก่อน core", "rhythm หลุดหลังแต่ละ break"],
        nextMovementSlugs: ["strict-toes-to-bar", "kipping-muscle-up"],
      },
    },
  },
  "handstand-push-up": {
    bodyDemands: ["overhead", "core", "coordination"],
    userStates: {
      cannotDoYet: {
        summary: "ถ้ายัง inverted press ไม่ได้ ให้สร้างฐาน pressing และ line control ก่อน",
        priorities: [
          "พัฒนา push-up strength และ wall-facing holds",
          "ฝึก kip เฉพาะเมื่อ strict foundation พร้อมแล้ว",
          "คุม head position และ hand placement ให้สม่ำเสมอ",
        ],
        blockers: ["overhead lockout ยังไม่แข็งแรง", "midline ไม่คงที่ตอนกลับหัว"],
        nextMovementSlugs: ["push-up", "handstand-hold"],
      },
      canDoBasic: {
        summary: "ตอนนี้โฟกัสมาตรฐาน rep, range, และ shoulder stamina",
        priorities: [
          "ซ้อม sets เล็กที่ range เต็ม",
          "รักษา head triangle เดิมทุก rep",
          "สร้าง strict or controlled reps ก่อน chase kipping volume",
        ],
        blockers: ["range ไม่คงที่", "คอและไหล่ล้าเร็วเกิน"],
        nextMovementSlugs: ["kipping-hspu"],
      },
      buildPerformance: {
        summary: "พัฒนา efficiency, cycling, และ overhead durability สำหรับ Open volume",
        priorities: [
          "ฝึก kip timing หรือ deficit progression ตามเป้าหมาย",
          "จัด rep scheme ให้ไม่แตกตั้งแต่ต้น workout",
          "สร้าง overhead stamina ร่วมกับ barbell/DB work",
        ],
        blockers: ["spike heart rate หลังแต่ละเซ็ต", "ไหล่ล้าเร็วเมื่ออยู่ภายใต้ fatigue"],
        nextMovementSlugs: ["kipping-hspu", "push-jerk"],
      },
    },
  },
  "double-under": {
    bodyDemands: ["coordination", "engine"],
    userStates: {
      cannotDoYet: {
        summary: "เริ่มจาก single-under ที่ smooth และหา rope timing ที่สม่ำเสมอ",
        priorities: [
          "ฝึก jump ต่ำแต่คุมจังหวะได้",
          "ใช้ wrists หมุนเชือก ไม่ใช่แกว่งทั้งแขน",
          "เริ่มจาก double-under single reps แล้วค่อยต่อเป็น sets",
        ],
        blockers: ["rope length ไม่เหมาะ", "กระโดดสูงเกินหรือลงหนักเกิน"],
        nextMovementSlugs: ["single-under"],
      },
      canDoBasic: {
        summary: "ตอนนี้เน้น consistency และลด miss rate ในชุด reps ต่อเนื่อง",
        priorities: [
          "ฝึก sets 10–30 reps โดยไม่เร่งมือเกิน",
          "คุม posture ตรง ไม่ถีบเข่าไปด้านหน้า",
          "ซ้อม reset rope ให้กลับมาเร็วหลัง miss",
        ],
        blockers: ["รีบเร่งจนเชือกตัดปลายเท้า", "หายใจไม่ทันเมื่อ set ยาว"],
        nextMovementSlugs: ["crossovers"],
      },
      buildPerformance: {
        summary: "พัฒนา efficiency และการคง pace ใน workout ที่มี heart rate สูง",
        priorities: [
          "ซ้อม unbroken sets ที่ยาวขึ้นโดยไม่กระโดดสูงเกิน",
          "ลด recovery time หลัง miss หนึ่งครั้ง",
          "เชื่อม DU เข้ากับ burpee, row, wall ball ใน metcon",
        ],
        blockers: ["trip แล้วเสียเวลานาน", "เหนื่อยแล้วหมุนเชือกจากไหล่มากเกิน"],
        nextMovementSlugs: ["crossovers", "burpee"],
      },
    },
  },
  "power-clean": {
    bodyDemands: ["coordination", "core", "grip"],
  },
  "squat-clean": {
    bodyDemands: ["coordination", "squat", "core", "grip"],
  },
  "power-snatch": {
    bodyDemands: ["coordination", "overhead", "core", "grip"],
  },
  "push-jerk": {
    bodyDemands: ["overhead", "coordination", "core"],
    userStates: {
      cannotDoYet: {
        summary: "สร้าง dip-drive และ overhead lockout ให้มั่นคงก่อนเร่งโหลด",
        priorities: [
          "ฝึก dip ตรงลง-ตรงขึ้น ไม่ยุบอก",
          "รับบาร์ด้วยเข่างอเล็กน้อยและลำตัวแข็ง",
          "เริ่มจากน้ำหนักที่ lockout ได้ชัดเจน",
        ],
        blockers: ["dip เอียงไปด้านหน้า", "รับบาร์แล้วข้อศอกนิ่ม"],
        nextMovementSlugs: ["thruster", "front-squat"],
      },
      canDoBasic: {
        summary: "ตอนนี้โฟกัส timing ของ drive และการรับบาร์ที่ประหยัดแรงขึ้น",
        priorities: [
          "ใช้ขาช่วยส่งบาร์จริง ไม่รีบกดด้วยแขน",
          "ฝึก singles คุณภาพสูงก่อนต่อเป็น cycling",
          "รักษา midline และ heels grounded ตอน dip",
        ],
        blockers: ["press ออกด้วยแขนเร็วเกิน", "รับบาร์แล้วเสีย balance"],
      },
      buildPerformance: {
        summary: "พัฒนาความสามารถในการ cycle barbell overhead ภายใต้ fatigue",
        priorities: [
          "ลดเวลาพักหน้ารับบาร์",
          "ฝึก jerk จาก rack และหลัง front squat หรือ clean",
          "ยกระดับไปสู่ higher-skill overhead work ได้มั่นคงขึ้น",
        ],
        blockers: ["drive drop ลงเมื่อเหนื่อย", "brace ไม่อยู่ตอน cycle เร็ว"],
        nextMovementSlugs: ["split-jerk", "thruster"],
      },
    },
  },
  "thruster": {
    bodyDemands: ["squat", "overhead", "engine", "coordination"],
  },
  "rowing": {
    bodyDemands: ["engine", "core", "coordination"],
  },
  "knees-to-elbows": {
    bodyDemands: ["core", "hanging", "grip", "coordination"],
  },
  "hollow-rock": {
    bodyDemands: ["core", "coordination"],
    userStates: {
      cannotDoYet: {
        summary: "เริ่มจาก hold ที่คุม rib cage และ lower back position ได้ก่อน",
        priorities: [
          "เริ่มจาก tuck hollow hold ถ้ายังสั่นมาก",
          "หายใจสั้น ๆ โดยไม่ปล่อย rib flare",
          "ทำ set สั้นแต่คุณภาพสูง",
        ],
        blockers: ["หลังล่างลอยจากพื้น", "เกร็งคอแทนการเกร็งลำตัว"],
      },
      canDoBasic: {
        summary: "ตอนนี้พัฒนา tension และเวลาที่คง hollow ได้จริง",
        priorities: [
          "คุม tempo ของ rock ไม่เหวี่ยงเกินจำเป็น",
          "รักษา arms overhead โดยไม่เสีย trunk position",
          "เชื่อมไปสู่ hanging core patterns",
        ],
        blockers: ["rock ใหญ่เกินจน tension หลุด", "ไหล่ล้าก่อน core"],
        nextMovementSlugs: ["knees-to-elbows", "toes-to-bar"],
      },
      buildPerformance: {
        summary: "ใช้ hollow เป็นฐานของ kip, swing, และ bodyline ใน gymnastics ทั้งระบบ",
        priorities: [
          "คง tension ภายใต้ fatigue ได้ดีขึ้น",
          "ใช้ hollow awareness ระหว่าง pull-up และ toes-to-bar",
          "เชื่อม core compression กับ hanging skill",
        ],
        blockers: ["transfer ไป hanging ไม่ชัด", "bodyline หลุดเมื่อเหนื่อย"],
        nextMovementSlugs: ["kipping-pull-up", "toes-to-bar"],
      },
    },
  },
  "single-under": {
    bodyDemands: ["coordination", "engine"],
    userStates: {
      cannotDoYet: {
        summary: "ทำให้ jump timing และ rope length ถูกก่อน แล้ว double-under จะง่ายขึ้นมาก",
        priorities: [
          "ตั้งความยาวเชือกให้เหมาะ",
          "ฝึกกระโดดต่ำและลงเบา",
          "หมุนเชือกจากข้อมือ ไม่ใช่จากไหล่",
        ],
        blockers: ["เชือกยาวหรือสั้นเกิน", "กระโดดสูงเกินจนเสียจังหวะ"],
      },
      canDoBasic: {
        summary: "พัฒนา consistency และ breathing ให้ single-under เป็น skill ที่ไม่เปลืองแรง",
        priorities: [
          "ทำ sets ยาวขึ้นโดยไม่ trip",
          "คุม posture ตรงตลอด set",
          "ฝึก reset rope ให้กลับมาเร็วหลัง miss",
        ],
        blockers: ["เหนื่อยแล้ว cadence แตก", "หมุนจากแขนมากเกินไป"],
        nextMovementSlugs: ["double-under"],
      },
      buildPerformance: {
        summary: "ใช้ single-under เป็นฐานของ jump rope efficiency และ recovery pacing ใน workout",
        priorities: [
          "รักษา cadence ภายใต้ heart rate สูง",
          "ทำให้ลำตัวนิ่งและ wrists ทำงานมากที่สุด",
          "ยกระดับไปสู่ double-under อย่างมี control",
        ],
        blockers: ["รีบเกินจน trip", "เสียพลังงานจากการกระโดดสูง"],
        nextMovementSlugs: ["double-under", "crossovers"],
      },
    },
  },
  "crossovers": {
    bodyDemands: ["coordination", "engine"],
    userStates: {
      cannotDoYet: {
        summary: "ถ้ายังทำ double-under ไม่เสถียร ไม่ควรรีบข้ามมาที่ crossover",
        priorities: [
          "ทำ double-under ให้ smooth ก่อน",
          "ฝึก pattern มือข้ามทีละข้างแบบช้า ๆ",
          "ใช้ set สั้นเพื่อจำจังหวะเชือก",
        ],
        blockers: ["พื้นฐาน double-under ยังไม่แน่น", "มือข้ามเร็วเกินจนเชือกตัดเท้า"],
        nextMovementSlugs: ["double-under"],
      },
      canDoBasic: {
        summary: "ตอนนี้ฝึก timing และลด miss rate ให้ pattern ข้ามเชือกนิ่งขึ้น",
        priorities: [
          "รักษา jump height ต่ำและสม่ำเสมอ",
          "ฝึกเชื่อม 2–5 reps ก่อนเพิ่ม volume",
          "คุม wrists มากกว่าแขน",
        ],
        blockers: ["ข้ามเชือกกว้างเกิน", "รีบข้ามจน cadence เพี้ยน"],
      },
      buildPerformance: {
        summary: "ใช้ crossover เป็น coordination skill เสริม ไม่ให้รบกวน efficiency ของ rope work หลัก",
        priorities: [
          "ฝึกภายใต้ fatigue โดยยังไม่ trip ง่าย",
          "เชื่อมกับ jump rope sequencing แบบชัดเจน",
          "คุม movement economy ให้ไม่ฟุ่มเฟือย",
        ],
        blockers: ["pattern แตกเมื่อหัวใจสูง", "ใช้แขนมากเกินจนล้าเร็ว"],
        nextMovementSlugs: ["double-under"],
      },
    },
  },
  "assault-bike": {
    bodyDemands: ["engine", "coordination"],
    userStates: {
      cannotDoYet: {
        summary: "เริ่มจากการคุม cadence และ breathing ก่อน ไม่ต้องรีบไล่ watt สูง",
        priorities: [
          "หา pace ที่พูดเป็นคำสั้น ๆ ได้",
          "กด-ดึงแขนขาให้เป็น rhythm เดียวกัน",
          "สะสมเวลาปั่นต่อเนื่องสั้น ๆ แต่สม่ำเสมอ",
        ],
        blockers: ["เปิดแรงเกินแล้วระเบิดเร็ว", "ไม่คุ้นกับ cadence ที่คงที่"],
      },
      canDoBasic: {
        summary: "ตอนนี้พัฒนา repeatability และการ recover หลัง interval",
        priorities: [
          "แยกวันทำ aerobic steady และวัน sprint สั้น",
          "คุม cadence ไม่ให้แกว่งมากเกินระหว่าง set",
          "ฝึกปั่นต่อหลัง burpee หรือ wall ball",
        ],
        blockers: ["ขาไหม้เร็วเกิน", "หายใจไม่กลับหลัง interval"],
      },
      buildPerformance: {
        summary: "ใช้ bike เป็นเครื่องมือพัฒนา Open engine และ transition under fatigue",
        priorities: [
          "ฝึก race pace 30–90 วินาทีหลายรอบ",
          "เรียนรู้ว่าควร push ตอนไหนและ save ตอนไหนใน metcon",
          "เชื่อมกับ wall ball, burpee, และ row เพื่อพัฒนา engine จริง",
        ],
        blockers: ["surge เร็วเกินจนพังทั้ง workout", "cadence ตกแรงหลังรอบแรก"],
        nextMovementSlugs: ["rowing", "wall-ball", "burpee"],
      },
    },
  },
  "bike-erg": {
    bodyDemands: ["engine", "coordination"],
  },
  "kipping-muscle-up": {
    bodyDemands: ["pulling", "grip", "coordination", "hanging"],
  },
  "kipping-hspu": {
    bodyDemands: ["overhead", "coordination", "core"],
  },
  "squat-snatch": {
    bodyDemands: ["overhead", "coordination", "squat", "grip"],
    userStates: {
      cannotDoYet: {
        summary: "ถ้ายังรับบาร์ overhead squat ไม่มั่นคง ให้ย้อนกลับไปสร้าง positions ก่อน",
        priorities: [
          "พัฒนา overhead squat และ power snatch foundation",
          "ฝึก receiving position ที่ลึกและ stable",
          "ใช้น้ำหนักเบาเพื่อคุม bar path ให้แม่น",
        ],
        blockers: ["overhead stability ยังไม่พอ", "รับบาร์แล้ว depth ไม่ถึงหรือเสีย balance"],
        nextMovementSlugs: ["overhead-squat", "power-snatch"],
      },
      canDoBasic: {
        summary: "ตอนนี้โฟกัส consistency ของ pull, turnover, และ receiving position",
        priorities: [
          "ฝึกจาก hang หรือ blocks ถ้าต้องแก้ bar path",
          "คุม tempo เข้าก้นให้มั่นคงก่อนเพิ่ม load",
          "รักษา active shoulders ตลอด receiving phase",
        ],
        blockers: ["ดึงบาร์ออกจากตัว", "catch แล้วหยุดนิ่งไม่พอ"],
      },
      buildPerformance: {
        summary: "พัฒนาความมั่นใจและ repeatability ของ full snatch ใต้ fatigue และ load ที่สูงขึ้น",
        priorities: [
          "เชื่อม speed under the bar กับ overhead stability",
          "ใช้ technique work และ strength support ควบคู่กัน",
          "สร้างความพร้อมต่อ complexes และ Open lifting demands",
        ],
        blockers: ["timing แตกเมื่อหนักขึ้น", "overhead recovery ช้าเกิน"],
        nextMovementSlugs: ["power-snatch", "overhead-squat"],
      },
    },
  },
};

const BODY_DEMAND_STYLES: Record<BodyDemand, { label: string; bg: string; text: string; border: string }> = {
  pulling: { label: "Pulling", bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe" },
  overhead: { label: "Overhead", bg: "#fff7ed", text: "#ea580c", border: "#fed7aa" },
  core: { label: "Core", bg: "#f5f3ff", text: "#7c3aed", border: "#ddd6fe" },
  grip: { label: "Grip", bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
  coordination: { label: "Coordination", bg: "#ecfeff", text: "#0891b2", border: "#a5f3fc" },
  engine: { label: "Engine", bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" },
  squat: { label: "Squat", bg: "#fefce8", text: "#ca8a04", border: "#fde68a" },
  hanging: { label: "Hanging", bg: "#f8fafc", text: "#475569", border: "#cbd5e1" },
};

export function getMovementLearningProfile(slug: string): MovementLearningProfile | undefined {
  return MOVEMENT_LEARNING_PROFILES[slug];
}

export function getBodyDemandStyle(demand: BodyDemand) {
  return BODY_DEMAND_STYLES[demand];
}

export function getDifficultyBand(level: DifficultyLevel) {
  if (level <= 2) return { label: "Foundational", bg: "#f0fdf4", text: "#166534" };
  if (level === 3) return { label: "Intermediate", bg: "#eff6ff", text: "#1d4ed8" };
  return { label: "Advanced", bg: "#fff7ed", text: "#c2410c" };
}

function inferBodyDemands(entry: MovementCatalogEntry, detail?: Movement): BodyDemand[] {
  const demands = new Set<BodyDemand>();
  const tags = new Set((detail?.tags ?? []).map(tag => tag.toLowerCase()));
  const patterns = new Set(detail?.patterns ?? []);
  const equipment = entry.equipment.map(item => item.toLowerCase());
  const slug = entry.slug;

  if (patterns.has("pull") || tags.has("pulling") || slug.includes("pull") || slug.includes("row") || slug.includes("rope-climb")) demands.add("pulling");
  if (patterns.has("squat") || tags.has("squat") || slug.includes("squat") || slug.includes("wall-ball") || slug.includes("thruster")) demands.add("squat");
  if (tags.has("core") || slug.includes("toes-to-bar") || slug.includes("hollow") || slug.includes("sit-up")) demands.add("core");
  if (slug.includes("hang") || slug.includes("toes-to-bar") || slug.includes("chest-to-bar") || slug.includes("muscle-up") || equipment.includes("pull-up bar")) demands.add("hanging");
  if (equipment.some(item => item.includes("rope") || item.includes("bar") || item.includes("rings")) || slug.includes("pull-up") || slug.includes("muscle-up")) demands.add("grip");
  if (patterns.has("cyclical") || entry.category === "monostructural" || slug.includes("burpee") || slug.includes("wall-ball")) demands.add("engine");
  if (slug.includes("jerk") || slug.includes("snatch") || slug.includes("thruster") || slug.includes("handstand") || tags.has("overhead")) demands.add("overhead");
  if (entry.category !== "monostructural" || slug.includes("double-under") || slug.includes("jump") || slug.includes("snatch") || slug.includes("clean")) demands.add("coordination");

  return [...demands];
}

function labelMovement(slug: string) {
  return getMovementBySlug(slug)?.name ?? slug;
}

export function getMovementBodyDemands(entry: MovementCatalogEntry, detail?: Movement): BodyDemand[] {
  const explicit = getMovementLearningProfile(entry.slug)?.bodyDemands;
  const demands = explicit && explicit.length > 0 ? explicit : inferBodyDemands(entry, detail);
  return [...new Set(demands)].slice(0, 4);
}

export function getResolvedUserStateGuidance(entry: MovementCatalogEntry, detail?: Movement) {
  const profile = getMovementLearningProfile(entry.slug);
  const demands = getMovementBodyDemands(entry, detail);

  const cannotDoYet: UserStateGuidance = profile?.userStates?.cannotDoYet ?? {
    summary: detail?.beginnerNote || `เริ่มจากเวอร์ชันที่ควบคุม ${entry.name} ได้จริงก่อน แล้วค่อยเพิ่มความยาก`,
    priorities: [
      detail?.regressions[0] ? `เริ่มจาก ${labelMovement(detail.regressions[0])}` : `ลดความซับซ้อนของ ${entry.name} ก่อน`,
      detail?.prerequisites[0] ? `สร้างฐาน ${labelMovement(detail.prerequisites[0])}` : detail?.scalingNote || "ใช้เวอร์ชันที่รักษาคุณภาพท่าได้",
      detail?.cues[0] || "โฟกัสตำแหน่งพื้นฐานและ range ที่ทำซ้ำได้จริง",
    ].filter(Boolean),
    blockers: detail
      ? [
          ...detail.mobilityNeeds.slice(0, 1).map(item => `mobility: ${item}`),
          ...detail.strengthNeeds.slice(0, 1).map(item => `strength: ${item}`),
        ]
      : demands.slice(0, 2).map(item => `ต้องสร้าง ${getBodyDemandStyle(item).label.toLowerCase()} foundation`),
    nextMovementSlugs: detail ? [...detail.regressions, ...detail.prerequisites].slice(0, 2) : [],
  };

  const canDoBasic: UserStateGuidance = profile?.userStates?.canDoBasic ?? {
    summary: `ตอนนี้เป้าหมายคือทำ ${entry.name} basic version ให้คุณภาพนิ่งขึ้นและต่อ reps ได้จริง`,
    priorities: [
      detail?.cues[0] || "คุมมาตรฐาน rep ให้คงที่",
      detail?.cues[1] || "สะสม volume แบบไม่ปล่อยให้ฟอร์มพัง",
      detail?.scalingNote || "เพิ่ม volume หรือ complexity ทีละน้อย",
    ].filter(Boolean),
    blockers: detail?.faults.slice(0, 2) ?? ["ฟอร์มเริ่มเปลี่ยนเมื่อเหนื่อย", "ยังไม่คุม rhythm ของ movement ได้สม่ำเสมอ"],
    nextMovementSlugs: detail?.progressions.slice(0, 2) ?? [],
  };

  const buildPerformance: UserStateGuidance = profile?.userStates?.buildPerformance ?? {
    summary: `ถ้าทำ ${entry.name} ได้แล้ว ให้โฟกัส efficiency, consistency และการถ่ายโอนไปสู่ workout จริง`,
    priorities: [
      "เพิ่ม volume โดยยังรักษา mechanics เดิม",
      detail?.whyMatters || `ทำให้ ${entry.name} ใช้ได้จริงใน workout และ fatigue`,
      detail?.related[0] ? `เชื่อมไปสู่ ${labelMovement(detail.related[0])}` : "ฝึกภายใต้ fatigue เพื่อใช้ได้จริงใน workout",
    ].filter(Boolean).slice(0, 3),
    blockers: detail?.faults.slice(0, 2) ?? ["efficiency ตกเมื่อ fatigue สูงขึ้น", "ยังรักษา pace และมาตรฐานได้ไม่นานพอ"],
    nextMovementSlugs: detail ? [...detail.progressions, ...detail.related].slice(0, 2) : [],
  };

  return [
    {
      key: "cannotDoYet" as const,
      label: "1. ยังทำไม่ได้",
      description: "เริ่มจากฐานและ regressions",
      data: cannotDoYet,
    },
    {
      key: "canDoBasic" as const,
      label: "2. ทำ basic version ได้",
      description: "พัฒนาคุณภาพและมาตรฐานท่า",
      data: canDoBasic,
    },
    {
      key: "buildPerformance" as const,
      label: "3. ทำได้แล้ว กำลังพัฒนา",
      description: "เน้น efficiency, volume, readiness",
      data: buildPerformance,
    },
  ];
}
