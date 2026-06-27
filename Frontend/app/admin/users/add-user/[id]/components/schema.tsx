import { z } from "zod";

export const overviewSchema = z.object({
  phone: z
    .number()
    .min(10, "Phone number is required")
    .max(10, "Phone number is required"),

  bloodGroup: z.string().min(1, "Blood group is required"),

  occupation: z
    .string()
    .min(1, "Occupation is required")
    .max(100, "Max 100 characters"),

  maritalStatus: z.string().min(1, "Marital status is required"),

  address: z
    .string()
    .min(5, "Address is too short")
    .max(200, "Max 200 characters"),

  city: z.string().min(2, "City is required").max(50, "Max 50 characters"),

  state: z.string().min(2, "State is required").max(50, "Max 50 characters"),

  pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),

  fitnessGoal: z.string().min(1, "Fitness goal is required"),

  workoutTime: z.string().min(1, "Preferred workout time is required"),

  referralSource: z.string().min(1, "This field is required"),

  notes: z.string().max(500, "Max 500 characters").optional().default(""),
});

// Infer type directly from schema — single source of truth
export type OverviewFormData = z.infer<typeof overviewSchema>;
