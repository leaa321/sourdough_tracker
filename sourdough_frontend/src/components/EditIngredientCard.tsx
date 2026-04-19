import type { ingredient } from "../types/recipe"

export type EditIngredientCardProps = {
    ingredients: ingredient[]
    handleRemoveIngredient: (index: number, id: number) => void;
}

export function EditIngredientCard({ ingredients, handleRemoveIngredient }: EditIngredientCardProps) {

    return (
        <>
            <details>
                <summary>Ingredients</summary>
                <ul className="ingredient-list">
                    {ingredients.map((ingredient, index) => (
                        <li key={index} className="ingredient-item">
                            - {ingredient.title}
                            <button type="button" onClick={() => handleRemoveIngredient(index, ingredient.id)}>
                                remove
                            </button>
                        </li>
                    ))}
                </ul>
            </details>

        </>
    )
}