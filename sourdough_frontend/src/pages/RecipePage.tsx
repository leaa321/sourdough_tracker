import { useEffect, useMemo, useState } from "react";
import {
  type recipe,
} from "../types/recipe";
import "../style/RecipePage.scss"
import {
  getAllRecipeTags,
  getRecipes,
} from "../service/RecipeService";
import { RecipeCard } from "../components/RecipeCard";
import { TagFilter } from "../components/TagFilter";

export type recipeGroupTag = {
  recipes: recipe[],
  tag: string
}

export function RecipePage() {
  const [recipes, setRecipes] = useState<recipe[]>([]);
  const [tags, setTags] = useState<string[]>();
  const [selectedTag, setSelectedTag] = useState<string>("All");

  useEffect(() => {
    getRecipes().then(setRecipes).catch(console.error);
  }, []);

  useEffect(() => {
    getAllRecipeTags().then(setTags).catch(console.error);
  }, [])

  function handleSelect(tag: string) {
    setSelectedTag(tag);
  }

  const filteredRecipes = useMemo(() => {
    if (selectedTag === "All") return recipes;

    return recipes.filter((recipe) => recipe.tag === selectedTag);
  }, [recipes, selectedTag]);

  const recipeGroup = useMemo<recipeGroupTag[]>(() => {
    const groups: Record<string, recipe[]> = {};

    filteredRecipes.forEach((recipe) => {
      const tag = recipe.tag ?? "No tag";

      if (!groups[tag]) {
        groups[tag] = [];
      }

      groups[tag].push(recipe);
    });

    return Object.entries(groups).map(([tag, recipes]) => ({
      tag,
      recipes,
    }));
  }, [filteredRecipes]);

  return (
    <>
      <div className="title-section">
        <h2>Recipes</h2>
      </div>
      <div className="filter-section">
        {tags && <TagFilter tags={tags} onSelectTag={handleSelect} />}
      </div>
      {selectedTag === "All" ? (
        <ul>
          {recipeGroup.map((group) => (
            <li key={group.tag}>
              <h4>{group.tag}</h4>

              <ul>
                {group.recipes.map((recipe) => (
                  <li key={recipe.id}>
                    <RecipeCard recipe={recipe} path={recipe.image_path} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <ul>
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              path={recipe.image_path}
            />
          ))}
        </ul>
      )}
    </>
  );
}
