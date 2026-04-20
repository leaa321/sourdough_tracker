import type {
  ingredientUpload,
  recipe_ingredient_upload,
  RecipeUpdate,
  RecipeUpload,
} from "../types/recipe";
import { supabase } from "../utils/supabase";
import { checkUser } from "./UserService";

export async function getRecipes() {
  const { data, error } = await supabase.from("recipes")
    .select()
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("error loading recipes");
  }

  return data;
}

export async function getIngredientsByRecipeId(recipeId: number) {
  const ingredientIds: number[] = await getAllIngredientIds(recipeId)

  const { data, error } = await supabase
    .from("ingredients")
    .select()
    .in("id", ingredientIds)

  if (error) throw new Error("error getting ingredients by id")

  return data
}

export async function getAllIngredients() {
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

export async function getRecipeIngredientRelations() {
  const { data, error } = await supabase.from("recipe_ingredients").select();

  if (error) {
    throw new Error("error loading recipes");
  }

  return data;
}

export async function uploadRecipe(recipe: RecipeUpload) {
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

export async function uploadRecipeIngredientRelation(
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

export async function getRecipePicture(path: string) {
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

export async function deleteRecipeFromDatabase(id: number) {
  await checkUser();

  const ingredientIds = await getAllIngredientIds(id)

  if (ingredientIds != null) {
    await deleteIngredientsFromIngredientDatabase(ingredientIds)
  }

  const { error: relationError } = await supabase
    .from("recipe_ingredients")
    .delete()
    .eq("recipe_id", id);

  if (relationError) throw relationError;

  const { error: recipeError } = await supabase
    .from("recipes")
    .delete()
    .eq("id", id);

  if (recipeError) throw recipeError;
}

export async function getAllIngredientIds(recipeId: number): Promise<number[]> {
  const { data, error: ingredientRelationError } = await supabase
    .from("recipe_ingredients")
    .select("ingredient_id")
    .eq("recipe_id", recipeId)

  if (ingredientRelationError) throw new Error("error getting ingredients ids")

  const result: number[] = []

  data.forEach(id => {
    result.push(parseInt(id.ingredient_id))
  });

  return result;
}

export async function deleteIngredientsFromIngredientDatabase(ingredientIds: number[]) {
  const { error: ingredientError } = await supabase
    .from("ingredients")
    .delete()
    .in('id', ingredientIds)

  if (ingredientError) throw new Error("error deleting ids")
}

export async function updateRecipe(id: number, recipeUpdate: RecipeUpdate) {
  const { data, error } = await supabase
    .from("recipes")
    .update(recipeUpdate)
    .eq("id", id)

  if (error) throw new Error("error updating recipe")

  return data;
}

export async function deleteRecipeIngredientRelation(ingredientId: number, recipeId: number) {
  const { error } = await supabase
    .from("recipe_ingredients")
    .delete()
    .eq("ingredient_id", ingredientId)
    .eq("recipe_id", recipeId);

  if (error) throw new Error("error deleting recipe ingredient relation")
}