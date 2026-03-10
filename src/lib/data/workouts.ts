export interface WorkoutDivision {
  name: "Rx" | "Scaled" | "Foundations";
  description: string;
  equipment: { women: string; men: string };
}

export interface WorkoutReadiness {
  keyDemands: string[];
  commonStickingPoints: string[];
  trainFirstMovementSlugs: string[];
  pathwaySlugs: string[];
}

export interface Workout {
  id: string;
  name: string;
  type: "AMRAP" | "For Time" | "Max Weight";
  timeCapMinutes: number;
  movements: string[];
  movementSlugs?: string[];  // slugs linking to /movements/[slug]
  divisions: WorkoutDivision[];
  image?: string;
  notes?: string[];
  completionRateRx: number;
  completionRateScaled: number;
  avgScoreRx: string;
  avgScoreScaled: string;
  topScoreRx: string;
  topScoreScaled: string;
  scoreDistribution: { label: string; count: number }[];
  readiness?: WorkoutReadiness;
  comingSoon?: boolean;
}

const WORKOUT_26_1_DESCRIPTION = `For time:
20 wall-ball shots
18 box jump-overs
30 wall-ball shots
18 box jump-overs
40 wall-ball shots
18 medicine-ball box step-overs
66 wall-ball shots
18 medicine-ball box step-overs
40 wall-ball shots
18 box jump-overs
30 wall-ball shots
18 box jump-overs
20 wall-ball shots

Time cap: 12 minutes`;

export const WORKOUTS: Workout[] = [
  {
    id: "26.1",
    name: "26.1",
    type: "For Time",
    timeCapMinutes: 12,
    movements: ["Wall-Ball Shots", "Box Jump-Overs", "Medicine-Ball Box Step-Overs"],
    movementSlugs: ["wall-ball", "box-jump-over", "box-jump-over"],
    image: "/workouts/26-1.jpg",
    notes: [
      "Only one medicine ball may be used during the workout.",
      "The box must be placed at least 10 feet away from the wall-ball station for safety.",
    ],
    divisions: [
      {
        name: "Rx",
        description: WORKOUT_26_1_DESCRIPTION,
        equipment: {
          women: "14-lb (6-kg) medicine ball, 9-foot target, 20-inch box",
          men: "20-lb (9-kg) medicine ball, 10-ft target, 24-inch box",
        },
      },
      {
        name: "Scaled",
        description: WORKOUT_26_1_DESCRIPTION,
        equipment: {
          women: "10-lb (4-kg) medicine ball, 9-foot target, 20-inch box (may step up)",
          men: "14-lb (6-kg) medicine ball, 10-foot target, 24-inch box (may step up)",
        },
      },
      {
        name: "Foundations",
        description: WORKOUT_26_1_DESCRIPTION.replace(/box jump-overs/g, "box step-overs"),
        equipment: {
          women: "10-lb (4-kg) medicine ball to a 9-foot target, 20-inch box",
          men: "14-lb (6-kg) medicine ball to a 10-foot target, 20-inch box",
        },
      },
    ],
    completionRateRx: 65,
    completionRateScaled: 35,
    avgScoreRx: "—",
    avgScoreScaled: "—",
    topScoreRx: "—",
    topScoreScaled: "—",
    scoreDistribution: [
      { label: "< 3:00", count: 0 },
      { label: "3:00–5:59", count: 0 },
      { label: "6:00–8:59", count: 0 },
      { label: "9:00–11:59", count: 0 },
      { label: "Time Cap", count: 0 },
    ],
    readiness: {
      keyDemands: [
        "squat endurance",
        "wall-ball efficiency",
        "cyclical breathing under fatigue",
        "jump-over rhythm and pacing",
      ],
      commonStickingPoints: [
        "เปิดเร็วเกินไปที่ wall ball แล้วขาหายตั้งแต่กลาง workout",
        "เสีย breathing rhythm จนต้องพักหน้ากล่องนาน",
        "box jump-over turnover ช้าลงมากหลังหัวใจขึ้นสูง",
      ],
      trainFirstMovementSlugs: ["air-squat", "wall-ball", "box-jump-over", "thruster"],
      pathwaySlugs: ["squat-path", "open-engine-path"],
    },
  },
  {
    id: "26.2",
    name: "26.2",
    type: "For Time",
    timeCapMinutes: 15,
    movements: ["Dumbbell Overhead Walking Lunge", "Alternating Dumbbell Snatches", "Pull-Ups", "Chest-to-Bar Pull-Ups", "Ring Muscle-Ups"],
    movementSlugs: ["db-walking-lunge", "db-snatch", "kipping-pull-up", "chest-to-bar", "kipping-muscle-up"],
    image: "/workouts/26-2.jpg",
    notes: [
      "The dumbbell must remain at least 5 feet away from the pull-up bar and rings.",
      "As long as 80 feet of overhead walking lunges are completed, the lunge track may be shorter than 20 feet, but cannot be longer than 20 feet.",
      "Each rep of overhead walking lunges is 20 feet. Athletes may not lower the dumbbell before completing 20 feet.",
      "Gymnastics grips are NOT allowed during the dumbbell snatches.",
    ],
    divisions: [
      {
        name: "Rx",
        description: `For time:\n80-foot dumbbell overhead walking lunge\n20 alternating dumbbell snatches\n20 pull-ups\n\n80-foot dumbbell overhead walking lunge\n20 alternating dumbbell snatches\n20 chest-to-bar pull-ups\n\n80-foot dumbbell overhead walking lunge\n20 alternating dumbbell snatches\n20 ring muscle-ups\n\nTime cap: 15 minutes`,
        equipment: {
          women: "35-lb (15-kg) dumbbell",
          men: "50-lb (22.5-kg) dumbbell",
        },
      },
      {
        name: "Scaled",
        description: `For time:\n80-foot dumbbell overhead walking lunge\n20 alternating dumbbell snatches\n20 jumping pull-ups\n\n80-foot dumbbell overhead walking lunge\n20 alternating dumbbell snatches\n20 pull-ups\n\n80-foot dumbbell overhead walking lunge\n20 alternating dumbbell snatches\n20 chest-to-bar pull-ups\n\nTime cap: 15 minutes`,
        equipment: {
          women: "20-lb (10-kg) dumbbell",
          men: "35-lb (15-kg) dumbbell",
        },
      },
      {
        name: "Foundations",
        description: `For time:\n80-foot walking lunge\n20 alternating dumbbell snatches\n20 bent-over rows\n\n80-foot walking lunge\n20 alternating dumbbell snatches\n20 ring rows\n\n80-foot walking lunge\n20 alternating dumbbell snatches\n20 jumping pull-ups\n\nTime cap: 15 minutes\n\n*The loads are a suggested starting point. If you are completing all the workouts in the Foundations division, you are free to decrease or increase the load as your skill level allows.`,
        equipment: {
          women: "20-lb (10-kg) dumbbell",
          men: "35-lb (15-kg) dumbbell",
        },
      },
    ],
    completionRateRx: 0,
    completionRateScaled: 0,
    avgScoreRx: "—",
    avgScoreScaled: "—",
    topScoreRx: "—",
    topScoreScaled: "—",
    scoreDistribution: [
      { label: "< 5:00", count: 0 },
      { label: "5:00–7:59", count: 0 },
      { label: "8:00–10:59", count: 0 },
      { label: "11:00–13:59", count: 0 },
      { label: "Time Cap", count: 0 },
    ],
    readiness: {
      keyDemands: [
        "overhead stability under fatigue",
        "advanced pulling progression",
        "grip management",
        "transition efficiency between dumbbell and rig",
      ],
      commonStickingPoints: [
        "overhead lunge ตัดเกมก่อนเข้าชุด pull-up",
        "pulling skill ไม่พอ ทำให้ติดอยู่ที่รอบกลาง",
        "grip หมดก่อนถึง chest-to-bar หรือ muscle-up",
      ],
      trainFirstMovementSlugs: ["db-walking-lunge", "kipping-pull-up", "chest-to-bar", "kipping-muscle-up"],
      pathwaySlugs: ["pulling-path", "hanging-core-path"],
    },
  },
  {
    id: "26.3",
    name: "26.3",
    type: "For Time",
    timeCapMinutes: 0,
    movements: [],
    image: undefined,
    notes: undefined,
    divisions: [],
    completionRateRx: 0,
    completionRateScaled: 0,
    avgScoreRx: "—",
    avgScoreScaled: "—",
    topScoreRx: "—",
    topScoreScaled: "—",
    scoreDistribution: [],
    comingSoon: true,
  },
];

/** Returns all workouts that contain the given movement slug */
export function getWorkoutsContainingMovement(slug: string): Workout[] {
  return WORKOUTS.filter(w => w.movementSlugs?.includes(slug));
}

export function getWorkoutById(id: string): Workout | undefined {
  return WORKOUTS.find(workout => workout.id === id);
}

export const SUMMARY_STATS = {
  totalAthletes: 604,
  totalAffiliates: 24,
  totalProvinces: 7,
  year: 2026,
  edition: "CrossFit Open 26",
  divisions: [
    { name: "Men Rx", count: 112 },
    { name: "Women Rx", count: 98 },
    { name: "Men Scaled", count: 68 },
    { name: "Women Scaled", count: 54 },
    { name: "Men Masters 35-39", count: 28 },
    { name: "Women Masters 35-39", count: 22 },
    { name: "Men Masters 40-44", count: 8 },
    { name: "Women Masters 40-44", count: 6 },
  ],
  participationByYear: [
    { year: 2017, men: 101, women: 69,  total: 170 },
    { year: 2018, men: 153, women: 116, total: 269 },
    { year: 2019, men: 114, women: 77,  total: 191 },
    { year: 2020, men: 77,  women: 69,  total: 146 },
    { year: 2021, men: 79,  women: 76,  total: 155 },
    { year: 2022, men: 82,  women: 93,  total: 175 },
    { year: 2023, men: 98,  women: 100, total: 198 },
    { year: 2024, men: 116, women: 116, total: 232 },
    { year: 2025, men: 201, women: 159, total: 360 },
    { year: 2026, men: 308, women: 296, total: 604 },
  ],
};
