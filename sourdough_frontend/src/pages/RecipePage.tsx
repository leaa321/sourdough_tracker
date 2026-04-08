import { useEffect, useState } from "react";
import {
  type recipe,
} from "../types/recipe";
import "../style/RecipePage.scss"
import {
  getRecipes,
} from "../service/RecipeService";
import { RecipeItem } from "../components/RecipeItem";

export function RecipePage() {
  const [recipes, setRecipes] = useState<recipe[]>([]);

  useEffect(() => {
    getRecipes().then(setRecipes).catch(console.error);
  }, []);

  return (
    <>
      <div className="title-section">
        <h2>Recipes</h2>
      </div>
      <ul>
        {recipes.map((recipe) => {
          return (
            <RecipeItem key={recipe.id} recipe={recipe} path={recipe.image_path} />
          )
        })}
      </ul>
    </>
  );
}
