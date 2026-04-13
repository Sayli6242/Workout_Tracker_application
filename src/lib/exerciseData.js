// Static exercise library — mirrors backend seed data
// Used for fast client-side filtering without an extra API call

export const EXERCISES = [
  // ── CHEST ──────────────────────────────────────────────────────────────────
  { id: "bench-press",          name: "Barbell Bench Press",      muscle_group: "chest",      secondary_muscles: "triceps,shoulders", equipment: "barbell",     category: "strength",    difficulty: "intermediate" },
  { id: "incline-bench-press",  name: "Incline Bench Press",      muscle_group: "chest",      secondary_muscles: "triceps,shoulders", equipment: "barbell",     category: "strength",    difficulty: "intermediate" },
  { id: "decline-bench-press",  name: "Decline Bench Press",      muscle_group: "chest",      secondary_muscles: "triceps",           equipment: "barbell",     category: "strength",    difficulty: "intermediate" },
  { id: "db-bench-press",       name: "Dumbbell Bench Press",     muscle_group: "chest",      secondary_muscles: "triceps,shoulders", equipment: "dumbbell",    category: "strength",    difficulty: "beginner"     },
  { id: "incline-db-press",     name: "Incline Dumbbell Press",   muscle_group: "chest",      secondary_muscles: "triceps,shoulders", equipment: "dumbbell",    category: "strength",    difficulty: "intermediate" },
  { id: "db-fly",               name: "Dumbbell Fly",             muscle_group: "chest",      secondary_muscles: "",                  equipment: "dumbbell",    category: "strength",    difficulty: "intermediate" },
  { id: "cable-crossover",      name: "Cable Crossover",          muscle_group: "chest",      secondary_muscles: "",                  equipment: "cable",       category: "strength",    difficulty: "intermediate" },
  { id: "push-up",              name: "Push-Up",                  muscle_group: "chest",      secondary_muscles: "triceps,core",      equipment: "bodyweight",  category: "strength",    difficulty: "beginner"     },
  { id: "chest-dip",            name: "Chest Dip",                muscle_group: "chest",      secondary_muscles: "triceps,shoulders", equipment: "bodyweight",  category: "strength",    difficulty: "intermediate" },
  { id: "pec-deck",             name: "Pec Deck Machine",         muscle_group: "chest",      secondary_muscles: "",                  equipment: "machine",     category: "strength",    difficulty: "beginner"     },

  // ── BACK ───────────────────────────────────────────────────────────────────
  { id: "deadlift",             name: "Deadlift",                 muscle_group: "back",       secondary_muscles: "glutes,hamstrings,core", equipment: "barbell",  category: "strength",    difficulty: "advanced"     },
  { id: "barbell-row",          name: "Barbell Row",              muscle_group: "back",       secondary_muscles: "biceps,core",       equipment: "barbell",     category: "strength",    difficulty: "intermediate" },
  { id: "pull-up",              name: "Pull-Up",                  muscle_group: "back",       secondary_muscles: "biceps,core",       equipment: "pull_up_bar", category: "strength",    difficulty: "intermediate" },
  { id: "chin-up",              name: "Chin-Up",                  muscle_group: "back",       secondary_muscles: "biceps",            equipment: "pull_up_bar", category: "strength",    difficulty: "intermediate" },
  { id: "lat-pulldown",         name: "Lat Pulldown",             muscle_group: "back",       secondary_muscles: "biceps",            equipment: "cable",       category: "strength",    difficulty: "beginner"     },
  { id: "seated-cable-row",     name: "Seated Cable Row",         muscle_group: "back",       secondary_muscles: "biceps",            equipment: "cable",       category: "strength",    difficulty: "beginner"     },
  { id: "dumbbell-row",         name: "Dumbbell Row",             muscle_group: "back",       secondary_muscles: "biceps",            equipment: "dumbbell",    category: "strength",    difficulty: "beginner"     },
  { id: "t-bar-row",            name: "T-Bar Row",                muscle_group: "back",       secondary_muscles: "biceps,core",       equipment: "barbell",     category: "strength",    difficulty: "intermediate" },
  { id: "face-pull",            name: "Face Pull",                muscle_group: "back",       secondary_muscles: "shoulders",         equipment: "cable",       category: "strength",    difficulty: "beginner"     },
  { id: "hyperextension",       name: "Back Extension",           muscle_group: "back",       secondary_muscles: "glutes,hamstrings", equipment: "machine",     category: "strength",    difficulty: "beginner"     },

  // ── SHOULDERS ──────────────────────────────────────────────────────────────
  { id: "ohp",                  name: "Overhead Press",           muscle_group: "shoulders",  secondary_muscles: "triceps,core",      equipment: "barbell",     category: "strength",    difficulty: "intermediate" },
  { id: "seated-db-press",      name: "Seated Dumbbell Press",    muscle_group: "shoulders",  secondary_muscles: "triceps",           equipment: "dumbbell",    category: "strength",    difficulty: "beginner"     },
  { id: "lateral-raise",        name: "Lateral Raise",            muscle_group: "shoulders",  secondary_muscles: "",                  equipment: "dumbbell",    category: "strength",    difficulty: "beginner"     },
  { id: "front-raise",          name: "Front Raise",              muscle_group: "shoulders",  secondary_muscles: "",                  equipment: "dumbbell",    category: "strength",    difficulty: "beginner"     },
  { id: "rear-delt-fly",        name: "Rear Delt Fly",            muscle_group: "shoulders",  secondary_muscles: "back",              equipment: "dumbbell",    category: "strength",    difficulty: "beginner"     },
  { id: "arnold-press",         name: "Arnold Press",             muscle_group: "shoulders",  secondary_muscles: "triceps",           equipment: "dumbbell",    category: "strength",    difficulty: "intermediate" },
  { id: "upright-row",          name: "Upright Row",              muscle_group: "shoulders",  secondary_muscles: "biceps,traps",      equipment: "barbell",     category: "strength",    difficulty: "intermediate" },
  { id: "shrugs",               name: "Dumbbell Shrug",           muscle_group: "shoulders",  secondary_muscles: "",                  equipment: "dumbbell",    category: "strength",    difficulty: "beginner"     },

  // ── BICEPS ─────────────────────────────────────────────────────────────────
  { id: "barbell-curl",         name: "Barbell Curl",             muscle_group: "biceps",     secondary_muscles: "forearms",          equipment: "barbell",     category: "strength",    difficulty: "beginner"     },
  { id: "dumbbell-curl",        name: "Dumbbell Curl",            muscle_group: "biceps",     secondary_muscles: "forearms",          equipment: "dumbbell",    category: "strength",    difficulty: "beginner"     },
  { id: "hammer-curl",          name: "Hammer Curl",              muscle_group: "biceps",     secondary_muscles: "forearms",          equipment: "dumbbell",    category: "strength",    difficulty: "beginner"     },
  { id: "incline-db-curl",      name: "Incline Dumbbell Curl",    muscle_group: "biceps",     secondary_muscles: "",                  equipment: "dumbbell",    category: "strength",    difficulty: "intermediate" },
  { id: "cable-curl",           name: "Cable Curl",               muscle_group: "biceps",     secondary_muscles: "forearms",          equipment: "cable",       category: "strength",    difficulty: "beginner"     },
  { id: "concentration-curl",   name: "Concentration Curl",       muscle_group: "biceps",     secondary_muscles: "",                  equipment: "dumbbell",    category: "strength",    difficulty: "beginner"     },
  { id: "preacher-curl",        name: "Preacher Curl",            muscle_group: "biceps",     secondary_muscles: "forearms",          equipment: "barbell",     category: "strength",    difficulty: "intermediate" },

  // ── TRICEPS ────────────────────────────────────────────────────────────────
  { id: "close-grip-bench",     name: "Close-Grip Bench Press",   muscle_group: "triceps",    secondary_muscles: "chest,shoulders",   equipment: "barbell",     category: "strength",    difficulty: "intermediate" },
  { id: "skull-crusher",        name: "Skull Crusher",            muscle_group: "triceps",    secondary_muscles: "",                  equipment: "barbell",     category: "strength",    difficulty: "intermediate" },
  { id: "tricep-pushdown",      name: "Tricep Pushdown",          muscle_group: "triceps",    secondary_muscles: "",                  equipment: "cable",       category: "strength",    difficulty: "beginner"     },
  { id: "oh-tricep-ext",        name: "Overhead Tricep Extension",muscle_group: "triceps",    secondary_muscles: "",                  equipment: "dumbbell",    category: "strength",    difficulty: "beginner"     },
  { id: "tricep-dip",           name: "Tricep Dip",               muscle_group: "triceps",    secondary_muscles: "chest,shoulders",   equipment: "bodyweight",  category: "strength",    difficulty: "intermediate" },
  { id: "diamond-push-up",      name: "Diamond Push-Up",          muscle_group: "triceps",    secondary_muscles: "chest",             equipment: "bodyweight",  category: "strength",    difficulty: "intermediate" },
  { id: "kickback",             name: "Tricep Kickback",          muscle_group: "triceps",    secondary_muscles: "",                  equipment: "dumbbell",    category: "strength",    difficulty: "beginner"     },

  // ── QUADS ──────────────────────────────────────────────────────────────────
  { id: "squat",                name: "Barbell Back Squat",       muscle_group: "quads",      secondary_muscles: "glutes,hamstrings,core", equipment: "barbell",  category: "strength",   difficulty: "intermediate" },
  { id: "front-squat",          name: "Front Squat",              muscle_group: "quads",      secondary_muscles: "core,glutes",       equipment: "barbell",     category: "strength",    difficulty: "advanced"     },
  { id: "leg-press",            name: "Leg Press",                muscle_group: "quads",      secondary_muscles: "glutes,hamstrings", equipment: "machine",     category: "strength",    difficulty: "beginner"     },
  { id: "leg-extension",        name: "Leg Extension",            muscle_group: "quads",      secondary_muscles: "",                  equipment: "machine",     category: "strength",    difficulty: "beginner"     },
  { id: "hack-squat",           name: "Hack Squat",               muscle_group: "quads",      secondary_muscles: "glutes",            equipment: "machine",     category: "strength",    difficulty: "intermediate" },
  { id: "bulgarian-split-squat",name: "Bulgarian Split Squat",    muscle_group: "quads",      secondary_muscles: "glutes,hamstrings", equipment: "dumbbell",    category: "strength",    difficulty: "intermediate" },
  { id: "lunge",                name: "Dumbbell Lunge",           muscle_group: "quads",      secondary_muscles: "glutes,hamstrings", equipment: "dumbbell",    category: "strength",    difficulty: "beginner"     },
  { id: "goblet-squat",         name: "Goblet Squat",             muscle_group: "quads",      secondary_muscles: "glutes,core",       equipment: "kettlebell",  category: "strength",    difficulty: "beginner"     },
  { id: "step-up",              name: "Step-Up",                  muscle_group: "quads",      secondary_muscles: "glutes",            equipment: "dumbbell",    category: "strength",    difficulty: "beginner"     },

  // ── HAMSTRINGS ─────────────────────────────────────────────────────────────
  { id: "rdl",                  name: "Romanian Deadlift",        muscle_group: "hamstrings", secondary_muscles: "glutes,back",       equipment: "barbell",     category: "strength",    difficulty: "intermediate" },
  { id: "leg-curl",             name: "Lying Leg Curl",           muscle_group: "hamstrings", secondary_muscles: "",                  equipment: "machine",     category: "strength",    difficulty: "beginner"     },
  { id: "seated-leg-curl",      name: "Seated Leg Curl",          muscle_group: "hamstrings", secondary_muscles: "",                  equipment: "machine",     category: "strength",    difficulty: "beginner"     },
  { id: "stiff-leg-deadlift",   name: "Stiff-Leg Deadlift",       muscle_group: "hamstrings", secondary_muscles: "glutes,back",       equipment: "barbell",     category: "strength",    difficulty: "intermediate" },
  { id: "good-morning",         name: "Good Morning",             muscle_group: "hamstrings", secondary_muscles: "glutes,back",       equipment: "barbell",     category: "strength",    difficulty: "intermediate" },
  { id: "db-rdl",               name: "Dumbbell Romanian Deadlift",muscle_group: "hamstrings",secondary_muscles: "glutes",            equipment: "dumbbell",    category: "strength",    difficulty: "beginner"     },

  // ── GLUTES ─────────────────────────────────────────────────────────────────
  { id: "hip-thrust",           name: "Hip Thrust",               muscle_group: "glutes",     secondary_muscles: "hamstrings,quads",  equipment: "barbell",     category: "strength",    difficulty: "intermediate" },
  { id: "glute-bridge",         name: "Glute Bridge",             muscle_group: "glutes",     secondary_muscles: "hamstrings",        equipment: "bodyweight",  category: "strength",    difficulty: "beginner"     },
  { id: "cable-kickback",       name: "Cable Kickback",           muscle_group: "glutes",     secondary_muscles: "",                  equipment: "cable",       category: "strength",    difficulty: "beginner"     },
  { id: "sumo-deadlift",        name: "Sumo Deadlift",            muscle_group: "glutes",     secondary_muscles: "hamstrings,quads,back", equipment: "barbell", category: "strength",    difficulty: "intermediate" },
  { id: "donkey-kick",          name: "Donkey Kick",              muscle_group: "glutes",     secondary_muscles: "",                  equipment: "bodyweight",  category: "strength",    difficulty: "beginner"     },

  // ── CALVES ─────────────────────────────────────────────────────────────────
  { id: "standing-calf-raise",  name: "Standing Calf Raise",      muscle_group: "calves",     secondary_muscles: "",                  equipment: "machine",     category: "strength",    difficulty: "beginner"     },
  { id: "seated-calf-raise",    name: "Seated Calf Raise",        muscle_group: "calves",     secondary_muscles: "",                  equipment: "machine",     category: "strength",    difficulty: "beginner"     },
  { id: "single-leg-calf",      name: "Single-Leg Calf Raise",    muscle_group: "calves",     secondary_muscles: "",                  equipment: "bodyweight",  category: "strength",    difficulty: "beginner"     },
  { id: "donkey-calf-raise",    name: "Donkey Calf Raise",        muscle_group: "calves",     secondary_muscles: "",                  equipment: "bodyweight",  category: "strength",    difficulty: "intermediate" },

  // ── CORE ───────────────────────────────────────────────────────────────────
  { id: "plank",                name: "Plank",                    muscle_group: "core",       secondary_muscles: "shoulders,glutes",  equipment: "bodyweight",  category: "strength",    difficulty: "beginner"     },
  { id: "crunch",               name: "Crunch",                   muscle_group: "core",       secondary_muscles: "",                  equipment: "bodyweight",  category: "strength",    difficulty: "beginner"     },
  { id: "russian-twist",        name: "Russian Twist",            muscle_group: "core",       secondary_muscles: "",                  equipment: "bodyweight",  category: "strength",    difficulty: "beginner"     },
  { id: "leg-raise",            name: "Hanging Leg Raise",        muscle_group: "core",       secondary_muscles: "",                  equipment: "pull_up_bar", category: "strength",    difficulty: "intermediate" },
  { id: "ab-wheel",             name: "Ab Wheel Rollout",         muscle_group: "core",       secondary_muscles: "back,shoulders",    equipment: "other",       category: "strength",    difficulty: "advanced"     },
  { id: "cable-crunch",         name: "Cable Crunch",             muscle_group: "core",       secondary_muscles: "",                  equipment: "cable",       category: "strength",    difficulty: "intermediate" },
  { id: "side-plank",           name: "Side Plank",               muscle_group: "core",       secondary_muscles: "",                  equipment: "bodyweight",  category: "strength",    difficulty: "beginner"     },
  { id: "mountain-climber",     name: "Mountain Climber",         muscle_group: "core",       secondary_muscles: "",                  equipment: "bodyweight",  category: "cardio",      difficulty: "beginner"     },
  { id: "hanging-knee-raise",   name: "Hanging Knee Raise",       muscle_group: "core",       secondary_muscles: "",                  equipment: "pull_up_bar", category: "strength",    difficulty: "intermediate" },
  { id: "bicycle-crunch",       name: "Bicycle Crunch",           muscle_group: "core",       secondary_muscles: "",                  equipment: "bodyweight",  category: "strength",    difficulty: "beginner"     },

  // ── CARDIO ─────────────────────────────────────────────────────────────────
  { id: "running",              name: "Running",                  muscle_group: "cardio",     secondary_muscles: "quads,calves",      equipment: "bodyweight",  category: "cardio",      difficulty: "beginner"     },
  { id: "cycling",              name: "Stationary Cycling",       muscle_group: "cardio",     secondary_muscles: "quads,hamstrings",  equipment: "machine",     category: "cardio",      difficulty: "beginner"     },
  { id: "jump-rope",            name: "Jump Rope",                muscle_group: "cardio",     secondary_muscles: "calves,shoulders",  equipment: "other",       category: "cardio",      difficulty: "beginner"     },
  { id: "burpee",               name: "Burpee",                   muscle_group: "cardio",     secondary_muscles: "chest,core,quads",  equipment: "bodyweight",  category: "cardio",      difficulty: "intermediate" },
  { id: "box-jump",             name: "Box Jump",                 muscle_group: "cardio",     secondary_muscles: "quads,glutes",      equipment: "other",       category: "cardio",      difficulty: "intermediate" },
  { id: "rowing-machine",       name: "Rowing Machine",           muscle_group: "cardio",     secondary_muscles: "back,arms,core",    equipment: "machine",     category: "cardio",      difficulty: "intermediate" },
  { id: "elliptical",           name: "Elliptical",               muscle_group: "cardio",     secondary_muscles: "",                  equipment: "machine",     category: "cardio",      difficulty: "beginner"     },
  { id: "stair-climber",        name: "Stair Climber",            muscle_group: "cardio",     secondary_muscles: "glutes,quads",      equipment: "machine",     category: "cardio",      difficulty: "beginner"     },
  { id: "hiit-sprint",          name: "Sprint Intervals",         muscle_group: "cardio",     secondary_muscles: "quads,hamstrings",  equipment: "bodyweight",  category: "cardio",      difficulty: "intermediate" },
  { id: "battle-ropes",         name: "Battle Ropes",             muscle_group: "cardio",     secondary_muscles: "shoulders,core",    equipment: "other",       category: "cardio",      difficulty: "intermediate" },

  // ── FULL BODY ──────────────────────────────────────────────────────────────
  { id: "clean-and-press",      name: "Clean and Press",          muscle_group: "full_body",  secondary_muscles: "back,shoulders,quads", equipment: "barbell",  category: "strength",    difficulty: "advanced"     },
  { id: "thruster",             name: "Thruster",                 muscle_group: "full_body",  secondary_muscles: "quads,shoulders",   equipment: "barbell",     category: "strength",    difficulty: "intermediate" },
  { id: "kettlebell-swing",     name: "Kettlebell Swing",         muscle_group: "full_body",  secondary_muscles: "glutes,hamstrings,core", equipment: "kettlebell", category: "strength", difficulty: "intermediate" },
  { id: "turkish-get-up",       name: "Turkish Get-Up",           muscle_group: "full_body",  secondary_muscles: "core,shoulders",    equipment: "kettlebell",  category: "strength",    difficulty: "advanced"     },
  { id: "man-maker",            name: "Man Maker",                muscle_group: "full_body",  secondary_muscles: "chest,back,core",   equipment: "dumbbell",    category: "strength",    difficulty: "advanced"     },
  { id: "farmers-walk",         name: "Farmer's Walk",            muscle_group: "full_body",  secondary_muscles: "core,forearms",     equipment: "dumbbell",    category: "strength",    difficulty: "beginner"     },
  { id: "kettlebell-swing",     name: "Kettlebell Swing",         muscle_group: "full_body",  secondary_muscles: "glutes,core",       equipment: "kettlebell",  category: "strength",    difficulty: "intermediate" },
];

export const MUSCLE_GROUPS = [
  "chest", "back", "shoulders", "biceps", "triceps",
  "forearms", "quads", "hamstrings", "glutes", "calves",
  "core", "full_body", "cardio"
];

export const EQUIPMENT_TYPES = [
  "barbell", "dumbbell", "cable", "machine",
  "bodyweight", "kettlebell", "resistance_band", "pull_up_bar", "other"
];

export const MUSCLE_GROUP_LABELS = {
  chest: "Chest", back: "Back", shoulders: "Shoulders",
  biceps: "Biceps", triceps: "Triceps", forearms: "Forearms",
  quads: "Quads", hamstrings: "Hamstrings", glutes: "Glutes",
  calves: "Calves", core: "Core", full_body: "Full Body", cardio: "Cardio"
};

export const EQUIPMENT_LABELS = {
  barbell: "Barbell", dumbbell: "Dumbbell", cable: "Cable",
  machine: "Machine", bodyweight: "Bodyweight", kettlebell: "Kettlebell",
  resistance_band: "Resistance Band", pull_up_bar: "Pull-Up Bar", other: "Other"
};

export const MUSCLE_GROUP_COLORS = {
  chest: "bg-red-500/20 text-red-400",
  back: "bg-blue-500/20 text-blue-400",
  shoulders: "bg-orange-500/20 text-orange-400",
  biceps: "bg-yellow-500/20 text-yellow-400",
  triceps: "bg-amber-500/20 text-amber-400",
  forearms: "bg-lime-500/20 text-lime-400",
  quads: "bg-green-500/20 text-green-400",
  hamstrings: "bg-teal-500/20 text-teal-400",
  glutes: "bg-cyan-500/20 text-cyan-400",
  calves: "bg-sky-500/20 text-sky-400",
  core: "bg-indigo-500/20 text-indigo-400",
  full_body: "bg-purple-500/20 text-purple-400",
  cardio: "bg-pink-500/20 text-pink-400",
};
