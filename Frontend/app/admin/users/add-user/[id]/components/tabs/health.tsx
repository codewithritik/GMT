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
import { MemberProfilePageProps, MemberMetricRecord } from "@/types/member";
import apiClient from "@/lib/api";
import { MemberMetricsFormValues, memberMetricsSchema } from "@/types/schema";
import dayjs from "dayjs";
import { DATE_FORMAT, DATE_TIME_FORMAT } from "@/lib/consts";

const inputCls =
  "bg-[#1a1f2e] border-[#2a3044] text-white focus-visible:ring-1 focus-visible:ring-red-500/40 placeholder:text-gray-600";

function ReadValue({ value }: { value: string }) {
  return (
    <p className="text-white text-sm py-2 px-3 rounded-md bg-[#1a1f2e]/50 border border-transparent min-h-[36px] w-full">
      {value || "—"}
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

function emptyMetrics(): MemberMetricsFormValues {
  return {
    weightKg: null,
    heightCm: null,
    bmi: null,
    bodyFatPct: null,
    muscleMassKg: null,
    restingHr: null,
    targetWeightKg: null,
    notes: null,
  };
}

function recordToFormValues(
  record?: MemberMetricRecord | null,
): MemberMetricsFormValues {
  if (!record) return emptyMetrics();

  const weightKg = toNumber(record.weightKg);
  const heightCm = toNumber(record.heightCm);
  const bmi = toNumber(record.bmi) ?? calcBmi(weightKg, heightCm);

  return {
    weightKg,
    heightCm,
    bmi,
    bodyFatPct: toNumber(record.bodyFatPct),
    muscleMassKg: toNumber(record.muscleMassKg),
    restingHr: record.restingHr ?? null,
    targetWeightKg: toNumber(record.targetWeightKg),
    notes: record.notes ?? null,
    source: record.source,
  };
}

function getLatestMetric(
  data: MemberProfilePageProps,
): MemberMetricRecord | null {
  const raw = data.memberMetrics;
  if (Array.isArray(raw)) return raw[0] ?? null;
  if (raw && typeof raw === "object" && Object.keys(raw).length > 0) {
    return raw as MemberMetricRecord;
  }
  return null;
}

const numberField = {
  setValueAs: (v: string) => (v === "" ? null : Number(v)),
};

export default function HealthTab({ data }: { data: MemberProfilePageProps }) {
  const { user } = data;
  const latestRecord = getLatestMetric(data);

  const [isEditing, setIsEditing] = useState(false);
  const [savedData, setSavedData] = useState<MemberMetricsFormValues>(
    recordToFormValues(latestRecord),
  );
  const [meta, setMeta] = useState({
    recordedAt: latestRecord?.recordedAt ?? null,
    source: latestRecord?.source ?? "manual",
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MemberMetricsFormValues>({
    resolver: zodResolver(memberMetricsSchema),
    defaultValues: recordToFormValues(latestRecord),
  });

  const weightKg = watch("weightKg");
  const heightCm = watch("heightCm");

  useEffect(() => {
    if (!isEditing) return;
    const w = toNumber(weightKg);
    const h = toNumber(heightCm);
    const computed = calcBmi(w, h);
    if (computed != null) {
      setValue("bmi", computed, { shouldDirty: true });
    }
  }, [weightKg, heightCm, isEditing, setValue]);

  const onSubmit = (formData: MemberMetricsFormValues) => {
    const payload: MemberMetricsFormValues = {
      ...formData,
      source: "manual",
    };

    setSavedData(payload);
    setMeta({ recordedAt: new Date().toISOString(), source: "manual" });
    setIsEditing(false);

    apiClient
      .patch(`/ops/members/${user.id}/metrics`, { memberMetrics: payload })
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
                Weight (kg)
              </Label>
              {isEditing ? (
                <>
                  <Input
                    type="number"
                    step="0.1"
                    {...register("weightKg", numberField)}
                    className={inputCls}
                    placeholder="e.g. 72.5"
                  />
                  {errors.weightKg && (
                    <p className="text-red-400 text-xs">
                      {errors.weightKg.message}
                    </p>
                  )}
                </>
              ) : (
                <ReadValue value={formatMetric(savedData.weightKg, " kg")} />
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-gray-400 text-sm flex items-center gap-1.5">
                <Ruler className="h-3.5 w-3.5" />
                Height (cm)
              </Label>
              {isEditing ? (
                <>
                  <Input
                    type="number"
                    step="0.1"
                    {...register("heightCm", numberField)}
                    className={inputCls}
                    placeholder="e.g. 175"
                  />
                  {errors.heightCm && (
                    <p className="text-red-400 text-xs">
                      {errors.heightCm.message}
                    </p>
                  )}
                </>
              ) : (
                <ReadValue value={formatMetric(savedData.heightCm, " cm")} />
              )}
            </div>

            {/* <div className="space-y-1.5">
              <Label className="text-gray-400 text-sm flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                BMI
              </Label>
              {isEditing ? (
                <ReadValue
                  value={formatMetric(
                    calcBmi(
                      toNumber(weightKg),
                      toNumber(heightCm)
                    ) ?? savedData.bmi
                  )}
                />
              ) : (
                <ReadValue value={formatMetric(savedData.bmi)} />
              )}
            </div> */}

            <div className="space-y-1.5">
              <Label className="text-gray-400 text-sm">Body Fat (%)</Label>
              {isEditing ? (
                <>
                  <Input
                    type="number"
                    step="0.1"
                    {...register("bodyFatPct", numberField)}
                    className={inputCls}
                    placeholder="e.g. 18.5"
                  />
                  {errors.bodyFatPct && (
                    <p className="text-red-400 text-xs">
                      {errors.bodyFatPct.message}
                    </p>
                  )}
                </>
              ) : (
                <ReadValue value={formatMetric(savedData.bodyFatPct, "%")} />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className="text-gray-400 text-sm">Muscle Mass (kg)</Label>
              {isEditing ? (
                <>
                  <Input
                    type="number"
                    step="0.1"
                    {...register("muscleMassKg", numberField)}
                    className={inputCls}
                    placeholder="e.g. 32.0"
                  />
                  {errors.muscleMassKg && (
                    <p className="text-red-400 text-xs">
                      {errors.muscleMassKg.message}
                    </p>
                  )}
                </>
              ) : (
                <ReadValue
                  value={formatMetric(savedData.muscleMassKg, " kg")}
                />
              )}
            </div>
          </div>
        </section>

        {/* ── Vitals ── */}
        <section>
          <SectionTitle>Vitals</SectionTitle>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className="text-gray-400 text-sm flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-red-500" />
                Resting Heart Rate (bpm)
              </Label>
              {isEditing ? (
                <>
                  <Input
                    type="number"
                    {...register("restingHr", numberField)}
                    className={inputCls}
                    placeholder="e.g. 68"
                  />
                  {errors.restingHr && (
                    <p className="text-red-400 text-xs">
                      {errors.restingHr.message}
                    </p>
                  )}
                </>
              ) : (
                <ReadValue
                  value={
                    savedData.restingHr != null
                      ? `${savedData.restingHr} bpm`
                      : "—"
                  }
                />
              )}
            </div>
          </div>
        </section>

        {/* ── Goals ── */}
        <section>
          <SectionTitle>Goals</SectionTitle>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className="text-gray-400 text-sm flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-red-500" />
                Target Weight (kg)
              </Label>
              {isEditing ? (
                <>
                  <Input
                    type="number"
                    step="0.1"
                    {...register("targetWeightKg", numberField)}
                    className={inputCls}
                    placeholder="e.g. 70.0"
                  />
                  {errors.targetWeightKg && (
                    <p className="text-red-400 text-xs">
                      {errors.targetWeightKg.message}
                    </p>
                  )}
                </>
              ) : (
                <ReadValue
                  value={formatMetric(savedData.targetWeightKg, " kg")}
                />
              )}
            </div>
          </div>
        </section>

        {/* ── Notes & Record Info ── */}
        <section>
          <div className="space-y-1.5 mb-6">
            <Label className="text-gray-400 text-sm">Notes</Label>
            {isEditing ? (
              <Textarea
                {...register("notes")}
                rows={3}
                className={`${inputCls} resize-y`}
                placeholder="Any health-related notes..."
              />
            ) : (
              <p className="text-white text-sm py-2 px-3 rounded-md bg-[#1a1f2e]/50 border border-transparent min-h-[72px] whitespace-pre-wrap">
                {savedData.notes || "—"}
              </p>
            )}
          </div>

          {!isEditing && meta.recordedAt && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="space-y-1.5">
                <Label className="text-gray-400 text-sm">Last Recorded</Label>
                <ReadValue
                  value={dayjs(meta.recordedAt).format(DATE_TIME_FORMAT)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-400 text-sm">Source</Label>
                <ReadValue
                  value={
                    meta.source
                      ? meta.source.charAt(0).toUpperCase() +
                        meta.source.slice(1)
                      : "—"
                  }
                />
              </div>
            </div>
          )}

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
