"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { aiAPI, authAPI, getErrorMessage, opsAPI } from "@/lib/api";
import { useAuth, dashboardPathForRole } from "@/context/AuthContext";
import {
  ChevronRight,
  ChevronLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  Flame,
  Zap,
  Wind,
  Activity,
  Heart,
  Upload,
  FileImage,
  Dumbbell,
  Target,
  Leaf,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3;

interface OnboardData {
  experienceLevel: "beginner" | "intermediate" | "advanced" | "";
  fitnessGoals: string;
  age: string;
  weightKg: string;
  heightCm: string;
}

const GOALS = [
  { id: "fat_burn", label: "Fat Burn", icon: Flame },
  { id: "muscle_gain", label: "Muscle Gain", icon: Zap },
  { id: "endurance", label: "Endurance", icon: Wind },
  { id: "flexibility", label: "Flexibility", icon: Activity },
  { id: "general", label: "General Fitness", icon: Heart },
];

function Onboard({ memberId }: { memberId: string }) {
  const router = useRouter();
  const {
    isLoading: authLoading,
    isAuthenticated,
    user,
    refreshUser,
  } = useAuth();
  const [step, setStep] = useState<Step>(1);
  const [error, setError] = useState("");
  const [docFrontUrl, setDocFrontUrl] = useState<string | null>(null);
  const [docBackUrl, setDocBackUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      const result = await Promise.allSettled([
        authAPI.getIdDocumentBlob(memberId, "front"),
        authAPI.getIdDocumentBlob(memberId, "back"),
      ]);
      if (result[0].status === "fulfilled") {
        setDocFrontUrl(URL.createObjectURL(result[0].value));
      }
      if (result[1].status === "fulfilled") {
        setDocBackUrl(URL.createObjectURL(result[1].value));
      }
      setIsLoading(false);
    };
    fetchDocuments();
  }, []);

  // Step 1 — ID document type and files
  type DocType = "nic" | "driving_license" | "passport";
  const [documentType, setDocumentType] = useState<DocType>("nic");
  const [docFront, setDocFront] = useState<File | null>(null);
  const [docBack, setDocBack] = useState<File | null>(null);
  const [docFrontPreview, setDocFrontPreview] = useState("");
  const [docBackPreview, setDocBackPreview] = useState("");
  const [idUploaded, setIdUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadedFrontName, setUploadedFrontName] = useState<string | null>(
    null,
  );
  const [uploadedBackName, setUploadedBackName] = useState<string | null>(null);

  const isPassport = documentType === "passport";
  const needsTwoFiles = !isPassport;

  const handleFile = (field: "front" | "back", file: File | null) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    const url = URL.createObjectURL(file);
    if (field === "front") {
      setDocFront(file);
      setDocFrontPreview(url);
    } else {
      setDocBack(file);
      setDocBackPreview(url);
    }
    setError("");
  };

  const canUploadStep1 = isPassport ? !!docFront : !!docFront && !!docBack;
  // const canProceedStep2 = data.experienceLevel !== '';
  // const canProceedStep3 = data.fitnessGoals !== '';

  const handleUploadIdDocs = async () => {
    if (!canUploadStep1) {
      setError(
        isPassport
          ? "Please select your passport image."
          : "Please select both front and back images.",
      );
      return;
    }
    setUploading(true);
    setError("");
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append("document_type", documentType);
      formData.append("nic_front", docFront!);
      if (!isPassport && docBack) formData.append("nic_back", docBack);
      await authAPI.uploadMemberDocuments(formData, memberId, {
        onUploadProgress: (e) => {
          const pct = e.total ? Math.round((e.loaded / e.total) * 100) : 0;
          setUploadProgress(pct);
        },
      });
      setUploadedFrontName(docFront!.name);
      if (!isPassport && docBack) setUploadedBackName(docBack.name);
      setIdUploaded(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleNext = (skipId = false) => {
    if (step === 1) {
      if (!skipId && !idUploaded) {
        setError("Please upload your documents first, or skip for now.");
        return;
      }
    }
    setError("");
  };

  const stepLabels = ["ID Verification", "Experience", "Goals"];

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }
  return (
    <div className="text-white flex p-6 relative overflow-hidden selection:bg-red-600/30">
      <div className="inset-0 z-0 bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,transparent_40%,black_90%)] pointer-events-none" />

      <div className="w-full w-full z-10 gap-4">
        {docFrontUrl ? (
          <div className="flex flex-row items-center justify-center gap-4">
            <div className="flex h-[400px] w-full flex-col overflow-hidden">
              <img
                src={docFrontUrl}
                alt="Front"
                className="min-h-0 flex-1 w-full object-contain"
              />
              <p className="text-h1 text-white text-center">Front </p>
            </div>
            {docBackUrl && (
              <div className="flex h-[400px] w-full flex-col overflow-hidden">
                <img
                  src={docBackUrl}
                  alt="back"
                  className="min-h-0 flex-1 w-full object-contain"
                />
                <p className="text-h1 text-white text-center">Back</p>
              </div>
            )}
          </div>
        ) : (
          <div
            className="backdrop-blur-xl rounded-3xl p-8 shadow-2xl w-full"
            id="onboard-card">
            {error && (
              <div
                className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2"
                id="onboard-error"
                role="alert">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5" id="onboard-step-1">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Identity Verification
                  </h2>
                  <p className="text-zinc-400 text-sm mt-1">
                    {documentType === "nic" &&
                      "Upload front and back of your National Identity Card. Clear images, under 5MB each."}
                    {documentType === "driving_license" &&
                      "Upload front and back of your Driving License. Clear images, under 5MB each."}
                    {documentType === "passport" &&
                      "Upload the photo page of your Passport. Clear image, under 5MB."}
                  </p>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="onboard-doc-type"
                    className="text-sm font-medium text-zinc-300">
                    Document type
                  </label>
                  <div className="relative">
                    <ChevronDown
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                      size={18}
                    />
                    <select
                      id="onboard-doc-type"
                      value={documentType}
                      onChange={(e) => {
                        setDocumentType(e.target.value as DocType);
                        setDocFront(null);
                        setDocBack(null);
                        setDocFrontPreview("");
                        setDocBackPreview("");
                        setIdUploaded(false);
                        setUploadedFrontName(null);
                        setUploadedBackName(null);
                        setError("");
                      }}
                      className="w-full appearance-none bg-zinc-800/80 border border-zinc-700 rounded-xl py-2.5 pl-4 pr-10 text-white focus:outline-none focus:border-red-600 text-sm cursor-pointer"
                      aria-label="Document type">
                      <option value="nic" className="bg-zinc-900">
                        National Identity Card
                      </option>
                      <option value="driving_license" className="bg-zinc-900">
                        Driving License
                      </option>
                      <option value="passport" className="bg-zinc-900">
                        Passport
                      </option>
                    </select>
                  </div>
                </div>
                <div
                  className={cn(
                    "grid gap-4",
                    needsTwoFiles
                      ? "grid-cols-1 sm:grid-cols-2"
                      : "grid-cols-1",
                  )}>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="onboard-nic-front"
                      className="text-sm font-medium text-zinc-300">
                      {isPassport ? "Passport (photo page)" : "Front"}
                    </label>
                    <label
                      htmlFor="onboard-nic-front"
                      className={cn(
                        "flex flex-col items-center justify-center h-36 rounded-xl border-2 border-dashed cursor-pointer transition-all overflow-hidden relative",
                        docFront
                          ? "border-emerald-500/50"
                          : "border-zinc-700 hover:border-zinc-500",
                      )}>
                      {docFrontPreview ? (
                        <img
                          src={docFrontPreview}
                          alt="Front"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 text-zinc-500">
                          <Upload size={24} />
                          <span className="text-xs">Image files</span>
                        </div>
                      )}
                      <input
                        id="onboard-nic-front"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        aria-label={isPassport ? "Passport" : "Front"}
                        onChange={(e) =>
                          handleFile("front", e.target.files?.[0] ?? null)
                        }
                      />
                    </label>
                    {idUploaded && uploadedFrontName ? (
                      <p className="text-xs text-emerald-400 flex items-center gap-1">
                        <CheckCircle size={12} /> {uploadedFrontName}
                      </p>
                    ) : docFront && !idUploaded ? (
                      <p className="text-xs text-zinc-400">{docFront.name}</p>
                    ) : null}
                  </div>
                  {needsTwoFiles && (
                    <div className="space-y-1.5">
                      <label
                        htmlFor="onboard-nic-back"
                        className="text-sm font-medium text-zinc-300">
                        Back
                      </label>
                      <label
                        htmlFor="onboard-nic-back"
                        className={cn(
                          "flex flex-col items-center justify-center h-36 rounded-xl border-2 border-dashed cursor-pointer transition-all overflow-hidden relative",
                          docBack
                            ? "border-emerald-500/50"
                            : "border-zinc-700 hover:border-zinc-500",
                        )}>
                        {docBackPreview ? (
                          <img
                            src={docBackPreview}
                            alt="Back"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-1.5 text-zinc-500">
                            <FileImage size={24} />
                            <span className="text-xs">Image files</span>
                          </div>
                        )}
                        <input
                          id="onboard-nic-back"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          aria-label="Back"
                          onChange={(e) =>
                            handleFile("back", e.target.files?.[0] ?? null)
                          }
                        />
                      </label>
                      {idUploaded && uploadedBackName ? (
                        <p className="text-xs text-emerald-400 flex items-center gap-1">
                          <CheckCircle size={12} /> {uploadedBackName}
                        </p>
                      ) : docBack && !idUploaded ? (
                        <p className="text-xs text-zinc-400">{docBack.name}</p>
                      ) : null}
                    </div>
                  )}
                </div>
                {uploading && (
                  <div className="space-y-1">
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-600 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-zinc-500">
                      Uploading… {uploadProgress}%
                    </p>
                  </div>
                )}
                <p className="text-xs text-zinc-500">
                  Stored securely; reviewed by our team only.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between mt-6 pt-5 border-t border-zinc-700">
              {step > 1 ? (
                <button
                  id="onboard-back"
                  type="button"
                  onClick={() => {
                    setStep((prev) => (prev - 1) as Step);
                    setError("");
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all text-sm font-medium">
                  <ChevronLeft size={18} /> Back
                </button>
              ) : (
                <div />
              )}
              {
                <div className="flex items-center gap-3">
                  {/* <button
                                    id="onboard-skip-id"
                                    type="button"
                                    onClick={() => handleNext(true)}
                                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700/50 transition-all text-sm font-medium"
                                >
                                    Skip for now
                                </button> */}
                  {idUploaded ? (
                    <button
                      id="onboard-continue"
                      type="button"
                      onClick={() => handleNext()}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all">
                      Continue <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button
                      id="onboard-upload"
                      type="button"
                      onClick={handleUploadIdDocs}
                      disabled={!canUploadStep1 || uploading}
                      className={cn(
                        "flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all",
                        (!canUploadStep1 || uploading) &&
                          "opacity-70 cursor-not-allowed",
                      )}>
                      {uploading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Upload size={18} />
                      )}
                      Upload documents
                    </button>
                  )}
                </div>
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const DocumentsTab = ({ memberId }: { memberId: string }) => {
  return (
    <div>
      <Onboard memberId={memberId} />
    </div>
  );
};

export default DocumentsTab;
