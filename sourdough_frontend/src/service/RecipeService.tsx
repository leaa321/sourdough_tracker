import type {
  ingredientUpload,
  recipe_ingredient_upload,
  recipeUpload,
} from "../types/recipe";
import { supabase } from "../utils/supabase";
import { checkUser } from "./UserService";

export async function getRecipes() {
  const { data, error } = await supabase.from("recipes").select();

  if (error) {
    throw new Error("error loading recipes");
  }

  return data;
}

export async function getIngredients() {
  const { data, error } = await supabase.from("ingredients").select();

  if (error) {
    throw new Error("error loading ingredients");
  }

  return data;
}

export async function getRecipeById(recipeId: number) {
  const { data, error } = await supabase.from("recipes").select().eq("id", recipeId).single();

  if (error) {
    throw new Error("error loading recipe")
  }

  return data;
}

export async function getRecipeIngredients() {
  const { data, error } = await supabase.from("recipe_ingredients").select();

  if (error) {
    throw new Error("error loading recipes");
  }

  return data;
}

export async function uploadRecipe(recipe: recipeUpload) {
  await checkUser();

  const { data, error } = await supabase
    .from("recipes")
    .insert([recipe])
    .select();

  if (error) {
    throw new Error("error uploading recipe");
  }

  return data;
}

export async function uploadIngredient(ingredient: ingredientUpload) {
  await checkUser();

  const { data, error } = await supabase
    .from("ingredients")
    .insert([ingredient])
    .select();

  if (error) {
    throw new Error("error uploading ingredient");
  }

  return data;
}

export async function uploadRecipeIngredient(
  relation: recipe_ingredient_upload,
) {
  await checkUser();

  const { data, error } = await supabase
    .from("recipe_ingredients")
    .insert([relation]);

  if (error) throw new Error("error uploading relation");

  return data;
}

export async function uploadRecipeImage(file: File) {
  await checkUser();
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("RecipeImages")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    throw error;
  }

  return fileName;
}

export async function getIngredientByTitle(title: string) {
  const { data, error } = await supabase
    .from("ingredients")
    .select()
    .eq("title", title)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export function getRecipePicture(path: string) {
  const { data } = supabase.storage.from("RecipeImages").getPublicUrl(path);

  return data.publicUrl;
}

export async function getAllRecipeTags(): Promise<string[]> {
  const { data, error } = await supabase
    .from("recipes")
    .select("tag");

  if (error) {
    throw new Error("error loading tags from recipes");
  }

  return [...new Set(data.map(r => r.tag).filter((tag): tag is string => !!tag))];
}