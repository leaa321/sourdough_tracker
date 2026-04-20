import { useEffect, useState } from "react"
import { type ingredient, type recipe, type recipe_ingredient_upload, type recipeIngredientDraft, type RecipeUpdate } from "../types/recipe"
import { ToastMessage, useToast } from "./ToastMessage";
import { deleteRecipeFromDatabase, deleteRecipeIngredientRelation, getIngredientByTitle, getIngredientsByRecipeId, updateRecipe, uploadIngredient, uploadRecipeIngredientRelation } from "../service/RecipeService";
import { IoTrashBinOutline } from "react-icons/io5";
import "../style/EditCard.scss"
import { EditIngredientCard } from "./EditIngredientCard";
import { IngredientForm } from "./forms/IngredientForm";

export type EditRecipeProps = {
    recipe: recipe,
    onSaved?: () => void | Promise<void>;
    onDeleted?: () => void | Promise<void>;
}

export function EditRecipeCard({ recipe, onSaved, onDeleted }: EditRecipeProps) {
    const [title, setTitle] = useState<string>(recipe.title);
    const [description, setDescription] = useState<string>(recipe.description);
    const [instructions, setInstructions] = useState<string>(recipe.instructions);
    const [tag, setTag] = useState<string>(recipe.tag);
    const [time, setTime] = useState<number>(recipe.time);
    const [ingredients, setIngredients] = useState<ingredient[]>([]);
    const { visible, message, type, showToast } = useToast();

    const handleEditRecipe: React.SubmitEventHandler<HTMLFormElement> = async (formValue) => {
        formValue.preventDefault();

        try {
            const recipeUpdate: RecipeUpdate = {
                title: title,
                description: description,
                instructions: instructions,
                tag: tag,
                time: time
            }
            await updateRecipe(recipe.id, recipeUpdate)
            await onSaved?.();
        } catch (err) {
            console.error(err)
            showToast("failed to edit recipe", 2000, "error")
        }
    }

    async function deleteRecipe() {
        try {
            await deleteRecipeFromDatabase(recipe.id);
            await onDeleted?.();
        } catch (err) {
            showToast("recipe couldnt be deleted", 2000, "error")
        }
    }

    async function load() {
        try {
            getIngredientsByRecipeId(recipe.id).then(setIngredients).catch(console.error)
        } catch (err) {
            console.error(err);
        }
    }

    async function addIngredient(ingredientDraft: recipeIngredientDraft) {

        try {
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
                recipe_id: recipe.id,
                ingredient_id: ingredientId,
                amount: ingredientDraft.amount,
                unit: ingredientDraft.unit,
                specification: ingredientDraft.specification,
            }

            await uploadRecipeIngredientRelation(relation);
            showToast("added ingredient", 2000, "success")
            return ingredientId
        } catch (err) {
            console.error(err)
            showToast("error updating ingredient", 2000, "error")
        }
    }

    async function deleteIngredient(ingredientId: number) {
        try {
            await deleteRecipeIngredientRelation(ingredientId, recipe.id);
        } catch (err) {
            console.error(err);
            showToast("error deleting ingredient", 2000, "error")
        }
    }

    async function handleAddIngredient(ingredientDraft: recipeIngredientDraft) {
        const ingredientId = await addIngredient(ingredientDraft);
        if (ingredientId == null) return

        setIngredients((prev) => [...prev, {
            id: ingredientId,
            title: ingredientDraft.title
        }]);

    }

    async function handleRemoveIngredient(indexToRemove: number, ingredientId: number) {
        setIngredients((prev) =>
            prev.filter((_, index) => index !== indexToRemove),
        );
        await deleteIngredient(ingredientId);
    }

    useEffect(() => {
        load();
    }, [])

    return (
        <>
            <form onSubmit={handleEditRecipe} className="edit-card" id="edit-form">
                <div className="input-group">
                    <span>Title: </span>
                    <input
                        type="text"
                        name="text"
                        value={title}
                        onChange={(t) => setTitle(t.target.value)}
                    />
                </div>
                <div className="input-group">
                    <span>Description: </span>
                    <input
                        type="text"
                        name="description"
                        value={description}
                        onChange={(d) => setDescription(d.target.value)}
                    />
                </div>
                <div className="input-group">
                    <span>Instructions: </span>
                    <textarea
                        name="instructions"
                        value={instructions}
                        onChange={(i) => setInstructions(i.target.value)}
                    />
                </div>
                <div className="input-group">
                    <span>Tag: </span>
                    <input
                        type="text"
                        name="tag"
                        value={tag}
                        onChange={(t) => setTag(t.target.value)}
                    />
                </div>
                <div className="input-group">
                    <span>Time: </span>
                    <input
                        type="number"
                        name="time"
                        value={time}
                        onChange={(t) => setTime(t.target.valueAsNumber)}
                    />
                </div>
            </form>
            <IngredientForm onAdd={handleAddIngredient} />
            <EditIngredientCard handleRemoveIngredient={handleRemoveIngredient} ingredients={ingredients} />

            <div className="bottom-section">
                <button type="submit" form="edit-form">Save</button>
                <button onClick={deleteRecipe}><IoTrashBinOutline className="delete-icon" /></button>
            </div>
            <ToastMessage visible={visible} message={message} type={type}></ToastMessage>
        </>)
}