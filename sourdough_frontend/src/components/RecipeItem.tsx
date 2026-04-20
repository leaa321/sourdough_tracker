import { useEffect, useState } from "react";
import type { ingredient, recipe, recipe_ingredient } from "../types/recipe"
import { getAllIngredients, getRecipeIngredientRelations, getRecipePicture } from "../service/RecipeService";
import "../style/SingleRecipePage.scss"

type RecipeItem = {
    recipe: recipe;
    path: string;
}

export function RecipeItem({ recipe, path }: RecipeItem) {
    const [pic, setPic] = useState<string | any>(null);
    const [con, setCon] = useState<recipe_ingredient[]>([]);
    const [ingredients, setIngredients] = useState<ingredient[]>([]);

    useEffect(() => {
        async function load() {
            try {
                const url = await getRecipePicture(path);
                if (url) setPic(url);

                getAllIngredients().then(setIngredients).catch(console.error);
                getRecipeIngredientRelations().then(setCon).catch(console.error);
            } catch (err) {
                console.error(err);
            }
        }

        load();
    });

    const related = con.filter((c) => c.recipe_id === recipe.id);

    return (
        <div className="recipe">
            <div className="top-section">
                <div className="top-section-text">
                    <h3>{recipe.title}</h3>
                    <p className="description">{recipe.description}</p>
                </div>
                <img src={pic} alt="not working" />
            </div>
            <h4>Instructions</h4>
            <p>{recipe.instructions}</p>
            <h4>Ingredients</h4>
            <ul className="ingredient-list">
                {related.map((c) => {
                    const ingredient = ingredients.find(
                        (i) => i.id === c.ingredient_id,
                    );
                    return (
                        <li key={c.id}>
                            {ingredient?.title} {c.amount} {c.unit}
                            <br />
                            <span>{c.specification}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}