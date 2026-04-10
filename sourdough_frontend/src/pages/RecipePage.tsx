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
import { Searchbar } from "../components/SearchBar";

export type recipeGroupTag = {
  recipes: recipe[],
  tag: string
}

export function RecipePage() {
  const [recipes, setRecipes] = useState<recipe[]>([]);
  const [tags, setTags] = useState<string[]>();
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    getRecipes().then(setRecipes).catch(console.error);
  }, []);

  useEffect(() => {
    getAllRecipeTags().then(setTags).catch(console.error);
  }, [])

  function handleSelect(tag: string) {
    setSelectedTag(tag);
  }

  function handleSearch(input: string) {
    setInput(input);
  }

  const filteredRecipes = useMemo(() => {
    if (selectedTag === "All") {
      return recipes.filter((recipe) =>
        recipe.title.trim().toLowerCase().includes(input.trim().toLowerCase())
      );
    }

    return recipes.filter((recipe) =>
      recipe.tag === selectedTag &&
      (
        input.trim() === "" ||
        recipe.title.trim().toLowerCase().includes(input.trim().toLowerCase())
      )
    );
  }, [recipes, selectedTag, input]);

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
        <Searchbar onWrite={handleSearch} />
      </div>

      <ul>
        <h4>Filter: {selectedTag}</h4>
        {recipeGroup.map((group) => (
          <li key={group.tag}>
            <ul>
              {group.recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} path={recipe.image_path} />
              ))}
            </ul>
          </li>
        ))}
      </ul>

    </>
  );
}
