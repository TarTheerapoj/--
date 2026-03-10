import {
  getMovementBySlug,
  getMovementDetail,
  type MovementCatalogEntry,
} from "@/lib/data/movements";
import { getWorkoutById } from "@/lib/data/workouts";
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

export interface RecommendationAnswers {
  blockerPathwaySlug: string;
  targetWorkoutId: "none" | "26.1" | "26.2";
  currentState: UserStateKey;
  preference: "consistency" | "skill" | "open-ready";
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
  targetWorkoutId?: string;
  readinessProfileSlug?: string;
}

export interface V3UserState {
  favoriteMovementSlugs: string[];
  savedPathwaySlugs: string[];
  trainLaterMovementSlugs: string[];
  movementStates: Partial<Record<string, UserStateKey>>;
  readinessResults: Partial<Record<string, ReadinessResult>>;
  lastRecommendation?: RecommendationResult;
  coachModeEnabled: boolean;
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
  blockerPathwaySlug: "pulling-path",
  targetWorkoutId: "none",
  currentState: "cannotDoYet",
  preference: "consistency",
};

export const DEFAULT_V3_USER_STATE: V3UserState = {
  favoriteMovementSlugs: [],
  savedPathwaySlugs: [],
  trainLaterMovementSlugs: [],
  movementStates: {},
  readinessResults: {},
  lastRecommendation: undefined,
  coachModeEnabled: false,
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
    id: "blockerPathwaySlug",
    title: "ตอนนี้คุณติดอยู่ตรงไหนมากที่สุด",
    description: "เลือก skill gap หลัก เพื่อให้ระบบจัดลำดับทางฝึกให้ใกล้กับปัญหาจริง",
    options: [
      {
        value: "pulling-path",
        label: "Pulling / Pull-Up",
        description: "ยังติดแรงดึง, kip, chest-to-bar หรือ muscle-up",
      },
      {
        value: "squat-path",
        label: "Squat / Wall Ball",
        description: "ขาและ squat pattern พังเร็ว, wall-ball ไม่มี rhythm",
      },
      {
        value: "hanging-core-path",
        label: "Hanging Core",
        description: "แกว่งบนบาร์ได้ แต่คุม midline หรือ bar volume ไม่อยู่",
      },
      {
        value: "open-engine-path",
        label: "Engine / Pacing",
        description: "ทำ movement ได้ แต่หลุด pace, หายใจ, turnover ใน metcon",
      },
      {
        value: "barbell-olympic-path",
        label: "Barbell Skill",
        description: "ติด receiving position, timing, หรือ overhead control",
      },
      {
        value: "jump-rope-path",
        label: "Jump Rope Timing",
        description: "double-under หรือ rope rhythm ยังเป็น pain point",
      },
    ],
  },
  {
    id: "targetWorkoutId",
    title: "อยากโยงไปที่ workout ไหนไหม",
    description: "ถ้ามี Open workout ที่อยากแก้ทาง ระบบจะให้น้ำหนักเพิ่มกับ pathway ที่เกี่ยวข้อง",
    options: [
      {
        value: "none",
        label: "ยังไม่เจาะ workout",
        description: "ขอเริ่มจาก skill gap ก่อน",
      },
      {
        value: "26.1",
        label: "Open 26.1",
        description: "squat endurance, wall-ball efficiency, box turnover",
      },
      {
        value: "26.2",
        label: "Open 26.2",
        description: "overhead stability, pulling progression, grip management",
      },
    ],
  },
  {
    id: "currentState",
    title: "ตอนนี้คุณอยู่ระดับไหนกับจุดที่ติด",
    description: "ใช้ level นี้เพื่อเลือก movement ถัดไปให้ไม่เร็วเกินไป",
    options: [
      {
        value: "cannotDoYet",
        label: USER_STATE_LABELS.cannotDoYet,
        description: "ยังต้องย้อนกลับไปสร้างฐานหรือ regressions",
      },
      {
        value: "canDoBasic",
        label: USER_STATE_LABELS.canDoBasic,
        description: "ทำ basic version ได้ แต่ยังไม่ stable ใน volume",
      },
      {
        value: "buildPerformance",
        label: USER_STATE_LABELS.buildPerformance,
        description: "ทำได้แล้ว แต่อยากใช้ได้จริงใน workout และ fatigue",
      },
    ],
  },
  {
    id: "preference",
    title: "ตอนนี้อยากได้ผลลัพธ์แบบไหนที่สุด",
    description: "เลือก objective หลัก เพื่อให้คำแนะนำ practical มากขึ้น",
    options: [
      {
        value: "consistency",
        label: "ทำให้เสถียรขึ้น",
        description: "อยากให้ฟอร์มและ pacing ไม่พังง่าย",
      },
      {
        value: "skill",
        label: "ปลดล็อก skill ถัดไป",
        description: "อยากเร่ง progression แบบมีเหตุผล",
      },
      {
        value: "open-ready",
        label: "พร้อมใช้ใน Open",
        description: "โฟกัสว่าทำยังไงให้เอาไปใช้ใน workout จริงได้",
      },
    ],
  },
];

export const READINESS_PROFILES: ReadinessProfile[] = [
  {
    slug: "open-26-1",
    title: "Readiness for Open 26.1",
    description: "เช็กว่าคุณพร้อมแค่ไหนสำหรับ squat endurance, wall-ball rhythm, และการคุม pace ใน 26.1",
    relatedWorkoutId: "26.1",
    movementSlugs: ["air-squat", "wall-ball", "box-jump-over", "thruster"],
    pathwaySlugs: ["squat-path", "open-engine-path"],
    keyDemands: ["squat endurance", "wall-ball efficiency", "cyclical breathing", "jump-over rhythm"],
    openInsight:
      "ใน 26.1 คนจำนวนมากไม่ได้แพ้ movement ยาก แต่แพ้การเปิดเร็วเกินไปที่ wall ball และฟื้นตัวไม่ทันหน้ากล่อง",
    questions: [
      {
        id: "squat-volume",
        demandLabel: "squat endurance",
        prompt: "ตอน squat หรือ wall ball rep สูง ขายังรักษาทรงและ depth ได้แค่ไหน",
        options: SCORE_OPTIONS,
      },
      {
        id: "wall-ball-rhythm",
        demandLabel: "wall-ball efficiency",
        prompt: "คุณคุม target line และรับลูกกลับลง squat ได้สม่ำเสมอแค่ไหน",
        options: SCORE_OPTIONS,
      },
      {
        id: "breathing-control",
        demandLabel: "cyclical breathing",
        prompt: "เมื่อหัวใจขึ้นสูง คุณยังคุม breathing rhythm และกลับเข้าชุดได้ไหม",
        options: SCORE_OPTIONS,
      },
      {
        id: "box-turnover",
        demandLabel: "jump-over rhythm",
        prompt: "box jump-over หรือ step-over ของคุณยังมี turnover ดีเมื่อเหนื่อยไหม",
        options: SCORE_OPTIONS,
      },
    ],
  },
  {
    slug: "open-26-2",
    title: "Readiness for Open 26.2",
    description: "เช็กความพร้อมสำหรับ overhead lunge, pulling ladder, และ grip management ใน 26.2",
    relatedWorkoutId: "26.2",
    movementSlugs: ["db-walking-lunge", "kipping-pull-up", "chest-to-bar", "kipping-muscle-up"],
    pathwaySlugs: ["pulling-path", "hanging-core-path"],
    keyDemands: ["overhead stability", "advanced pulling", "grip management", "transition efficiency"],
    openInsight:
      "ใน 26.2 จุดตัดเกมมักไม่ใช่แค่ muscle-up แต่คือ overhead lunge และ grip ที่ทำให้ pulling quality ตกก่อนถึงรอบท้าย",
    questions: [
      {
        id: "overhead-control",
        demandLabel: "overhead stability",
        prompt: "เวลาเดิน lunge ใต้ fatigue คุณยังคุม lockout และ midline ได้แค่ไหน",
        options: SCORE_OPTIONS,
      },
      {
        id: "pulling-ladder",
        demandLabel: "advanced pulling",
        prompt: "pull-up → chest-to-bar → muscle-up progression ของคุณพร้อมแค่ไหนตอนนี้",
        options: SCORE_OPTIONS,
      },
      {
        id: "grip-fatigue",
        demandLabel: "grip management",
        prompt: "grip ของคุณอยู่ได้นานพอสำหรับหลายรอบบน rig ไหม",
        options: SCORE_OPTIONS,
      },
      {
        id: "transition-speed",
        demandLabel: "transition efficiency",
        prompt: "คุณกลับจาก dumbbell เข้าบาร์ได้เร็วและไม่เสียหายใจมากแค่ไหน",
        options: SCORE_OPTIONS,
      },
    ],
  },
  {
    slug: "squat-capacity",
    title: "Squat Capacity Check",
    description: "ใช้เช็ก readiness ของคนที่กำลังจะ build squat volume, wall ball, หรือ thruster ให้ใช้ได้จริง",
    movementSlugs: ["air-squat", "goblet-squat", "front-squat", "thruster"],
    pathwaySlugs: ["squat-path", "open-engine-path"],
    keyDemands: ["mechanics under fatigue", "torso position", "breathing rhythm", "squat recovery"],
    openInsight:
      "ถ้า squat pattern เริ่มพังเมื่อเหนื่อย คุณมักจะเห็นผลเสียต่อ wall ball, thruster, และการเปลี่ยน movement ใน Open ทันที",
    questions: [
      {
        id: "depth-control",
        demandLabel: "mechanics under fatigue",
        prompt: "คุณยังคุม depth และ balance ได้ไหมเมื่อ volume เริ่มสูง",
        options: SCORE_OPTIONS,
      },
      {
        id: "torso-position",
        demandLabel: "torso position",
        prompt: "อกและ brace ของคุณยังนิ่งเวลาออกจากก้นล่างสุดไหม",
        options: SCORE_OPTIONS,
      },
      {
        id: "breathing-rhythm",
        demandLabel: "breathing rhythm",
        prompt: "คุณมีจังหวะหายใจที่ช่วยให้กลับเข้าชุดได้หรือยัง",
        options: SCORE_OPTIONS,
      },
      {
        id: "recovery-between-sets",
        demandLabel: "squat recovery",
        prompt: "หลังเซ็ตยาว คุณกลับมาทำงานต่อได้เร็วแค่ไหนโดยไม่เสียทรง",
        options: SCORE_OPTIONS,
      },
    ],
  },
  {
    slug: "pulling-control",
    title: "Pulling Control Check",
    description: "เช็กว่าพื้นฐานของคุณพร้อมพอสำหรับ pull-up volume, chest-to-bar, และ progression ต่อไปหรือยัง",
    movementSlugs: ["ring-row", "strict-pull-up", "kipping-pull-up", "chest-to-bar"],
    pathwaySlugs: ["pulling-path", "hanging-core-path"],
    keyDemands: ["strict pulling base", "kip timing", "hollow control", "grip durability"],
    openInsight:
      "athlete หลายคนคิดว่าติดที่ skill แต่จริง ๆ ติดที่ strict base, hollow position, และ grip durability ที่ยังไม่พอ",
    questions: [
      {
        id: "strict-base",
        demandLabel: "strict pulling base",
        prompt: "strict pulling strength ของคุณเพียงพอที่จะรองรับ volume ที่อยากทำไหม",
        options: SCORE_OPTIONS,
      },
      {
        id: "kip-timing",
        demandLabel: "kip timing",
        prompt: "คุณเชื่อม hollow-arch กับแรงดึงได้แม่นแค่ไหน",
        options: SCORE_OPTIONS,
      },
      {
        id: "midline-control",
        demandLabel: "hollow control",
        prompt: "เมื่อเริ่มเหนื่อย คุณยังคุมตำแหน่งตัวบนบาร์ได้ไหม",
        options: SCORE_OPTIONS,
      },
      {
        id: "grip-durability",
        demandLabel: "grip durability",
        prompt: "grip ของคุณยังคงคุณภาพ rep ได้หลังหลายเซ็ตไหม",
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
    label: "Foundation First",
    bg: "#fee2e2",
    text: "#991b1b",
    border: "#fecaca",
  },
  building: {
    label: "Building",
    bg: "#fef3c7",
    text: "#92400e",
    border: "#fde68a",
  },
  "ready-to-push": {
    label: "Ready to Push",
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

function getPathwayScoreBoosts(answers: RecommendationAnswers) {
  const scores = new Map<string, number>(SKILL_PATHWAYS.map(pathway => [pathway.slug, 0]));

  scores.set(
    answers.blockerPathwaySlug,
    (scores.get(answers.blockerPathwaySlug) ?? 0) + 6,
  );

  if (answers.targetWorkoutId !== "none") {
    SKILL_PATHWAYS.filter(pathway => pathway.workoutIds.includes(answers.targetWorkoutId)).forEach(pathway => {
      scores.set(pathway.slug, (scores.get(pathway.slug) ?? 0) + 4);
    });

    if (answers.targetWorkoutId === "26.1") {
      ["squat-path", "open-engine-path"].forEach(slug => {
        scores.set(slug, (scores.get(slug) ?? 0) + 1);
      });
    }

    if (answers.targetWorkoutId === "26.2") {
      ["pulling-path", "hanging-core-path"].forEach(slug => {
        scores.set(slug, (scores.get(slug) ?? 0) + 1);
      });
    }
  }

  if (answers.preference === "consistency") {
    ["squat-path", "open-engine-path", "jump-rope-path"].forEach(slug => {
      scores.set(slug, (scores.get(slug) ?? 0) + 2);
    });
  }

  if (answers.preference === "skill") {
    ["pulling-path", "hanging-core-path", "barbell-olympic-path"].forEach(slug => {
      scores.set(slug, (scores.get(slug) ?? 0) + 2);
    });
  }

  if (answers.preference === "open-ready") {
    SKILL_PATHWAYS.filter(pathway => pathway.workoutIds.length > 0).forEach(pathway => {
      scores.set(pathway.slug, (scores.get(pathway.slug) ?? 0) + 2);
    });
  }

  if (answers.currentState === "cannotDoYet") {
    ["squat-path", "pulling-path", "open-engine-path"].forEach(slug => {
      scores.set(slug, (scores.get(slug) ?? 0) + 1);
    });
  }

  if (answers.currentState === "buildPerformance") {
    ["pulling-path", "hanging-core-path", "barbell-olympic-path"].forEach(slug => {
      scores.set(slug, (scores.get(slug) ?? 0) + 1);
    });
  }

  return scores;
}

function selectRecommendedPathway(answers: RecommendationAnswers): SkillPathway {
  const scores = getPathwayScoreBoosts(answers);
  const sorted = [...scores.entries()].sort((a, b) => b[1] - a[1]);
  const top = sorted[0]?.[0] ?? answers.blockerPathwaySlug;
  return getPathwayBySlug(top) ?? SKILL_PATHWAYS[0];
}

function pickMovementsForPathway(pathway: SkillPathway, state: UserStateKey) {
  const movements = getPathwayMovements(pathway);
  if (movements.length <= 2) return movements.map(movement => movement.slug);

  if (state === "cannotDoYet") {
    return movements.slice(0, 2).map(movement => movement.slug);
  }

  if (state === "canDoBasic") {
    const start = Math.max(0, Math.floor(movements.length / 2) - 1);
    return movements.slice(start, start + 2).map(movement => movement.slug);
  }

  return movements.slice(-2).map(movement => movement.slug);
}

function getSuggestedReadinessProfileSlug(pathwaySlug: string, workoutId: RecommendationAnswers["targetWorkoutId"]) {
  if (workoutId === "26.1") return "open-26-1";
  if (workoutId === "26.2") return "open-26-2";
  if (["squat-path", "open-engine-path"].includes(pathwaySlug)) return "squat-capacity";
  return "pulling-control";
}

function buildOpenInsight(pathway: SkillPathway, targetWorkoutId: RecommendationAnswers["targetWorkoutId"]) {
  if (targetWorkoutId !== "none") {
    const workout = getWorkoutById(targetWorkoutId);
    if (workout?.readiness?.commonStickingPoints?.[0]) {
      return `โยงกับ Open ${targetWorkoutId}: ${workout.readiness.commonStickingPoints[0]}`;
    }
  }

  if (pathway.workoutIds[0]) {
    const workout = getWorkoutById(pathway.workoutIds[0]);
    if (workout?.readiness?.keyDemands?.[0]) {
      return `pathway นี้เชื่อมกับ Open ${workout.id} และ demand หลักคือ ${workout.readiness.keyDemands[0]}`;
    }
  }

  return undefined;
}

function describeReason(pathway: SkillPathway, answers: RecommendationAnswers) {
  const reasons = [
    `เริ่มจาก ${pathway.titleTH} เพราะตรงกับ blocker ที่คุณเลือกมากที่สุด`,
  ];

  if (answers.targetWorkoutId !== "none") {
    reasons.push(`pathway นี้เชื่อมกับ Open ${answers.targetWorkoutId} ได้โดยตรงหรือใกล้เคียงที่สุด`);
  }

  if (answers.preference === "consistency") {
    reasons.push("ลำดับ movement นี้จะช่วยให้คุณทำ pattern เดิมได้เสถียรขึ้นก่อนเร่ง skill ถัดไป");
  }

  if (answers.preference === "skill") {
    reasons.push("คำแนะนำนี้เน้น progression ที่ใกล้กับ skill เป้าหมายแบบไม่กระโดดขั้นเกินไป");
  }

  if (answers.preference === "open-ready") {
    reasons.push("คำแนะนำนี้คัด movement ที่ถ่ายโอนไปใช้ใน workout จริงได้เร็วกว่าแบบอ่านเฉย ๆ");
  }

  return reasons.slice(0, 3);
}

function getCoachNote(movementSlug: string, state: UserStateKey) {
  const movement = getMovementBySlug(movementSlug);
  if (!movement) return "เริ่มจาก quality reps ที่ทำซ้ำได้จริง แล้วค่อยเพิ่ม volume";
  const detail = getMovementDetail(movementSlug);
  const guidance = getResolvedUserStateGuidance(movement as MovementCatalogEntry, detail).find(item => item.key === state);
  return guidance?.data.summary ?? `โฟกัส ${movement.name} ให้คุมมาตรฐานได้จริงก่อนเพิ่มความยาก`;
}

export function buildRecommendation(answers: RecommendationAnswers): RecommendationResult {
  const pathway = selectRecommendedPathway(answers);
  const movementSlugs = pickMovementsForPathway(pathway, answers.currentState);
  const focusMovementSlug = movementSlugs[0] ?? pathway.movementSlugs[0];
  const readinessProfileSlug = getSuggestedReadinessProfileSlug(pathway.slug, answers.targetWorkoutId);
  const stateLabel = USER_STATE_LABELS[answers.currentState];

  return {
    pathwaySlug: pathway.slug,
    movementSlugs,
    targetWorkoutId: answers.targetWorkoutId === "none" ? undefined : answers.targetWorkoutId,
    readinessProfileSlug,
    summary: `${pathway.titleTH} เหมาะสุดสำหรับคุณตอนนี้ เพราะคุณอยู่ระดับ “${stateLabel}” และควรเดินตามลำดับที่ช่วยแก้ bottleneck หลักก่อน`,
    reasons: describeReason(pathway, answers),
    coachNote: getCoachNote(focusMovementSlug, answers.currentState),
    caution:
      answers.currentState === "cannotDoYet"
        ? "ยังไม่ต้องรีบไล่ movement ปลายทาง ให้สะสมฐานและ quality reps ก่อน"
        : answers.currentState === "canDoBasic"
          ? "อย่าเพิ่ม volume เร็วเกินไป ถ้ายังเสีย rhythm หรือ form เมื่อเหนื่อย"
          : "ตอนนี้ให้วัดที่ efficiency และ rest time ไม่ใช่แค่ทำได้หรือไม่ได้",
    openInsight: buildOpenInsight(pathway, answers.targetWorkoutId),
  };
}

function sliceReadinessMovements(profile: ReadinessProfile, band: ReadinessBand) {
  if (band === "needs-foundation") return profile.movementSlugs.slice(0, 2);
  if (band === "building") return profile.movementSlugs.slice(1, 3);
  return profile.movementSlugs.slice(-2);
}

function buildReadinessSummary(profile: ReadinessProfile, band: ReadinessBand) {
  if (band === "needs-foundation") {
    return `ตอนนี้ ${profile.title} ยังควรเริ่มจากฐานก่อน โดยเฉพาะ demand ที่ให้คะแนนต่ำสุด`;
  }

  if (band === "building") {
    return `คุณมีฐานพอสมควรแล้ว แต่ยังควรจัดลำดับการฝึกให้แม่นก่อนเร่ง volume หรือ intensity`;
  }

  return `คุณอยู่ในจุดที่พร้อมพัฒนา performance ต่อได้ แต่ยังควรคุมคุณภาพ movement และการฟื้นตัวระหว่างเซ็ต`;
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
