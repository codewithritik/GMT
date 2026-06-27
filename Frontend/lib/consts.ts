export const ROLE_OPTIONS: Record<string, string> = {
  member: "member",
  trainer: "trainer",
} as const;

export const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
] as const;

export const DATE_FORMAT = "YYYY-MM-DD";
export const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

export const MEMBER_STATUSES = ["active", "inactive", "suspended"];
export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
export const MARITAL_STATUSES = ["single", "married", "divorced", "widowed"];
export const FITNESS_GOALS = [
  "Muscle Building",
  "Weight Loss",
  "Endurance",
  "Flexibility",
  "General Fitness",
];
export const WORKOUT_TIMES = [
  "Morning (5 AM - 9 AM)",
  "Afternoon (12 PM - 4 PM)",
  "Evening (5 PM - 9 PM)",
  "Late Night (9 PM - 11 PM)",
];
export const REFERRAL_SOURCES = [
  "Friend Referral",
  "Social Media",
  "Google Search",
  "Newspaper",
  "Walk-in",
];

export const METRIC_SOURCES = ["manual", "trainer", "device"] as const;
