import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { recipe } from "../types/recipe";
import { getRecipeById } from "../service/RecipeService";
import { RecipeItem } from "../components/RecipeItem";
import { IoArrowBack } from "react-icons/io5";
import "../style/SingleRecipePage.scss"


export function SingleRecipePage() {
    let params = useParams();
    const [recipe, setRecipe] = useState<recipe>();

    useEffect(() => {
        async function load(id: number) {
            try {
                getRecipeById(id).then(setRecipe)
            } catch (err) {
                console.error(err)
            }
        }

        if (params.recipeId) {
            let id: number = parseInt(params.recipeId);
            load(id)
        }
    });


    return (
        <>
            <main className="single-recipe-page">
                <div className="top-section-recipe">
                    <Link to="/recipes"> <IoArrowBack /></Link>
                </div>
                <div className="recipe-section">
                    {recipe && <RecipeItem recipe={recipe} path={recipe?.image_path}></RecipeItem>}
                </div>
            </main >
        </>
    )
}