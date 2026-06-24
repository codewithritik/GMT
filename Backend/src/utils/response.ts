// Standardized API response format
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: { code: string; message: string; details?: unknown };
}

export function success<T>(data: T, message?: string): ApiResponse<T> {
  return { success: true, data, ...(message && { message }) };
}

export function error(code: string, message: string, details?: unknown): ApiResponse<never> {
  return { success: false, error: { code, message, ...(details ? { details } : {}) } };
}



const PROTECTED_FIELDS = [
  "id",
  "userId",
  "personId",
  "lifecycleId",
  "createdAt",
  "updatedAt",
  "passwordHash",
  "resetToken",
  "emailVerifyToken",
] as const;

export function sanitizePatch<T extends Record<string, any>>(obj: T, { allowNull = false } = {}) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => {
      if (PROTECTED_FIELDS.includes(key as any)) return false;
      if (value === undefined) return false;
      if (!allowNull && value === null) return false;
      if (value === "") return false;
      return true;
    })
  );
}
