"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { upsertProfile, uploadAvatar } from "@/lib/supabase";

interface ProfileEditorProps {
  slug: string;
  currentName: string;
  currentAvatar: string | null;
  onSave: (name: string, avatarUrl: string | null) => void;
}

export default function ProfileEditor({
  slug,
  currentName,
  currentAvatar,
  onSave,
}: ProfileEditorProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentName);
  const [avatar, setAvatar] = useState<string | null>(currentAvatar);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const url = await uploadAvatar(slug, file);
      setAvatar(url);
    } catch {
      setError("Upload failed, try again");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!name.trim()) { setError("Name can't be empty"); return; }
    setSaving(true);
    setError(null);
    try {
      await upsertProfile(slug, {
        display_name: name.trim(),
        avatar_url: avatar ?? undefined,
      });
      onSave(name.trim(), avatar);
      setOpen(false);
    } catch {
      setError("Save failed, try again");
    } finally {
      setSaving(false);
    }
  }

  const modal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#0F1F2E] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 text-xl text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="mb-5 text-lg font-bold text-white">Edit Profile</h2>

        {/* Avatar */}
        <div className="mb-5 flex flex-col items-center gap-3">
          <div
            className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border-2 border-[#2A9D8F] bg-neutral-800"
            onClick={() => fileRef.current?.click()}
          >
            {avatar ? (
              <Image src={avatar} alt="avatar" fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-white">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs text-white">
                Uploading...
              </div>
            )}
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="text-xs text-[#2A9D8F] underline hover:text-white transition-colors"
          >
            {avatar ? "Change photo" : "Upload photo"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Name */}
        <label className="mb-1 block text-xs font-semibold uppercase
