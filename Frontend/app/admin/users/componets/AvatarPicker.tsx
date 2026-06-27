"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, User, X } from "lucide-react";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface AvatarPickerProps {
  value: File | null;
  onChange: (file: File | null) => void;
  onInvalidType?: () => void;
  error?: string;
}

export function AvatarPicker({
  value,
  onChange,
  onInvalidType,
  error,
}: AvatarPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      onInvalidType?.();
      e.target.value = "";
      return;
    }
    onChange(file);
  };

  const clear = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-300">
        Profile Photo
      </label>
      <div className="flex items-center gap-4 flex-col">
        <div className="relative w-50 h-50 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-10 h-10 text-zinc-500" />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 hover:bg-zinc-700 transition-colors">
            <Camera size={16} />
            {value ? "Change photo" : "Upload photo"}
          </button>
          {value && (
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition-colors">
              <X size={16} />
              Remove
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      <p className="text-xs text-zinc-500">JPEG, PNG or WebP — max 5MB</p>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
