"use client";

import { useRef, useState } from "react";
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
  const fileRef = useRef<HTMLInputElement>(null);

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

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-1 text-xs text-secondary underline hover:text-primary transition-colors"
      >
        Edit profile
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="mb-4 text-lg font-bold text-primary">Edit Profile</h2>

            {/* Avatar */}
            <div className="mb-4 flex flex-col items-center gap-3">
              <div
                className="relative h-20 w-20 cursor-pointer overflow-hidden rounded-full border-2 border-teal bg-neutral-800"
                onClick={() => fileRef.current?.click()}
              >
                {avatar ? (
                  <Image src={avatar} alt="avatar" fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl">
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs text-white">
                    Uploading...
                  </div>
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="text-xs text-teal underline"
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
            <label className="mb-1 block text-xs font-semibold text-secondary uppercase">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
              className="mb-4 w-full rounded-md border border-border bg-bg px-3 py-2 text-primary outline-none focus:border-teal"
            />

            {error && <p className="mb-3 text-xs text-red-500">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 rounded-md border border-border py-2 text-sm text-secondary hover:bg-black/10"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || uploading}
                className="flex-1 rounded-md bg-teal py-2 text-sm font-bold text-white hover:bg-teal/80 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
