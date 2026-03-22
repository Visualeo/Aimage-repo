"use client";

import { useCallback, useRef, useState, DragEvent, ChangeEvent } from "react";
import Image from "next/image";

interface ImageUploadProps {
  referenceImage: string | null;
  onImageChange: (base64: string | null) => void;
}

export default function ImageUpload({
  referenceImage,
  onImageChange,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageChange(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    },
    [onImageChange]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-3 flex items-center gap-2">
        Reference Image
        <span className="normal-case text-[10px] glass rounded-full px-2 py-0.5 text-[var(--text-muted)] tracking-normal">
          optional
        </span>
      </h2>

      {referenceImage ? (
        /* Preview */
        <div className="glass rounded-2xl p-3 inline-flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src={referenceImage}
              alt="Reference image preview"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)] mb-2">
              Reference uploaded
            </p>
            <button
              onClick={() => onImageChange(null)}
              className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5"
              aria-label="Remove reference image"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Remove
            </button>
          </div>
        </div>
      ) : (
        /* Drop zone */
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            aria-label="File input for reference image"
          />
          <div
            id="image-upload-zone"
            role="button"
            tabIndex={0}
            aria-label="Upload reference image"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && inputRef.current?.click()
            }
            className={`glass rounded-2xl border-dashed border-2 p-8 cursor-pointer transition-all duration-200 text-center outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-purple)] ${isDragging ? "border-[var(--accent-purple)] bg-[rgba(139,92,246,0.07)]" : "border-[rgba(255,255,255,0.14)]"}`}
          >
            <div
              className={`w-12 h-12 rounded-2xl glass flex items-center justify-center mx-auto mb-3 transition-transform duration-200 ${isDragging ? "scale-110" : "scale-100"}`}
            >
              <svg
                className="w-6 h-6 text-[var(--text-muted)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
            </div>

            <p className="text-[var(--text-secondary)] text-sm font-medium">
              {isDragging ? "Drop it here!" : "Drag & drop or click to upload"}
            </p>
            <p className="text-[var(--text-muted)] text-xs mt-1">
              PNG, JPG, WEBP up to 10MB
            </p>
          </div>
        </>
      )}
    </div>
  );
}
