import { getMovementBySlug, type MovementCatalogEntry } from "@/lib/data/movements";
import type { BodyDemand } from "@/lib/movement-learning";

export interface SkillPathway {
  slug: string;
  title: string;
  titleTH: string;
  description: string;
  whoItsFor: string;
  focus: BodyDemand[];
  movementSlugs: string[];
  workoutIds: string[];
  accent: string;
}

export const SKILL_PATHWAYS: SkillPathway[] = [
  {
    slug: "pulling-path",
    title: "Pulling Path",
    titleTH: "เส้นทางการดึงตัว",
    description: "จากแรงดึงพื้นฐานไปสู่ gymnastics pulling ที่ใช้ได้จริงใน Open",
    whoItsFor: "คนที่ยังไม่มี pull-up ที่แข็งแรง หรืออยากพัฒนาไปสู่ chest-to-bar และ muscle-up",
    focus: ["pulling", "grip", "hanging"],
    movementSlugs: ["ring-row", "strict-pull-up", "kipping-pull-up", "chest-to-bar", "kipping-muscle-up"],
    workoutIds: ["26.2"],
    accent: "#3b82f6",
  },
  {
    slug: "squat-path",
    title: "Squat Path",
    titleTH: "เส้นทางการสควอท",
    description: "สร้าง squat mechanics และต่อยอดไปสู่ loading และ overhead positions",
    whoItsFor: "คนที่อยากสร้าง lower-body foundation เพื่อใช้กับ Open movements จำนวนมาก",
    focus: ["squat", "core", "coordination"],
    movementSlugs: ["air-squat", "goblet-squat", "front-squat", "overhead-squat", "thruster"],
    workoutIds: ["26.1"],
    accent: "#f59e0b",
  },
  {
    slug: "hanging-core-path",
    title: "Hanging Core Path",
    titleTH: "เส้นทางแกนกลางบนบาร์",
    description: "พัฒนา core compression และ hanging control ไปสู่ toes-to-bar",
    whoItsFor: "คนที่แกว่งตัวได้แต่ยังคุม midline ไม่ได้ หรืออยากเพิ่ม volume บนบาร์",
    focus: ["core", "hanging", "grip"],
    movementSlugs: ["hollow-rock", "kipping-pull-up", "knees-to-elbows", "toes-to-bar", "strict-toes-to-bar"],
    workoutIds: ["26.2"],
    accent: "#7c3aed",
  },
  {
    slug: "jump-rope-path",
    title: "Jump Rope Path",
    titleTH: "เส้นทางเชือกกระโดด",
    description: "สร้าง timing และ efficiency จาก single under ไปสู่ higher-skill rope work",
    whoItsFor: "คนที่โดน double-under ตัดเกมบ่อย หรืออยากทำเชือกให้ไม่เปลืองแรง",
    focus: ["coordination", "engine"],
    movementSlugs: ["single-under", "double-under", "crossovers"],
    workoutIds: [],
    accent: "#16a34a",
  },
  {
    slug: "barbell-olympic-path",
    title: "Barbell Olympic Path",
    titleTH: "เส้นทางโอลิมปิกบาร์เบล",
    description: "จาก receiving positions และ bar path ไปสู่ clean, snatch, และ jerk ที่ใช้งานได้",
    whoItsFor: "คนที่มี barbell basics แล้วและอยากฝึก lift ที่เจอบ่อยใน CrossFit",
    focus: ["coordination", "core", "overhead"],
    movementSlugs: ["front-squat", "power-clean", "squat-clean", "power-snatch", "push-jerk", "squat-snatch"],
    workoutIds: [],
    accent: "#ea580c",
  },
  {
    slug: "open-engine-path",
    title: "Open Engine Path",
    titleTH: "เส้นทาง Engine สำหรับ Open",
    description: "สร้าง cyclical engine และ movement turnover ที่ใช้กับ metcon จริง",
    whoItsFor: "คนที่อยากพัฒนา pacing, breathing, และ movement efficiency ใน workouts ยาว",
    focus: ["engine", "coordination"],
    movementSlugs: ["rowing", "assault-bike", "burpee", "wall-ball"],
    workoutIds: ["26.1"],
    accent: "#0f766e",
  },
];

export function getAllPathways() {
  return SKILL_PATHWAYS;
}

export function getPathwayBySlug(slug: string) {
  return SKILL_PATHWAYS.find(pathway => pathway.slug === slug);
}

export function getPathwaysForMovement(slug: string) {
  return SKILL_PATHWAYS.filter(pathway => pathway.movementSlugs.includes(slug));
}

export function getPathwaysForWorkout(workoutId: string) {
  return SKILL_PATHWAYS.filter(pathway => pathway.workoutIds.includes(workoutId));
}

export function getPathwayMovements(pathway: SkillPathway): MovementCatalogEntry[] {
  return pathway.movementSlugs
    .map(slug => getMovementBySlug(slug))
    .filter((movement): movement is MovementCatalogEntry => !!movement);
}
