import { useEffect, useState } from "react";
import { type ingredient, type recipe, type recipe_ingredient } from "./models/recipe";
import { getIngredients, getRecipeIngredients, getRecipes } from "./service/RecipeService";

export function RecipePage() {
    const [recipes, setRecipes] = useState<recipe[]>([]);
    const [ingredients, setIngredients] = useState<ingredient[]>([]);
    const [con, setCon] = useState<recipe_ingredient[]>([]);

    useEffect(() => {
        getRecipes()
            .then(setRecipes)
            .catch(console.error)

        getIngredients()
            .then(setIngredients)
            .catch(console.error)

        getRecipeIngredients()
            .then(setCon)
            .catch(console.error)
    }, [])

    return (
        <>
            <ul>
                {recipes.map((recipe) => {
                    const related = con.filter(c => c.recipe_id === recipe.id);
                    return (
                        <li key={recipe.id}>
                            {recipe.title}
                            <ul>
                                {related.map((c) => {
                                    const ingredient = ingredients.find(i => i.id === c.ingredient_id);
                                    return (
                                        <li key={c.id}>
                                            {ingredient?.title} {c.amount} {c.unit}
                                            <br />
                                            <span>{c.specification}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </li>
                    );
                })}
            </ul>
        </>
    )
}