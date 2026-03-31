import { useEffect, useState } from "react"
import { uploadLoaf, uploadLoafImage } from "./service/LoafService"
import type { loafUpload } from "./models/loaf";
import { ToastMessage, useToast } from "./ToastMessage";
import { checkUser } from "./service/UserService";
import type { ingredientUpload, recipe_ingredient_upload, recipeUpload } from "./models/recipe";
import { uploadIngredient, uploadRecipe, uploadRecipeImage, uploadRecipeIngredient } from "./service/RecipeService";
import { IngredientSelect } from "./IngredientSelect";

export function AdminPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const { visible, message, showToast } = useToast();

    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [tag, setTag] = useState<string>("");
    const [file, setFile] = useState<File | null>();

    const [recipeTitle, setRecipeTitle] = useState<string>("");
    const [recipeDescription, setRecipeDescription] = useState<string>("");
    const [recipeInstructions, setRecipeInstructions] = useState<string>("");
    const [recipeFile, setRecipeFile] = useState<File | null>();

    const [ingredientInputOpen, setIngredientInputOpen] = useState(false);
    async function init() {
        try {
            const user = await checkUser();

            if (!user) {
                setIsAuthorized(false);
                setIsLoading(false);;
                return;
            }
            setIsAuthorized(true);
        } catch (err) {
            console.error(err);
            setIsAuthorized(false);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        init();
    }, [])

    function toggleIngredientInput() {
        setIngredientInputOpen(prev => !prev);
    }


    const handleSubmitLoaf: React.SubmitEventHandler<HTMLFormElement> = async (formValue) => {
        formValue.preventDefault();

        if (!file) {
            showToast("add a pic")
            return;
        }

        try {
            const imagePath = await uploadLoafImage(file);

            const loaf: loafUpload = {
                title: title,
                description: description,
                image_path: imagePath,
                tag: tag
            }

            await uploadLoaf(loaf);
            showToast("Upload successful");

            setDescription("");
            setTitle("");
            setTag("");
            setFile(null);

        } catch (err) {
            console.error(err);
        }
    }

    const handleSubmitRecipe: React.SubmitEventHandler<HTMLFormElement> = async (formValue) => {
        formValue.preventDefault();

        if (!recipeFile) {
            showToast("add a pic");
            return;
        }

        try {
            const imagePath = await uploadRecipeImage(recipeFile);

            const recipe: recipeUpload = {
                title: recipeTitle,
                description: recipeDescription,
                instructions: recipeInstructions,
                image_path: imagePath
            }

            let recipeData = await uploadRecipe(recipe);

            const ingredient: ingredientUpload = {
                title: "test"
            }

            let ingredientData = await uploadIngredient(ingredient);

            const relation: recipe_ingredient_upload = {
                recipe_id: recipeData.at(0).id,
                ingredient_id: ingredientData.at(0).id,
                amount: 2.0,
                unit: "grams",
                specification: "test"
            }

            console.log(relation);

            await uploadRecipeIngredient(relation);
            showToast("Recipe added!")
        } catch (err) {
            console.error(err);
        }
    }

    if (isLoading) {
        return <div>Loading ...</div>
    }

    if (!isAuthorized) {
        return <div>You are not an user!</div>
    }

    return (
        <>
            <form onSubmit={handleSubmitLoaf}>
                <div className="input-group">
                    <span className="input-title">Title: </span>
                    <input type="text"
                        name="title"
                        required
                        value={title}
                        onChange={(t) => setTitle(t.target.value)}
                    />
                </div>
                <div className="input-group">
                    <span className="input-title">Description: </span>
                    <input type="text"
                        name="description"
                        required
                        value={description}
                        onChange={(d) => setDescription(d.target.value)}
                    />
                </div>
                <div className="input-group">
                    <span className="input-title">Tag: </span>
                    <input type="text"
                        name="tag"
                        required
                        value={tag}
                        onChange={(t) => setTag(t.target.value)}
                    />
                </div>
                <div className="input-group">
                    <span className="input-title">Picture: </span>
                    <input type="file"
                        required
                        accept="image/*"
                        onChange={(f) => {
                            const file = f.target.files?.[0] ?? null;
                            setFile(file);
                        }
                        }
                    />
                </div>
                <button type="submit">Upload loaf</button>

            </form>

            <form onSubmit={handleSubmitRecipe}>
                <div className="input-group">
                    <span className="input-title">Title: </span>
                    <input type="text"
                        name="title"
                        required
                        value={recipeTitle}
                        onChange={(t) => setRecipeTitle(t.target.value)}
                    />
                </div>
                <div className="input-group">
                    <span className="input-title">Description: </span>
                    <input type="text"
                        name="description"
                        required
                        value={recipeDescription}
                        onChange={(d) => setRecipeDescription(d.target.value)}
                    />
                </div>

                <button onClick={toggleIngredientInput} type="button">Add Ingredient</button>
                {ingredientInputOpen && <IngredientSelect />}

                <div className="input-group">
                    <span className="input-title">Instructions: </span>
                    <input type="text"
                        name="instructions"
                        required
                        value={recipeInstructions}
                        onChange={(t) => setRecipeInstructions(t.target.value)}
                    />
                </div>
                <div className="input-group">
                    <span className="input-title">Picture: </span>
                    <input type="file"
                        required
                        accept="image/*"
                        onChange={(f) => {
                            const file = f.target.files?.[0] ?? null;
                            setRecipeFile(file);
                        }
                        }
                    />
                </div>
                <button type="submit">Upload recipe</button>

            </form>

            <ToastMessage visible={visible} message={message} />
        </>
    )
}