import { createClient, SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "images";

function getSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Upload de imagens não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(url, key);
}

export async function uploadImage(
  file: Buffer,
  folder: string,
  userId: string,
  extension: string
): Promise<string> {
  const supabase = getSupabase();
  const timestamp = Date.now();
  const hex = Math.random().toString(16).slice(2, 10);
  const path = `${folder}/${userId}/${timestamp}-${hex}.${extension}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      contentType: `image/${extension === "jpg" ? "jpeg" : extension}`,
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload falhou: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteImage(url: string): Promise<void> {
  const supabase = getSupabase();
  const match = url.match(/\/storage\/v1\/object\/public\/images\/(.+)$/);
  if (!match) return;

  const path = match[1];
  await supabase.storage.from(BUCKET).remove([path]);
}
