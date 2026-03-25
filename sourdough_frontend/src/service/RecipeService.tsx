import { supabase } from "../utils/supabase";


export async function getRecipes() {
    const { data, error } = await supabase
        .from("recipes")
        .select()

    if (error) {
        throw new Error("error loading recipes")
    }

    return data;
}

export async function getIngredients() {
    const { data, error } = await supabase
        .from("ingredients")
        .select()

    if (error) {
        throw new Error("error loading ingredients")
    }

    return data;
}

export async function getRecipeIngredients() {
    const { data, error } = await supabase
        .from("recipe_ingredients")
        .select()

    if (error) {
        throw new Error("error loading recipes")
    }

    console.log(data);

    return data;
}

