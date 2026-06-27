"use client";

import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Target,
  Clock,
  Users,
  Pencil,
  Save,
  X,
  CalendarDays,
  Phone,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { OverviewFormData, overviewSchema } from "../schema";
import z from "zod";
import { MemberProfilePageProps } from "@/types/member";
import apiClient from "@/lib/api";
import {
  MemberProfileFormValues,
  memberProfileSchema,
  MemberMetricsFormValues,
} from "@/types/schema";
import {
  BLOOD_GROUPS,
  FITNESS_GOALS,
  MARITAL_STATUSES,
  REFERRAL_SOURCES,
  WORKOUT_TIMES,
} from "@/lib/consts";

// ─── Types ───────────────────────────────────────────────────────────────────

// ─── Dummy defaults ───────────────────────────────────────────────────────────

// ─── Field option lists ───────────────────────────────────────────────────────

// ─── Shared input style ───────────────────────────────────────────────────────

const inputCls =
  "bg-[#1a1f2e] border-[#2a3044] text-white focus-visible:ring-1 focus-visible:ring-red-500/40 placeholder:text-gray-600";

const selectTriggerCls =
  "bg-[#1a1f2e] border-[#2a3044] text-white focus:ring-1 focus:ring-red-500/40";

const selectContentCls = "bg-[#1a1f2e] border-[#2a3044] text-white";

const selectItemCls = "focus:bg-[#2a3044] focus:text-white cursor-pointer";

// ─── Read-only display value ──────────────────────────────────────────────────

function ReadValue({ value }: { value: string }) {
  return (
    <p className="text-white text-sm py-2 px-3 rounded-md bg-[#1a1f2e]/50 border border-transparent min-h-[36px] w-full">
      {value || "—"}
    </p>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-white font-semibold text-base mb-5">{children}</h3>
  );
}

function normalizeMemberMetrics(
  raw: MemberProfilePageProps["memberMetrics"],
): MemberMetricsFormValues {
  const record = Array.isArray(raw) ? raw[0] : raw;
  if (!record) return {};

  const toNum = (v: number | string | null | undefined) =>
    v == null || v === "" ? null : Number(v);

  return {
    weightKg: toNum(record.weightKg),
    heightCm: toNum(record.heightCm),
    bmi: toNum(record.bmi),
    bodyFatPct: toNum(record.bodyFatPct),
    muscleMassKg: toNum(record.muscleMassKg),
    restingHr: record.restingHr ?? null,
    targetWeightKg: toNum(record.targetWeightKg),
    notes: record.notes ?? null,
    source: record.source,
  };
}

function toFormValues(data: MemberProfilePageProps): MemberProfileFormValues {
  return {
    user: { ...data.user },
    member: { ...data.member },
    memberMetrics: normalizeMemberMetrics(data.memberMetrics),
  };
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function OverviewTab({
  data,
}: {
  data: MemberProfilePageProps;
}) {
  const { member, memberMetrics, user } = data;
  const [isEditing, setIsEditing] = useState(false);
  const [savedData, setSavedData] = useState<MemberProfileFormValues>(
    toFormValues(data),
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<MemberProfileFormValues>({
    resolver: zodResolver(memberProfileSchema),
    defaultValues: toFormValues(data),
  });

  const onSubmit = (formData: MemberProfileFormValues) => {
    console.log("OverviewTab onSubmit:", formData);
    setSavedData({ ...savedData, ...formData });
    setIsEditing(false);

    // send only metrics to the metrics endpoint
    apiClient
      .patch(`/ops/members/${user.id}/metrics`, formData)
      .then(() => console.log("Metrics updated"))
      .catch((err) => console.error("Metrics update failed", err));
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
      {/* ── Top edit hint / action buttons ── */}
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
        {/* ── Personal Details ── */}
        <section>
          <SectionTitle>Personal Details</SectionTitle>

          {/* Row 1 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">

            {/* Occupation */}
            <div className="space-y-1.5">
              <Label className="text-gray-400 text-sm">Phone Number</Label>
              {isEditing ? (
                <Input
                  {...register("user.phone")}
                  className={inputCls}
                  placeholder="+91 98765 43210"
                />
              ) : (
                <ReadValue value={savedData.user.phone.toString()} />
              )}
            </div>

            {/* Blood Group */}
            <div className="space-y-1.5">
              <Label className="text-gray-400 text-sm">Blood Group</Label>
              {isEditing ? (
                <Controller
                  name="member.bloodType"
                  control={control}
                  rules={{ required: "Required" }}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}>
                      <SelectTrigger className={selectTriggerCls}>
                        <SelectValue placeholder="Select Blood Group" />
                      </SelectTrigger>
                      <SelectContent className={selectContentCls}>
                        {BLOOD_GROUPS.map((bg) => (
                          <SelectItem
                            key={bg}
                            value={bg}
                            className={selectItemCls}>
                            {bg}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <ReadValue value={savedData.member.bloodType ?? "—"} />
              )}
            </div>

            {/* Occupation */}
            <div className="space-y-1.5">
              <Label className="text-gray-400 text-sm">Occupation</Label>
              {isEditing ? (
                <Input
                  {...register("member.occupation")}
                  className={inputCls}
                  placeholder="e.g. Software Engineer"
                />
              ) : (
                <ReadValue value={savedData.member.occupation ?? "—"} />
              )}
            </div>

            {/* Marital Status */}
            <div className="space-y-1.5">
              <Label className="text-gray-400 text-sm">Marital Status</Label>
              {isEditing ? (
                <Controller
                  name="member.maritalStatus"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}>
                      <SelectTrigger className={selectTriggerCls}>
                        <SelectValue placeholder="Select Marital Status" />
                      </SelectTrigger>
                      <SelectContent className={selectContentCls}>
                        {MARITAL_STATUSES.map((s) => (
                          <SelectItem
                            key={s}
                            value={s}
                            className={selectItemCls}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <ReadValue value={savedData.member.maritalStatus ?? "—"} />
              )}
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Address */}
            <div className="space-y-1.5">
              <Label className="text-gray-400 text-sm">Address</Label>
              {isEditing ? (
                <Input
                  {...register("member.address")}
                  className={inputCls}
                  placeholder="Street, Sector"
                />
              ) : (
                <ReadValue value={savedData.member.address ?? "—"} />
              )}
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <Label className="text-gray-400 text-sm">City</Label>
              {isEditing ? (
                <Input
                  {...register("member.city")}
                  className={inputCls}
                  placeholder="City"
                />
              ) : (
                <ReadValue value={savedData.member.city ?? "—"} />
              )}
            </div>

            {/* State */}
            <div className="space-y-1.5">
              <Label className="text-gray-400 text-sm">State</Label>
              {isEditing ? (
                <Input
                  {...register("member.state")}
                  className={inputCls}
                  placeholder="State"
                />
              ) : (
                <ReadValue value={savedData.member.state ?? "—"} />
              )}
            </div>

            {/* Pincode */}
            <div className="space-y-1.5">
              <Label className="text-gray-400 text-sm">Pincode</Label>
              {isEditing ? (
                <>
                  <Input
                    {...register("member.pincode", {
                      pattern: {
                        value: /^\d{6}$/,
                        message: "Must be 6 digits",
                      },
                    })}
                    className={inputCls}
                    placeholder="6-digit code"
                    maxLength={6}
                  />
                  {errors.member?.pincode && (
                    <p className="text-red-400 text-xs">
                      {errors.member?.pincode?.message}
                    </p>
                  )}
                </>
              ) : (
                <ReadValue value={savedData.member.pincode ?? "—"} />
              )}
            </div>
          </div>
        </section>

        {/* ── Fitness & Preferences ── */}
        <section>
          <SectionTitle>Fitness &amp; Preferences</SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            {/* Fitness Goal */}
            <div className="w-full">
              <Label className="text-gray-400 text-sm">Fitness Goal</Label>
              {isEditing ? (
                <Controller
                  name="member.fitnessGoals"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}>
                      <SelectTrigger className={selectTriggerCls}>
                        <span className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-red-500 shrink-0" />
                          <SelectValue placeholder="Select Fitness Goal" />
                        </span>
                      </SelectTrigger>
                      <SelectContent className={selectContentCls}>
                        {FITNESS_GOALS.map((g) => (
                          <SelectItem
                            key={g}
                            value={g}
                            className={selectItemCls}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-red-500 shrink-0" />
                  <ReadValue value={savedData.member.fitnessGoals ?? "—"} />
                </div>
              )}
            </div>

            {/* Preferred Workout Time */}
            <div className="space-y-1.5 w-full">
              <Label className="text-gray-400 text-sm">
                Preferred Workout Time
              </Label>
              {isEditing ? (
                <Controller
                  name="member.workoutTime"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ("" as string)}
                      onValueChange={field.onChange}>
                      <SelectTrigger className={selectTriggerCls}>
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                          <SelectValue placeholder="Select Workout Time" />
                        </span>
                      </SelectTrigger>
                      <SelectContent className={selectContentCls}>
                        {WORKOUT_TIMES.map((t) => (
                          <SelectItem
                            key={t}
                            value={t}
                            className={selectItemCls}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <div className="flex items-center gap-2 w-full">
                  <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                  <ReadValue value={savedData.member.workoutTime ?? "—"} />
                </div>
              )}
            </div>

            {/* Referral Source */}
            <div className="space-y-1.5">
              <Label className="text-gray-400 text-sm">
                How did you hear about us?
              </Label>
              {isEditing ? (
                <Controller
                  name="member.referralSource"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}>
                      <SelectTrigger className={selectTriggerCls}>
                        <span className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400 shrink-0" />
                          <SelectValue placeholder="Select Referral Source" />
                        </span>
                      </SelectTrigger>
                      <SelectContent className={selectContentCls}>
                        {REFERRAL_SOURCES.map((r) => (
                          <SelectItem
                            key={r}
                            value={r}
                            className={selectItemCls}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400 shrink-0" />
                  <ReadValue value={savedData.member.referralSource ?? "—"} />
                </div>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-1.5 mb-6">
            <Label className="text-gray-400 text-sm">Additional Notes</Label>
            {isEditing ? (
              <Textarea
                {...register("member.notes")}
                rows={3}
                className={`${inputCls} resize-y`}
                placeholder="Any notes about the member..."
              />
            ) : (
              <p className="text-white text-sm py-2 px-3 rounded-md bg-[#1a1f2e]/50 border border-transparent min-h-[72px] whitespace-pre-wrap">
                {savedData.member.notes || "—"}
              </p>
            )}
          </div>

          {/* Save button — only visible in edit mode */}
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
