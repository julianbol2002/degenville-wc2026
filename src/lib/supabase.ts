import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DegenProfile {
  slug: string;
  display_name: string | null;
  avatar_url: string | null;
  updated_at: string;
}

export async function getAllProfiles(): Promise<Record<string, DegenProfile>> {
  const { data, error } = await supabase.from("degen_profiles").select("*");
  if (error || !data) return {};
  return Object.fromEntries(data.map((p) => [p.slug, p]));
}

export async function upsertProfile(
  slug: string,
  updates: { display_name?: string; avatar_url?: string }
) {
  const { error } = await supabase.from("degen_profiles").upsert(
    { slug, ...updates, updated_at: new Date().toISOString() },
    { onConflict: "slug" }
  );
  if (error) throw error;
}

export async function uploadAvatar(slug: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${slug}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("degen-avatars")
    .upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from("degen-avatars").getPublicUrl(path);
  return data.publicUrl;
}
