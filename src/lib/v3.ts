import {
  getMovementBySlug,
  getMovementDetail,
  type MovementCatalogEntry,
} from "@/lib/data/movements";
import { getResolvedUserStateGuidance, type UserStateKey } from "@/lib/movement-learning";
import {
  getPathwayBySlug,
  getPathwayMovements,
  SKILL_PATHWAYS,
  type SkillPathway,
} from "@/lib/pathways";

export const V3_STORAGE_KEY = "luydiva-movement-v3";

export const USER_STATE_LABELS: Record<UserStateKey, string> = {
  cannotDoYet: "ยังทำไม่ได้",
  canDoBasic: "ทำ basic version ได้",
  buildPerformance: "ทำได้แล้ว กำลังพัฒนา",
};

export const USER_STATE_SHORT_LABELS: Record<UserStateKey, string> = {
  cannotDoYet: "Foundation",
  canDoBasic: "Basic",
  buildPerformance: "Performance",
};

export type KickStartFocus =
  | "start-here"
  | "pulling-path"
  | "squat-path"
  | "open-engine-path"
  | "barbell-olympic-path";

export type KickStartLevel = "foundation" | "building" | "workout";

export interface RecommendationAnswers {
  starterFocus: KickStartFocus;
  experienceLevel: KickStartLevel;
}

export interface RecommendationQuestionOption<T extends string = string> {
  value: T;
  label: string;
  description: string;
}

export interface RecommendationQuestion {
  id: keyof RecommendationAnswers;
  title: string;
  description: string;
  options: RecommendationQuestionOption[];
}

export interface RecommendationResult {
  pathwaySlug: string;
  movementSlugs: string[];
  summary: string;
  reasons: string[];
  coachNote: string;
  caution: string;
  openInsight?: string;
  readinessProfileSlug?: string;
}

export interface V3UserState {
  readinessResults: Partial<Record<string, ReadinessResult>>;
  lastRecommendation?: RecommendationResult;
}

export type ReadinessBand = "needs-foundation" | "building" | "ready-to-push";

export interface ReadinessQuestion {
  id: string;
  demandLabel: string;
  prompt: string;
  options: Array<RecommendationQuestionOption<"0" | "1" | "2">>;
}

export interface ReadinessProfile {
  slug: string;
  title: string;
  description: string;
  relatedWorkoutId?: string;
  movementSlugs: string[];
  pathwaySlugs: string[];
  keyDemands: string[];
  openInsight: string;
  questions: ReadinessQuestion[];
}

export interface ReadinessResult {
  profileSlug: string;
  score: number;
  maxScore: number;
  band: ReadinessBand;
  summary: string;
  blockers: string[];
  recommendationMovementSlugs: string[];
  recommendationPathwaySlug?: string;
  savedAt: string;
}

export const DEFAULT_RECOMMENDATION_ANSWERS: RecommendationAnswers = {
  starterFocus: "start-here",
  experienceLevel: "foundation",
};

export const KICK_START_LEVEL_LABELS: Record<KickStartLevel, string> = {
  foundation: "เริ่มแบบง่าย ๆ",
  building: "พอมีพื้นฐานแล้ว",
  workout: "อยากเอาไปใช้ในคลาส",
};

export const KICK_START_FOCUS_LABELS: Record<KickStartFocus, string> = {
  "start-here": "ยังไม่แน่ใจว่าจะเริ่มตรงไหน",
  "pulling-path": "ท่าดึงบนบาร์",
  "squat-path": "ขาและสควอต",
  "open-engine-path": "หอบง่ายหรือเพซหลุด",
  "barbell-olympic-path": "บาร์เบลและท่าเหนือศีรษะ",
};

export const DEFAULT_V3_USER_STATE: V3UserState = {
  readinessResults: {},
  lastRecommendation: undefined,
};

const SCORE_OPTIONS: Array<RecommendationQuestionOption<"0" | "1" | "2">> = [
  {
    value: "0",
    label: "ยังไม่พร้อม",
    description: "จุดนี้ยังเป็นตัวตัดเกมชัดเจน",
  },
  {
    value: "1",
    label: "พอทำได้",
    description: "มีพื้นฐานแล้ว แต่ยังไม่นิ่งเมื่อเหนื่อย",
  },
  {
    value: "2",
    label: "ค่อนข้างพร้อม",
    description: "ทำได้สม่ำเสมอและเริ่มพัฒนาประสิทธิภาพได้",
  },
];

export const RECOMMENDATION_QUESTIONS: RecommendationQuestion[] = [
  {
    id: "starterFocus",
    title: "ตอนนี้อยากเริ่มจากด้านไหน",
    description: "เลือกด้านที่รู้สึกติดที่สุดตอนนี้พอ ไม่ต้องคิดเยอะ",
    options: [
      {
        value: "start-here",
        label: "ยังไม่แน่ใจ ขอเริ่มจากง่าย ๆ ก่อน",
        description: "ให้ระบบเลือกทางเริ่มที่ปลอดภัยและไปต่อได้ง่ายสำหรับมือใหม่",
      },
      {
        value: "pulling-path",
        label: "ท่าดึงบนบาร์",
        description: "รู้สึกว่าพวก pull-up หรือแรงดึงยังเป็นจุดที่ติดอยู่",
      },
      {
        value: "squat-path",
        label: "ขาและสควอต",
        description: "สควอต วอลล์บอล หรือความอึดของขายังเป็นจุดที่พาแผ่ว",
      },
      {
        value: "open-engine-path",
        label: "หอบง่ายหรือเพซหลุด",
        description: "ทำท่าได้บ้าง แต่พอเหนื่อยแล้วจังหวะเริ่มหลุด",
      },
      {
        value: "barbell-olympic-path",
        label: "บาร์เบลและท่าเหนือศีรษะ",
        description: "ยังไม่มั่นใจกับจังหวะบาร์เบลหรือการคุมท่าเหนือศีรษะ",
      },
    ],
  },
  {
    id: "experienceLevel",
    title: "อยากเริ่มประมาณไหน",
    description: "เลือกแบบที่ใกล้กับตัวเองที่สุด เพื่อให้ระบบไม่พาไปเร็วเกิน",
    options: [
      {
        value: "foundation",
        label: KICK_START_LEVEL_LABELS.foundation,
        description: "ขอเริ่มเบา ๆ ก่อน เอาแบบเข้าใจและทำซ้ำได้จริง",
      },
      {
        value: "building",
        label: KICK_START_LEVEL_LABELS.building,
        description: "มีพื้นฐานบ้างแล้ว แต่อยากได้ลำดับฝึกที่ชัดขึ้น",
      },
      {
        value: "workout",
        label: KICK_START_LEVEL_LABELS.workout,
        description: "อยากให้สิ่งที่ฝึกเริ่มเอาไปใช้ในคลาสได้จริง",
      },
    ],
  },
];

export const READINESS_PROFILES: ReadinessProfile[] = [
  {
    slug: "open-26-1",
    title: "เช็กความพร้อม Open 26.1",
    description: "เช็กว่าคุณพร้อมแค่ไหนสำหรับความอึดของขา จังหวะวอลล์บอล และการคุมเพซใน 26.1",
    relatedWorkoutId: "26.1",
    movementSlugs: ["air-squat", "wall-ball", "box-jump-over", "thruster"],
    pathwaySlugs: ["squat-path", "open-engine-path"],
    keyDemands: ["ความอึดของขา", "จังหวะวอลล์บอล", "จังหวะหายใจ", "จังหวะข้ามกล่อง"],
    openInsight:
      "ใน 26.1 หลายคนไม่ได้แพ้ท่ายาก แต่แพ้การเปิดเร็วเกินไปที่วอลล์บอล แล้วฟื้นตัวไม่ทันตอนเข้ากล่อง",
    questions: [
      {
        id: "squat-volume",
        demandLabel: "ความอึดของขา",
        prompt: "ตอนทำสควอตหรือวอลล์บอลเยอะ ๆ ขายังคุมทรงและลงได้มาตรฐานแค่ไหน",
        options: SCORE_OPTIONS,
      },
      {
        id: "wall-ball-rhythm",
        demandLabel: "จังหวะวอลล์บอล",
        prompt: "คุณโยน รับ แล้วลงสควอตต่อได้ลื่นแค่ไหน",
        options: SCORE_OPTIONS,
      },
      {
        id: "breathing-control",
        demandLabel: "จังหวะหายใจ",
        prompt: "เมื่อเหนื่อยมากแล้ว คุณยังคุมลมหายใจและกลับเข้าชุดได้ไหม",
        options: SCORE_OPTIONS,
      },
      {
        id: "box-turnover",
        demandLabel: "จังหวะข้ามกล่อง",
        prompt: "พอเหนื่อยแล้ว คุณยังข้ามกล่องได้ต่อเนื่องโดยไม่สะดุดไหม",
        options: SCORE_OPTIONS,
      },
    ],
  },
  {
    slug: "open-26-2",
    title: "เช็กความพร้อม Open 26.2",
    description: "เช็กความพร้อมสำหรับลันจ์เหนือศีรษะ ท่าดึงที่ยากขึ้น และการคุมแรงมือใน 26.2",
    relatedWorkoutId: "26.2",
    movementSlugs: ["db-walking-lunge", "kipping-pull-up", "chest-to-bar", "kipping-muscle-up"],
    pathwaySlugs: ["pulling-path", "hanging-core-path"],
    keyDemands: ["การคุมท่าเหนือศีรษะ", "ท่าดึงขั้นต่อไป", "การคุมแรงมือ", "การเปลี่ยนท่า"],
    openInsight:
      "ใน 26.2 จุดที่คนพังบ่อยไม่ได้มีแค่มัสเซิลอัป แต่รวมถึงลันจ์เหนือศีรษะและแรงมือที่ตกก่อนถึงรอบท้าย",
    questions: [
      {
        id: "overhead-control",
        demandLabel: "การคุมท่าเหนือศีรษะ",
        prompt: "เวลาเดินลันจ์ตอนเหนื่อย คุณยังคุมแขนล็อกและลำตัวได้แค่ไหน",
        options: SCORE_OPTIONS,
      },
      {
        id: "pulling-ladder",
        demandLabel: "ท่าดึงขั้นต่อไป",
        prompt: "ตอนนี้พื้นฐานของคุณพร้อมต่อยอดจาก pull-up ไป chest-to-bar หรือ muscle-up แค่ไหน",
        options: SCORE_OPTIONS,
      },
      {
        id: "grip-fatigue",
        demandLabel: "การคุมแรงมือ",
        prompt: "แรงมือของคุณทนพอสำหรับการอยู่บนบาร์หลายรอบไหม",
        options: SCORE_OPTIONS,
      },
      {
        id: "transition-speed",
        demandLabel: "การเปลี่ยนท่า",
        prompt: "คุณเปลี่ยนจากดัมเบลกลับขึ้นบาร์ได้เร็วแค่ไหนโดยไม่เสียจังหวะมาก",
        options: SCORE_OPTIONS,
      },
    ],
  },
  {
    slug: "squat-capacity",
    title: "เช็กพื้นฐานสควอต",
    description: "ใช้ดูว่าพื้นฐานสควอต วอลล์บอล และทรัสเตอร์ของคุณแน่นพอจะต่อยอดหรือยัง",
    movementSlugs: ["air-squat", "goblet-squat", "front-squat", "thruster"],
    pathwaySlugs: ["squat-path", "open-engine-path"],
    keyDemands: ["ทรงท่าเวลาเหนื่อย", "การคุมลำตัว", "จังหวะหายใจ", "การฟื้นตัวระหว่างเซ็ต"],
    openInsight:
      "ถ้าทรงสควอตเริ่มพังตอนเหนื่อย วอลล์บอล ทรัสเตอร์ และการเปลี่ยนท่ามักจะเสียตามทันที",
    questions: [
      {
        id: "depth-control",
        demandLabel: "ทรงท่าเวลาเหนื่อย",
        prompt: "เมื่อจำนวนครั้งเริ่มเยอะ คุณยังคุมทรงและบาลานซ์ได้ไหม",
        options: SCORE_OPTIONS,
      },
      {
        id: "torso-position",
        demandLabel: "การคุมลำตัว",
        prompt: "อกและลำตัวของคุณยังนิ่งตอนลุกจากก้นล่างสุดไหม",
        options: SCORE_OPTIONS,
      },
      {
        id: "breathing-rhythm",
        demandLabel: "จังหวะหายใจ",
        prompt: "คุณมีจังหวะหายใจที่ช่วยให้กลับเข้าชุดต่อได้หรือยัง",
        options: SCORE_OPTIONS,
      },
      {
        id: "recovery-between-sets",
        demandLabel: "การฟื้นตัวระหว่างเซ็ต",
        prompt: "หลังเซ็ตยาว คุณกลับมาทำต่อได้เร็วแค่ไหนโดยที่ทรงยังไม่พัง",
        options: SCORE_OPTIONS,
      },
    ],
  },
  {
    slug: "pulling-control",
    title: "เช็กพื้นฐานท่าดึง",
    description: "ใช้ดูว่าพื้นฐานของคุณพร้อมพอสำหรับ pull-up, chest-to-bar และท่าต่อไปหรือยัง",
    movementSlugs: ["ring-row", "strict-pull-up", "kipping-pull-up", "chest-to-bar"],
    pathwaySlugs: ["pulling-path", "hanging-core-path"],
    keyDemands: ["แรงดึงแบบ strict", "จังหวะคิป", "การคุมลำตัว", "ความทนของแรงมือ"],
    openInsight:
      "หลายคนคิดว่าตัวเองติดที่สกิล แต่จริง ๆ มักติดที่แรงดึงพื้นฐาน การคุมลำตัว และแรงมือที่ยังไม่พอ",
    questions: [
      {
        id: "strict-base",
        demandLabel: "แรงดึงแบบ strict",
        prompt: "แรงดึงแบบ strict ของคุณพอรองรับจำนวนครั้งที่อยากฝึกไหม",
        options: SCORE_OPTIONS,
      },
      {
        id: "kip-timing",
        demandLabel: "จังหวะคิป",
        prompt: "คุณเชื่อม hollow-arch กับแรงดึงได้ลื่นแค่ไหน",
        options: SCORE_OPTIONS,
      },
      {
        id: "midline-control",
        demandLabel: "การคุมลำตัว",
        prompt: "เมื่อเริ่มเหนื่อย คุณยังคุมตำแหน่งตัวบนบาร์ได้ไหม",
        options: SCORE_OPTIONS,
      },
      {
        id: "grip-durability",
        demandLabel: "ความทนของแรงมือ",
        prompt: "แรงมือของคุณยังคงคุณภาพของแต่ละครั้งได้หลังหลายเซ็ตไหม",
        options: SCORE_OPTIONS,
      },
    ],
  },
];

export const READINESS_BAND_META: Record<
  ReadinessBand,
  { label: string; bg: string; text: string; border: string }
> = {
  "needs-foundation": {
    label: "ควรปูพื้นก่อน",
    bg: "#fee2e2",
    text: "#991b1b",
    border: "#fecaca",
  },
  building: {
    label: "กำลังต่อยอด",
    bg: "#fef3c7",
    text: "#92400e",
    border: "#fde68a",
  },
  "ready-to-push": {
    label: "พร้อมขยับต่อ",
    bg: "#dcfce7",
    text: "#166534",
    border: "#86efac",
  },
};

export function getReadinessProfileBySlug(slug: string) {
  return READINESS_PROFILES.find(profile => profile.slug === slug);
}

export function getReadinessProfilesForWorkout(workoutId: string) {
  return READINESS_PROFILES.filter(profile => profile.relatedWorkoutId === workoutId);
}

export function getReadinessProfilesForMovement(slug: string) {
  return READINESS_PROFILES.filter(profile => profile.movementSlugs.includes(slug));
}

function getKickStartState(level: KickStartLevel): UserStateKey {
  if (level === "foundation") return "cannotDoYet";
  if (level === "building") return "canDoBasic";
  return "buildPerformance";
}

function getKickStartPathwaySlug(focus: KickStartFocus) {
  if (focus === "start-here") return "squat-path";
  return focus;
}

function selectRecommendedPathway(answers: RecommendationAnswers): SkillPathway {
  return getPathwayBySlug(getKickStartPathwaySlug(answers.starterFocus)) ?? SKILL_PATHWAYS[0];
}

function pickMovementsForPathway(pathway: SkillPathway, level: KickStartLevel) {
  const movements = getPathwayMovements(pathway);
  if (movements.length <= 2) return movements.map(movement => movement.slug);

  if (level === "foundation") {
    return movements.slice(0, 2).map(movement => movement.slug);
  }

  if (level === "building") {
    const start = Math.min(Math.max(0, Math.floor(movements.length / 2) - 1), Math.max(0, movements.length - 2));
    return movements.slice(start, start + 2).map(movement => movement.slug);
  }

  return movements.slice(-2).map(movement => movement.slug);
}

function getSuggestedReadinessProfileSlug(pathwaySlug: string, focus: KickStartFocus) {
  if (pathwaySlug === "barbell-olympic-path") return "open-26-2";
  if (focus === "start-here") return "squat-capacity";
  if (["squat-path", "open-engine-path"].includes(pathwaySlug)) return "squat-capacity";
  return "pulling-control";
}

function buildGoDeeperInsight(pathway: SkillPathway) {
  if (pathway.workoutIds[0]) {
    return "ถ้าอยากลงลึกกว่านี้ ให้เปิดเส้นทางฝึกเต็มก่อน แล้วค่อยเช็กความพร้อมหรืออ่านต่อจาก CrossFit.com ภายหลัง";
  }

  return "ถ้าอยากลงลึกกว่านี้ ให้เปิดเส้นทางฝึกเต็มก่อน แล้วค่อยต่อด้วยเช็กความพร้อมหรือบทความจาก CrossFit.com ภายหลัง";
}

function describeReason(pathway: SkillPathway, answers: RecommendationAnswers) {
  const reasons = [`เริ่มจาก ${pathway.titleTH} เพราะใกล้กับจุดที่คุณอยากแก้มากที่สุด`];

  if (answers.starterFocus === "start-here") {
    reasons.push("เหมาะกับคนที่ยังไม่แน่ใจว่าจะเริ่มตรงไหน และอยากปูพื้นให้กว้างก่อน");
  }

  if (answers.experienceLevel === "foundation") {
    reasons.push("เราเลือกท่าช่วงต้นเพื่อให้เริ่มได้แบบไม่หนักเกินไปและทำซ้ำได้จริง");
  }

  if (answers.experienceLevel === "building") {
    reasons.push("เราเลือกท่าช่วงกลางเพื่อช่วยต่อยอดจากพื้นฐานที่คุณมีอยู่แล้ว");
  }

  if (answers.experienceLevel === "workout") {
    reasons.push("เราเลือกท่าที่เริ่มเอาไปใช้ในคลาสได้มากขึ้น แต่ยังไม่ข้ามขั้น");
  }

  return reasons.slice(0, 3);
}

function getCoachNote(movementSlug: string, state: UserStateKey) {
  const movement = getMovementBySlug(movementSlug);
  if (!movement) return "เริ่มจากจำนวนครั้งที่คุมคุณภาพได้จริง แล้วค่อยเพิ่มทีละนิด";
  const detail = getMovementDetail(movementSlug);
  const guidance = getResolvedUserStateGuidance(movement as MovementCatalogEntry, detail).find(item => item.key === state);
  return guidance?.data.summary ?? `โฟกัส ${movement.name} ให้คุมมาตรฐานได้จริงก่อนเพิ่มความยาก`;
}

export function buildRecommendation(answers: RecommendationAnswers): RecommendationResult {
  const pathway = selectRecommendedPathway(answers);
  const state = getKickStartState(answers.experienceLevel);
  const movementSlugs = pickMovementsForPathway(pathway, answers.experienceLevel);
  const focusMovementSlug = movementSlugs[0] ?? pathway.movementSlugs[0];
  const readinessProfileSlug = getSuggestedReadinessProfileSlug(pathway.slug, answers.starterFocus);

  return {
    pathwaySlug: pathway.slug,
    movementSlugs,
    readinessProfileSlug,
    summary: `${pathway.titleTH} น่าจะเหมาะกับคุณที่สุดตอนนี้ เพราะตรงกับสิ่งที่คุณอยากโฟกัส และไม่ยากเกินระดับที่เลือก`,
    reasons: describeReason(pathway, answers),
    coachNote: getCoachNote(focusMovementSlug, state),
    caution:
      answers.experienceLevel === "foundation"
        ? "ยังไม่ต้องรีบไปท่าปลายทาง เอาให้พื้นฐานนิ่งก่อน"
        : answers.experienceLevel === "building"
          ? "ยังไม่ต้องรีบเพิ่มจำนวน ถ้าพอเหนื่อยแล้วจังหวะเริ่มหลุด"
          : "ตอนนี้ให้ดูว่าทำได้ลื่นขึ้นและฟื้นไวขึ้น ไม่ใช่แค่ทำผ่านอย่างเดียว",
    openInsight: buildGoDeeperInsight(pathway),
  };
}

function sliceReadinessMovements(profile: ReadinessProfile, band: ReadinessBand) {
  if (band === "needs-foundation") return profile.movementSlugs.slice(0, 2);
  if (band === "building") return profile.movementSlugs.slice(1, 3);
  return profile.movementSlugs.slice(-2);
}

function buildReadinessSummary(profile: ReadinessProfile, band: ReadinessBand) {
  if (band === "needs-foundation") {
    return `ตอนนี้ ${profile.title} ยังควรปูพื้นก่อน โดยเฉพาะจุดที่คุณให้คะแนนต่ำสุด`;
  }

  if (band === "building") {
    return "คุณมีพื้นฐานพอสมควรแล้ว แต่ยังควรจัดลำดับการฝึกให้แม่นก่อนเร่งจำนวนหรือความหนัก";
  }

  return "คุณอยู่ในจุดที่พร้อมขยับต่อได้ แต่ยังควรคุมคุณภาพท่าและการฟื้นตัวระหว่างเซ็ต";
}

export function evaluateReadinessProfile(
  profile: ReadinessProfile,
  answers: Record<string, "0" | "1" | "2">,
): ReadinessResult {
  const score = profile.questions.reduce((sum, question) => sum + Number(answers[question.id] ?? "0"), 0);
  const maxScore = profile.questions.length * 2;
  const ratio = maxScore === 0 ? 0 : score / maxScore;

  const band: ReadinessBand = ratio < 0.4 ? "needs-foundation" : ratio < 0.75 ? "building" : "ready-to-push";

  const blockers = profile.questions
    .filter(question => answers[question.id] === "0")
    .map(question => question.demandLabel)
    .slice(0, 3);

  return {
    profileSlug: profile.slug,
    score,
    maxScore,
    band,
    summary: buildReadinessSummary(profile, band),
    blockers: blockers.length > 0 ? blockers : profile.keyDemands.slice(0, 2),
    recommendationMovementSlugs: sliceReadinessMovements(profile, band),
    recommendationPathwaySlug: profile.pathwaySlugs[0],
    savedAt: new Date().toISOString(),
  };
}

export function getRecommendedPathway(result?: RecommendationResult) {
  return result ? getPathwayBySlug(result.pathwaySlug) : undefined;
}

export function getRecommendedMovements(result?: RecommendationResult) {
  return (result?.movementSlugs ?? [])
    .map(slug => getMovementBySlug(slug))
    .filter((movement): movement is MovementCatalogEntry => !!movement);
}

export function getReadinessProfileTitle(slug?: string) {
  if (!slug) return undefined;
  return getReadinessProfileBySlug(slug)?.title;
}
