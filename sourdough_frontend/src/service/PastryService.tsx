import type { PastryUpdate, pastryUpload } from "../types/pastry";
import { supabase } from "../utils/supabase";
import { checkUser } from "./UserService";

export async function getPastries() {
  const { data, error } = await supabase.from("pastries")
    .select()
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Error loading pastries");
  }

  return data;
}

export async function getRecentPastries() {
  const { data, error } = await supabase
    .from("pastries")
    .select()
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    throw new Error("Error loading recent pastries");
  }

  return data;
}

export function getPastryPicture(path: string) {
  const { data } = supabase.storage.from("LoafImages").getPublicUrl(path);

  return data.publicUrl;
}

export async function uploadPastry(pastry: pastryUpload) {
  await checkUser();

  const { data, error } = await supabase
    .from("pastries")
    .insert([pastry]);

  if (error) {
    throw new Error("Error inserting pastry");
  }

  return data;
}

export async function uploadPastryImage(file: File) {
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

export async function getAllPastryTags() {
  const { data, error } = await supabase.from("pastries").select("tag");

  if (error) {
    throw new Error("error loading tags from recipes")
  }

  return [...new Set(data.map(r => r.tag).filter((tag): tag is string => !!tag))];

}

export async function deletePastryFromDatabase(id: number) {
  const { data, error } = await supabase.from("pastries").delete().eq('id', id);

  if (error) throw new Error("error deleting pastry with id " + id);

  return data;
}

export async function updatePastry(id: number, updatedPastry: PastryUpdate) {
  const { data, error } = await supabase
    .from("pastries")
    .update(updatedPastry)
    .eq("id", id)

  if (error) throw new Error("error updating pastry")

  return data;
}