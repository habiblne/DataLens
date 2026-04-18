"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";

type UploadBoxProps = {
  onUpload: (file: File) => void;
  isLoading: boolean;
};

export default function UploadBox({ onUpload, isLoading }: UploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  function handleFile(file?: File) {
    if (!file || isLoading) {
      return;
    }
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setFileError("Please choose a file ending in .csv.");
      return;
    }
    setFileError(null);
    onUpload(file);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    handleFile(event.target.files?.[0]);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`rounded-lg border bg-slate-950/75 p-6 shadow-glow backdrop-blur transition ${
        isDragging ? "border-emerald-300 ring-4 ring-emerald-400/15" : "border-white/10"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleInputChange}
      />
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-400/15 text-sm font-bold text-emerald-200">
            CSV
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-white">Upload a CSV</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Drop a dataset here and DataLens will profile it instantly. CSV files up to 10MB work best for the demo.
          </p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isLoading}
          className="shrink-0 rounded-lg bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-glow transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
        >
          {isLoading ? "Uploading..." : "Choose file"}
        </button>
      </div>
      {fileError ? <p className="mt-4 text-sm font-medium text-red-300">{fileError}</p> : null}
    </div>
  );
}
