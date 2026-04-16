import { useState } from "react"
import type { recipe, RecipeUpdate } from "../types/recipe"
import { ToastMessage, useToast } from "./ToastMessage";
import { deleteRecipeFromDatabase, updateRecipe } from "../service/RecipeService";
import { IoTrashBinOutline } from "react-icons/io5";
import "../style/EditCard.scss"

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
            <div className="bottom-section">
                <button type="submit" form="edit-form">Save</button>
                <button onClick={deleteRecipe}><IoTrashBinOutline className="delete-icon" /></button>
            </div>
            <ToastMessage visible={visible} message={message} type={type}></ToastMessage>
        </>)
}