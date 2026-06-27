import z from "zod";

export const emergencyTabSchema = z.object({
  emergencyName: z.string().min(1, "Emergency name is required"),
  emergencyPhone: z
    .string()
    .min(1, "Emergency phone is required")
    .max(10, "Emergency phone must be 10 digits"),
  emergencyRelation: z
    .string()
    .min(1, "Emergency relation is required")
    .max(50, "Emergency relation must be less than 50 characters"),
});

export type EmergencyTabFormValues = z.infer<typeof emergencyTabSchema>;
