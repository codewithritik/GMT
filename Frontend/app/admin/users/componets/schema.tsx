// ─── Schema ───────────────────────────────────────────────────────────────────

import { useForm } from "react-hook-form";
import z from "zod";

export const memberSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phone: z.string().min(10, 'Valid phone number required'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    gender: z.enum(['male', 'female', 'other'] as const, { message: 'Gender is required' }),
    bloodGroup: z.string().optional(),
    address: z.string().optional(),
    subscriptionPlanId: z.string().min(1, 'Membership plan is required'),
    dateOfJoining: z.string().min(1, 'date of joining is required'),
    assignedTrainerId: z.string().min(1, 'Assigned trainer is required'),
    fitnessGoal: z.enum(['weight_loss', 'muscle_gain', 'general_fitness', 'rehabilitation']).optional(),
    medicalConditions: z.string().optional(),
    injuries: z.string().optional(),
    emergencyName: z.string().optional(),
    emergencyPhone: z.string().optional(),
    emergencyRelation: z.string().optional(),
    status: z.enum(['active', 'inactive', 'suspended'])
});

export const trainerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phone: z.string().min(10, 'Valid phone number required'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    gender: z.enum(['male', 'female', 'other']).optional(),
    bloodGroup: z.string().optional(),
    address: z.string().optional(),
    designation: z.string().optional(),
    specialization: z.string().optional(),
    emergencyName: z.string().optional(),
    emergencyPhone: z.string().optional(),
    emergencyRelation: z.string().optional(),
    dateOfJoining: z.string().optional(),
    status: z.enum(['active', 'inactive', 'suspended'])
});

export const schema = z.discriminatedUnion('role', [
    memberSchema.extend({ role: z.literal('member') }),
    trainerSchema.extend({ role: z.literal('trainer') }),
]);

export type FormData = z.infer<typeof schema>;

export type Errors = Record<string, { message?: string }>;
export type Reg = ReturnType<ReturnType<typeof useForm<FormData>>['register']>;