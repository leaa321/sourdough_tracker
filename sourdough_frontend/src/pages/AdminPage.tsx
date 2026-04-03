import { useEffect, useState } from "react";
import { uploadLoaf, uploadLoafImage } from "../service/LoafService";
import type { loafUpload } from "../types/loaf";
import { ToastMessage, useToast } from "../components/ToastMessage";
import { checkUser } from "../service/UserService";
import type {
  recipe_ingredient_upload,
  recipeIngredientDraft,
  recipeUpload,
} from "../types/recipe";
import {
  getIngredientByTitle,
  uploadIngredient,
  uploadRecipe,
  uploadRecipeImage,
  uploadRecipeIngredient,
} from "../service/RecipeService";
import { IngredientForm } from "../components/forms/IngredientForm";

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
  const [ingredientsToAdd, setIngredientsToAdd] = useState<
    recipeIngredientDraft[]
  >([]);

  async function init() {
    try {
      const user = await checkUser();

      if (!user) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }
      setIsAuthorized(true);
    } catch (err) {
      console.error(err);
      setIsAuthorized(false);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    init();
  }, []);

  function handleAddIngredient(ingredient: recipeIngredientDraft) {
    setIngredientsToAdd((prev) => [...prev, ingredient]);
  }

  function handleRemoveIngredient(indexToRemove: number) {
    setIngredientsToAdd((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  }

  const handleSubmitLoaf: React.SubmitEventHandler<HTMLFormElement> = async (
    formValue,
  ) => {
    formValue.preventDefault();

    if (!file) {
      showToast("add a pic");
      return;
    }

    try {
      const imagePath = await uploadLoafImage(file);

      const loaf: loafUpload = {
        title: title,
        description: description,
        image_path: imagePath,
        tag: tag,
      };

      await uploadLoaf(loaf);
      showToast("Upload successful");

      setDescription("");
      setTitle("");
      setTag("");
      setFile(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitRecipe: React.SubmitEventHandler<HTMLFormElement> = async (
    formValue,
  ) => {
    formValue.preventDefault();
    console.log("test");

    if (!recipeFile) {
      showToast("add a pic");
      return;
    }

    if (ingredientsToAdd.length === 0) {
      showToast("add at least one ingredient");
      return;
    }

    try {
      const imagePath = await uploadRecipeImage(recipeFile);

      const recipe: recipeUpload = {
        title: recipeTitle,
        description: recipeDescription,
        instructions: recipeInstructions,
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

        setRecipeTitle("");
        setRecipeDescription("");
        setRecipeInstructions("");
        setRecipeFile(null);
        setIngredientsToAdd([]);
      }

      showToast("Recipe added!");
    } catch (err) {
      console.error(err);
      showToast("Recipe upload failed");
    }
  };

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (!isAuthorized) {
    return <div>You are not an user!</div>;
  }

  return (
    <>
      <div className="submit-section">
        <form onSubmit={handleSubmitLoaf}>
          <div className="input-group">
            <span className="input-title">Title: </span>
            <input
              type="text"
              name="title"
              required
              value={title}
              onChange={(t) => setTitle(t.target.value)}
            />
          </div>
          <div className="input-group">
            <span className="input-title">Description: </span>
            <input
              type="text"
              name="description"
              required
              value={description}
              onChange={(d) => setDescription(d.target.value)}
            />
          </div>
          <div className="input-group">
            <span className="input-title">Tag: </span>
            <input
              type="text"
              name="tag"
              required
              value={tag}
              onChange={(t) => setTag(t.target.value)}
            />
          </div>
          <div className="input-group">
            <span className="input-title">Picture: </span>
            <input
              type="file"
              required
              accept="image/*"
              onChange={(f) => {
                const file = f.target.files?.[0] ?? null;
                setFile(file);
              }}
            />
          </div>
          <button type="submit">Upload loaf</button>
        </form>
      </div>

      <form onSubmit={handleSubmitRecipe} id="recipeForm"></form>

      <div className="input-group">
        <span className="input-title">Title: </span>
        <input
          type="text"
          name="title"
          form="recipeForm"
          required
          value={recipeTitle}
          onChange={(t) => setRecipeTitle(t.target.value)}
        />
      </div>
      <div className="input-group">
        <span className="input-title">Description: </span>
        <input
          type="text"
          name="description"
          form="recipeForm"
          required
          value={recipeDescription}
          onChange={(d) => setRecipeDescription(d.target.value)}
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
          value={recipeInstructions}
          onChange={(t) => setRecipeInstructions(t.target.value)}
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
      <ToastMessage visible={visible} message={message} />
    </>
  );
}
