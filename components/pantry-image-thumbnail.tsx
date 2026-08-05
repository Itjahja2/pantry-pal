"use client";

import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import { ImagePlusIcon, LeafIcon } from "lucide-react";
import { toast } from "sonner";

import { uploadIngredientImage } from "@/app/actions";

export function PantryImageThumbnail({
  ingredientId,
  initialImageUrl,
  alt,
}: {
  ingredientId: number;
  initialImageUrl: string | null;
  alt: string;
}) {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);
    setIsUploading(true);

    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadIngredientImage(ingredientId, formData);
    setIsUploading(false);

    if (!result.success) {
      toast.error(result.error);
      setImageUrl(initialImageUrl);
      return;
    }
    toast.success("Image updated");
  }

  return (
    <label className="group/image relative size-12 shrink-0 cursor-pointer overflow-hidden rounded-lg bg-white shadow-md">
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes="48px"
          className="object-cover"
          unoptimized={imageUrl.startsWith("blob:")}
        />
      ) : (
        <div className="flex size-full items-center justify-center bg-emerald-50">
          <LeafIcon className="size-5 text-emerald-800/60" />
        </div>
      )}
      <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover/image:opacity-100">
        <ImagePlusIcon className="size-4 text-white" />
      </span>
    </label>
  );
}