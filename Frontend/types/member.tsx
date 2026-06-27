import type {
  MemberFormValues,
  MemberMetricsFormValues,
  UserFormValues,
} from "@/types/schema";

export type SingleMemberResponse = {
  id: string;
  avatarKey: string | null;
  coverKey: string | null;
  designation: string | null;
  dob: string;
  gender: string;
  hireDate: string | null;
  isActive: boolean;
  isKeyHolder: boolean;
  lastLoginAt: string | null;
  lifecycleId: string;
  lockedUntil: string | null;
  nicNumber: string | null;
  passwordHash: string;
  phone: string;
  qrSecret: string | null;
  resetExpires: string | null;
  resetToken: string | null;
  role: string;
  memberCode: string;
  joinDate: string;
  emailVerified: boolean;
  idVerificationStatus: string;
  idVerificationNote: string;
  idSubmittedAt: string;

  memberStatus: "active" | "inactive" | "suspended";
  subscriptionPlanId?: string | null;
  bloodType?:
    | "B+"
    | "A+"
    | "A-"
    | "B-"
    | "AB+"
    | "AB-"
    | "O+"
    | "O-"
    | null
    | undefined;
  occupation?: string | null | undefined;
  maritalStatus?:
    | "single"
    | "married"
    | "divorced"
    | "widowed"
    | null
    | undefined;
  address?: string | null | undefined;
  city?: string | null | undefined;
  state?: string | null | undefined;
  pincode?: string | null | undefined;
  fitnessGoals?: string | null | undefined;
  referralSource?: string | null | undefined;
  workoutTime?: string | null | undefined;
  notes?: string | null | undefined;
  emergencyName?: string | null | undefined;
  emergencyPhone?: string | null | undefined;
  emergencyRelation?: string | null | undefined;
};

export interface UserMetrics {
  id: string;
  lifecycleId: string;
  fullName: string | "";
  email: string;
  phone: string;
  dob: string; // ISO Date string
  gender: "male" | "female" | "other";
  nicNumber: string | null;
  role: string;
  isActive: boolean;
  employeeCode: string | null;
  hireDate: string | null;
  designation: string | null;
  avatarKey: string | null;
  coverKey: string | null;
}

export interface MemberMetricRecord {
  id?: string;
  lifecycleId?: string;
  personId?: string;
  recordedAt?: string | null;
  source?: "manual" | "trainer" | "device";
  weightKg?: number | string | null;
  heightCm?: number | string | null;
  bmi?: number | string | null;
  bodyFatPct?: number | string | null;
  muscleMassKg?: number | string | null;
  restingHr?: number | null;
  targetWeightKg?: number | string | null;
  notes?: string | null;
}

export interface MemberMetrics {
  workoutTime: string | null;
  weightKg: number | null;
  heightCm: number | null;
  bmi: number | null;
  restingHr: number | null;
  notes: string | null;
}

export interface MemberProfilePageProps {
  user: UserMetrics;
  member: SingleMemberResponse;
  memberMetrics: MemberMetricRecord[] | MemberMetricRecord;
}
