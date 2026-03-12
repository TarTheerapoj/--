export type CrossFitTermSlug = "for-time" | "emom" | "amrap" | "rx-scaled";

export type CrossFitWorkoutTypeSlug = "for-time" | "amrap" | "emom" | "max-weight";

export interface CrossFitTermGuide {
  slug: CrossFitTermSlug;
  term: string;
  titleTH: string;
  meaning: string;
  howToRead: string;
  beginnerNote: string;
}

export interface CrossFitWorkoutTypeGuide {
  slug: CrossFitWorkoutTypeSlug;
  titleTH: string;
  englishLabel: string;
  summary: string;
  whatYouWillSee: string;
}

export const CROSSFIT_NEWBIE_TERMS: CrossFitTermGuide[] = [
  {
    slug: "for-time",
    term: "For Time",
    titleTH: "ทำงานที่กำหนดให้ครบให้ไวที่สุด",
    meaning: "หมายถึงมีงานให้ทำครบตามจำนวนที่กำหนด แล้วจับเวลาดูว่าใช้เวลาทั้งหมดเท่าไร",
    howToRead: "ถ้าคะแนนเป็นเวลา ยิ่งเวลาน้อยยิ่งดี",
    beginnerNote: "มือใหม่มักพังเพราะเปิดเร็วเกินไปตั้งแต่ต้น แล้วต้องพักยาวกลางเวิร์กเอาท์",
  },
  {
    slug: "emom",
    term: "EMOM",
    titleTH: "Every Minute on the Minute",
    meaning: "หมายถึงทุกต้นนาทีคุณต้องทำงานที่กำหนดให้เสร็จ แล้วใช้เวลาที่เหลือพักก่อนขึ้นนาทีใหม่",
    howToRead: "ให้ดูว่าทำงานทันในแต่ละนาทีไหม และเหลือเวลาพักจริงหรือเปล่า",
    beginnerNote: "ถ้าทำจนไม่เหลือเวลาหายใจเลย แปลว่างานอาจแน่นเกินระดับตอนนี้",
  },
  {
    slug: "amrap",
    term: "AMRAP",
    titleTH: "ทำให้ได้มากที่สุดในเวลาที่กำหนด",
    meaning: "หมายถึงมีเวลาตายตัว แล้วดูว่าคุณทำได้กี่รอบหรือกี่ครั้งภายในเวลานั้น",
    howToRead: "ถ้าคะแนนเป็นจำนวนรอบหรือจำนวนครั้ง ยิ่งมากยิ่งดี",
    beginnerNote: "จุดสำคัญคือหาเพซที่ไปต่อได้เรื่อย ๆ ไม่ใช่เร่งต้นเกมจนหมดแรงเร็ว",
  },
  {
    slug: "rx-scaled",
    term: "Rx / Scaled",
    titleTH: "ระดับมาตรฐานกับระดับปรับให้เหมาะ",
    meaning: "Rx คือทำตามมาตรฐานที่กำหนด ส่วน Scaled คือปรับท่า น้ำหนัก หรือจำนวนให้เหมาะกับระดับของคุณ",
    howToRead: "อย่ามองว่า Scaled แปลว่าอ่อนกว่า แต่ให้มองว่าเป็นเวอร์ชันที่เหมาะกับตอนนี้",
    beginnerNote: "ถ้ายังทำ Rx แล้วฟอร์มพังหรือพักนานเกินไป การเลือก Scaled มักช่วยให้ได้ฝึกจริงมากกว่า",
  },
];

export const CROSSFIT_WORKOUT_TYPES: CrossFitWorkoutTypeGuide[] = [
  {
    slug: "for-time",
    titleTH: "งานจับเวลาให้ครบ",
    englishLabel: "For Time",
    summary: "มีงานทั้งหมดวางไว้ชัดเจน แล้วดูว่าใครทำครบได้เร็วที่สุด",
    whatYouWillSee: "มักเห็นในงานที่อยากวัดเพซ การเปลี่ยนท่า และการคุมแรงจนจบ",
  },
  {
    slug: "amrap",
    titleTH: "งานสะสมรอบหรือจำนวนครั้ง",
    englishLabel: "AMRAP",
    summary: "มีเวลาตายตัว แล้วดูว่าใครเก็บรอบหรือจำนวนครั้งได้มากที่สุดในเวลานั้น",
    whatYouWillSee: "มักใช้วัดความสม่ำเสมอ ความอึด และการคุมจังหวะพัก",
  },
  {
    slug: "emom",
    titleTH: "งานรายนาที",
    englishLabel: "EMOM",
    summary: "ทุกต้นนาทีมีงานให้ทำ แล้วใช้เวลาที่เหลือพักก่อนนาทีใหม่เริ่ม",
    whatYouWillSee: "มักใช้ฝึกคุณภาพท่า pace และการคุมปริมาณงานต่อรอบ",
  },
  {
    slug: "max-weight",
    titleTH: "งานหาน้ำหนักสูงสุด",
    englishLabel: "Max Weight",
    summary: "โฟกัสว่าคุณยกได้หนักที่สุดเท่าไรในท่าที่กำหนด ภายใต้เงื่อนไขที่วางไว้",
    whatYouWillSee: "มักใช้กับท่าบาร์เบลหรือ strength test มากกว่างานที่เน้นรอบและเวลา",
  },
];

export function getCrossFitNewbieTerms() {
  return CROSSFIT_NEWBIE_TERMS;
}

export function getCrossFitWorkoutTypes() {
  return CROSSFIT_WORKOUT_TYPES;
}
