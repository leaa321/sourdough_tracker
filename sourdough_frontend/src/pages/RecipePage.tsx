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
import Fuse, { type FuseResult } from "fuse.js"

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

  const fuse = new Fuse(recipes, {
    keys: ["title"
    ]
  })

  const filteredRecipes = useMemo(() => {
    const result = fuse.search(input.trim())

    if (selectedTag === "All") {
      return result
    }

    return result.filter((recipe) =>
      recipe.item.tag === selectedTag
    );
  }, [recipes, selectedTag, input]);

  const recipeGroup = useMemo<recipeGroupTag[]>(() => {
    const groups: Record<string, recipe[]> = {};

    filteredRecipes.forEach((rec: FuseResult<recipe>) => {
      const tag = rec.item.tag ?? "No tag";
      if (!groups[tag]) {
        groups[tag] = [];
      }

      groups[tag].push(rec.item);
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
