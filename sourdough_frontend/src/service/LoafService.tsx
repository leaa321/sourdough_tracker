import type { loafUpload } from "../types/loaf";
import { supabase } from "../utils/supabase";
import { checkUser } from "./UserService";

export async function getLoafes() {
  const { data, error } = await supabase.from("sourdough_loaves").select();

  if (error) {
    throw new Error("Error loading loaves");
  }

  return data;
}

export function getLoafPicture(path: string) {
  const { data } = supabase.storage.from("LoafImages").getPublicUrl(path);

  return data.publicUrl;
}

export async function uploadLoaf(loaf: loafUpload) {
  await checkUser();

  const { data, error } = await supabase
    .from("sourdough_loaves")
    .insert([loaf]);

  if (error) {
    throw new Error("Error inserting loaf");
  }

  return data;
}

export async function uploadLoafImage(file: File) {
  await checkUser();

  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("LoafImages")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  console.log("UPLOAD DATA:", data);
  console.log("UPLOAD ERROR:", error);

  if (error) {
    throw error;
  }

  return fileName;
}
