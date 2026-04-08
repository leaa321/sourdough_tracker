import { useState } from "react";
import type { recipe_ingredient_upload, recipeIngredientDraft, recipeUpload } from "../../types/recipe";
import { IngredientForm } from "./IngredientForm";
import { ToastMessage, useToast } from "../ToastMessage";
import { getIngredientByTitle, uploadIngredient, uploadRecipe, uploadRecipeImage, uploadRecipeIngredient } from "../../service/RecipeService";

export function RecipeForm() {
    const [recipeFile, setRecipeFile] = useState<File | null>();
    const [ingredientsToAdd, setIngredientsToAdd] = useState<
        recipeIngredientDraft[]
    >([]);
    const { visible, message, type, showToast } = useToast();


    function handleAddIngredient(ingredient: recipeIngredientDraft) {
        setIngredientsToAdd((prev) => [...prev, ingredient]);
    }

    function handleRemoveIngredient(indexToRemove: number) {
        setIngredientsToAdd((prev) =>
            prev.filter((_, index) => index !== indexToRemove),
        );
    }

    const handleSubmitRecipe: React.SubmitEventHandler<HTMLFormElement> = async (
        formValue,
    ) => {
        formValue.preventDefault();
        const form = formValue.currentTarget;
        const data = new FormData(form);

        if (!recipeFile) {
            showToast("add a pic", 2000, "error");
            return;
        }

        if (ingredientsToAdd.length === 0) {
            showToast("add at least one ingredient", 2000, "error");
            return;
        }

        try {
            const imagePath = await uploadRecipeImage(recipeFile);

            const recipe: recipeUpload = {
                title: data.get("title") as string,
                description: data.get("description") as string,
                instructions: data.get("instructions") as string,
                image_path: imagePath,
            };

            let recipeData = await uploadRecipe(recipe);

            for (const ingredientDraft of ingredientsToAdd) {
                const existingIngredient = await getIngredientByTitle(
                    ingredientDraft.title,
                );

                let ingredientId: number;

                if (existingIngredient) {
                    ingredientId = existingIngredient.id;
                } else {
                    const ingredientData = await uploadIngredient({
                        title: ingredientDraft.title,
                    });
                    ingredientId = ingredientData[0].id;
                }

                const relation: recipe_ingredient_upload = {
                    recipe_id: recipeData[0].id,
                    ingredient_id: ingredientId,
                    amount: ingredientDraft.amount,
                    unit: ingredientDraft.unit,
                    specification: ingredientDraft.specification,
                };

                await uploadRecipeIngredient(relation);

                setIngredientsToAdd([]);
            }
            showToast("Recipe added!", 2000, "success");
            form.reset();
            setRecipeFile(null);
        } catch (err) {
            console.error(err);
            showToast("Recipe upload failed", 2000, "error");
        }
    };

    return (
        <>

            <form onSubmit={handleSubmitRecipe} id="recipeForm"></form>

            <div className="input-group">
                <span className="input-title">Title: </span>
                <input
                    type="text"
                    name="title"
                    form="recipeForm"
                    required
                />
            </div>
            <div className="input-group">
                <span className="input-title">Description: </span>
                <input
                    type="text"
                    name="description"
                    form="recipeForm"
                    required
                />
            </div>

            <IngredientForm onAdd={handleAddIngredient} />
            <ul>
                {ingredientsToAdd.map((ingredient, index) => (
                    <li key={index}>
                        {ingredient.title} - {ingredient.amount} {ingredient.unit}{" "}
                        {ingredient.specification}
                        <button type="button" onClick={() => handleRemoveIngredient(index)}>
                            remove
                        </button>
                    </li>
                ))}
            </ul>

            <div className="input-group">
                <span className="input-title">Instructions: </span>
                <input
                    type="text"
                    name="instructions"
                    form="recipeForm"
                    required
                />
            </div>
            <div className="input-group">
                <span className="input-title">Picture: </span>
                <input
                    type="file"
                    required
                    form="recipeForm"
                    accept="image/*"
                    onChange={(f) => {
                        const file = f.target.files?.[0] ?? null;
                        setRecipeFile(file);
                    }}
                />
            </div>
            <button type="submit" form="recipeForm">
                Upload recipe
            </button>
            <ToastMessage visible={visible} message={message} type={type}></ToastMessage>
        </>
    )
}