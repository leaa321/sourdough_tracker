import { useEffect, useState } from "react";
import type { IngredientSelectProps } from "./IngredientForm";
import type { ingredient } from "./models/recipe";
import { getIngredients } from "./service/RecipeService";



export function IngredientSelect({ onAdd }: IngredientSelectProps) {
    const [ingredients, setIngredients] = useState<ingredient[]>([]);

    useEffect(() => {
        getIngredients()
            .then(setIngredients)
            .catch(console.error)
    }, [])

    return (
        <>
            <select name="ingredients" id="ingredients">
                {ingredients.map((ingredient) => {
                    return (
                        <option value="ingredient" key={ingredient.id}>{ingredient.title}</option>
                    )
                })}
            </select>
        </>
    )
}
