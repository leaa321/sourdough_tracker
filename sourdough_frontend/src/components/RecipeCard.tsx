import { useEffect, useState } from "react";
import "../style/RecipePage.scss"
import type { recipe } from "../types/recipe";
import { getRecipePicture } from "../service/RecipeService";
import { IoArrowForward } from "react-icons/io5";
import { Link } from "react-router-dom";

type RecipeItem = {
    recipe: recipe;
    path: string;
}

export function RecipeCard({ recipe, path }: RecipeItem) {
    const [pic, setPic] = useState<string | any>(null);


    useEffect(() => {
        async function load() {
            try {
                const url = await getRecipePicture(path);
                if (url) setPic(url);

            } catch (err) {
                console.error(err);
            }
        }

        load();
    });
    return (
        <>
            <li key={recipe.id} className="recipe-card">
                <div className="text-section">
                    <h3>{recipe.title}</h3>
                    <p>{recipe.description}</p>
                    <span>Estimated time: {recipe.time} minutes</span>
                </div>
                <div className="bottom-section">
                    <img src={pic} alt="pic of recipe" />
                    <Link to={"/recipe/" + recipe.id} className="arrow"><IoArrowForward /></Link>
                </div>
            </li>
        </>
    )
}