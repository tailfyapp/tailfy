"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  folder: string;
  onUpload: (url: string) => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
  children?: React.ReactNode;
}

export function ImageUploader({
  folder,
  onUpload,
  accept = "image/jpeg,image/png,image/webp",
  maxSizeMB = 5,
  className,
  children,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`Arquivo muito grande. Máximo: ${maxSizeMB}MB.`);
        return;
      }

      setUploading(true);
      setProgress(30);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      try {
        setProgress(60);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        setProgress(100);

        if (!res.ok) {
          setError(data.error || "Erro ao fazer upload.");
          return;
        }

        onUpload(data.url);
      } catch {
        setError("Erro de conexão.");
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [folder, maxSizeMB, onUpload]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors",
          dragOver
            ? "border-purple-400 bg-purple-50"
            : "border-gray-200 hover:border-gray-300",
          uploading && "pointer-events-none opacity-70",
          className
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />

        {children || (
          <>
            <Upload size={24} className="text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              {uploading
                ? "Enviando..."
                : "Arraste uma imagem ou clique para selecionar"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPEG, PNG ou WebP (máx. {maxSizeMB}MB)
            </p>
          </>
        )}

        {uploading && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 rounded-b-2xl overflow-hidden">
            <div
              className="h-full bg-purple-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
          <X size={14} />
          {error}
        </div>
      )}
    </div>
  );
}
