import { BLOOD_GROUPS, MARITAL_STATUSES, MEMBER_STATUSES } from "@/lib/consts";
import { z } from "zod";

export const userSchema = z.object({
  email: z.email().or(z.literal("")),
  phone: z.string().min(10).max(15),
  gender: z.enum(["male", "female", "other"]),
  isActive: z.boolean(),
});

export type UserFormValues = z.infer<typeof userSchema>;

export const memberSchema = z.object({
  memberStatus: z.enum(MEMBER_STATUSES),

  bloodType: z.enum(BLOOD_GROUPS).nullable().optional(),

  occupation: z.string().nullable().optional(),

  maritalStatus: z.enum(MARITAL_STATUSES).nullable().optional(),

  address: z.string().nullable().optional(),

  city: z.string().nullable().optional(),

  state: z.string().nullable().optional(),

  pincode: z.string().nullable().optional(),

  fitnessGoals: z.string().nullable().optional(),

  referralSource: z.string().nullable().optional(),

  workoutTime: z.string().nullable().optional(),

  notes: z.string().nullable().optional(),
});

export type MemberFormValues = z.infer<typeof memberSchema>;

export const memberMetricsSchema = z.object({
  weightKg: z.number().min(1).max(500).nullable().optional(),

  heightCm: z.number().min(50).max(250).nullable().optional(),

  bmi: z.number().min(5).max(80).nullable().optional(),

  bodyFatPct: z.number().min(1).max(80).nullable().optional(),

  muscleMassKg: z.number().min(1).max(300).nullable().optional(),

  restingHr: z.number().min(30).max(220).nullable().optional(),

  targetWeightKg: z.number().min(1).max(500).nullable().optional(),

  notes: z.string().nullable().optional(),

  source: z.enum(["manual", "trainer", "device"]).optional(),
});

export type MemberMetricsFormValues = z.infer<typeof memberMetricsSchema>;

export const memberProfileSchema = z.object({
  user: userSchema,
  member: memberSchema,
  memberMetrics: memberMetricsSchema,
});

export type MemberProfileFormValues = z.infer<typeof memberProfileSchema>;
