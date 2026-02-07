"use client"

import React from "react"
import { useRef } from "react"
import { FileText, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadAreaProps {
  label: string
  description: string
  file: File | null
  onFileChange: (file: File | null) => void
}

export function FileUploadArea({ label, description, file, onFileChange }: FileUploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    onFileChange(selectedFile)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onFileChange(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative group cursor-pointer border border-dashed p-6 text-center transition-all duration-200",
        file
          ? "border-champagne bg-champagne/5"
          : "border-charcoal/10 hover:border-champagne/50"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleChange}
        className="hidden"
      />

      {file ? (
        <>
          {/* Remove button */}
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 hover:opacity-70 transition-opacity"
          >
            <X className="h-3 w-3 text-charcoal-light" strokeWidth={1.25} />
          </button>

          {/* Success state */}
          <div className="flex flex-col items-center">
            <Check className="h-5 w-5 text-champagne mb-4" strokeWidth={1.25} />
            <span className="text-xs font-light text-charcoal tracking-wide mb-1">{label}</span>
            <span className="text-[9px] text-charcoal-light/60 truncate max-w-full">
              {file.name}
            </span>
          </div>
        </>
      ) : (
        <>
          {/* Upload state */}
          <div className="flex flex-col items-center">
            <FileText className="h-5 w-5 text-charcoal-light mb-4 group-hover:text-champagne transition-colors" strokeWidth={1} />
            <span className="text-xs font-light text-charcoal tracking-wide mb-1">{label}</span>
            <span className="text-[9px] text-charcoal-light/60">{description}</span>
          </div>
        </>
      )}
    </div>
  )
}
