"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Scale,
  Ruler,
  Activity,
  Heart,
  Target,
  Pencil,
  Save,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MemberProfilePageProps,
  MemberMetricRecord,
  SingleMemberResponse,
} from "@/types/member";
import apiClient from "@/lib/api";
import { MemberMetricsFormValues, memberMetricsSchema } from "@/types/schema";
import dayjs from "dayjs";
import { DATE_FORMAT, DATE_TIME_FORMAT } from "@/lib/consts";
import {
  EmergencyTabFormValues,
  emergencyTabSchema,
} from "@/types/admin/user/tabSchema";

const inputCls =
  "bg-[#1a1f2e] border-[#2a3044] text-white focus-visible:ring-1 focus-visible:ring-red-500/40 placeholder:text-gray-600";

function ReadValue({ value }: { value: string }) {
  return (
    <p className="text-white text-sm py-2 px-3 rounded-md bg-[#1a1f2e]/50 border border-transparent min-h-[36px] w-full">
      {value || ""}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-white font-semibold text-base mb-5">{children}</h3>
  );
}

function toNumber(value: number | string | null | undefined): number | null {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function formatMetric(
  value: number | string | null | undefined,
  suffix = "",
): string {
  const n = toNumber(value);
  if (n == null) return "—";
  return `${n}${suffix}`;
}

function calcBmi(
  weightKg: number | null,
  heightCm: number | null,
): number | null {
  if (weightKg == null || heightCm == null || heightCm <= 0) return null;
  const bmi = weightKg / (heightCm / 100) ** 2;
  return Math.round(bmi * 10) / 10;
}

function emptyEmergency(): EmergencyTabFormValues {
  return {
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
  };
}

function recordToFormValues(
  record?: SingleMemberResponse | null,
): EmergencyTabFormValues {
  if (!record) return emptyEmergency();

  return {
    emergencyName: record.emergencyName ?? "",
    emergencyPhone: record.emergencyPhone ?? "",
    emergencyRelation: record.emergencyRelation ?? "",
  };
}

const numberField = {
  setValueAs: (v: string) => (v === "" ? null : Number(v)),
};

export default function EmergencyTab({
  data,
}: {
  data: MemberProfilePageProps;
}) {
  const { member, user } = data;
  // const latestRecord = getLatestMetric(member);

  const [isEditing, setIsEditing] = useState(false);
  const [savedData, setSavedData] = useState<EmergencyTabFormValues>(
    recordToFormValues(member as SingleMemberResponse),
  );
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EmergencyTabFormValues>({
    resolver: zodResolver(emergencyTabSchema),
    defaultValues: recordToFormValues(member as SingleMemberResponse),
  });

  const onSubmit = (formData: EmergencyTabFormValues) => {
    const payload: EmergencyTabFormValues = formData;

    setSavedData(payload);
    setIsEditing(false);

    apiClient
      .patch(`/ops/members/${user.id}/metrics`, { member: payload })
      .then(() => console.log("Health metrics updated"))
      .catch((err) => console.error("Health metrics update failed", err));
  };

  const handleCancel = () => {
    reset(savedData);
    setIsEditing(false);
  };

  const handleDoubleClick = () => {
    if (!isEditing) {
      reset(savedData);
      setIsEditing(true);
    }
  };

  return (
    <div onDoubleClick={handleDoubleClick}>
      <div className="flex items-center justify-between mb-6">
        {!isEditing ? (
          <p className="text-gray-500 text-xs select-none">
            Double-click anywhere to edit
          </p>
        ) : (
          <p className="text-red-400 text-xs select-none">Editing mode</p>
        )}

        <div className="flex gap-2">
          {!isEditing && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                reset(savedData);
                setIsEditing(true);
              }}
              className="border-[#2a3044] text-gray-400 hover:text-white hover:bg-[#2a3044] gap-1.5">
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, (invalid) =>
          console.log("validation failed", invalid),
        )}
        onDoubleClick={(e) => e.stopPropagation()}
        className="space-y-8">
        {/* ── Body Metrics ── */}
        <section>
          <SectionTitle>Body Metrics</SectionTitle>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            <div className="space-y-1.5">
              <Label className="text-gray-400 text-sm flex items-center gap-1.5">
                <Scale className="h-3.5 w-3.5" />
                Emergency Name
              </Label>
              {isEditing ? (
                <>
                  <Input
                    type="text"
                    {...register("emergencyName")}
                    className={inputCls}
                    placeholder="Full name"
                  />
                  {errors.emergencyName && (
                    <p className="text-red-400 text-xs">
                      {errors.emergencyName.message}
                    </p>
                  )}
                </>
              ) : (
                <ReadValue value={savedData.emergencyName} />
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-gray-400 text-sm flex items-center gap-1.5">
                <Ruler className="h-3.5 w-3.5" />
                Emergency Phone
              </Label>
              {isEditing ? (
                <>
                  <Input
                    type="number"
                    {...register("emergencyPhone")}
                    className={inputCls}
                    placeholder="Phone number"
                  />
                  {errors.emergencyPhone && (
                    <p className="text-red-400 text-xs">
                      {errors.emergencyPhone.message}
                    </p>
                  )}
                </>
              ) : (
                <ReadValue value={savedData.emergencyPhone} />
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-gray-400 text-sm">
                Emergency Relation
              </Label>
              {isEditing ? (
                <>
                  <Input
                    type="text"
                    {...register("emergencyRelation")}
                    className={inputCls}
                    placeholder="Relation"
                  />
                  {errors.emergencyRelation && (
                    <p className="text-red-400 text-xs">
                      {errors.emergencyRelation.message}
                    </p>
                  )}
                </>
              ) : (
                <ReadValue value={savedData.emergencyRelation} />
              )}
            </div>
          </div>
          {isEditing && (
            <div className="flex gap-3">
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="border-[#2a3044] text-gray-400 hover:text-white hover:bg-[#2a3044]">
                Cancel
              </Button>
            </div>
          )}
        </section>
      </form>
    </div>
  );
}
