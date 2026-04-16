import { useEffect, useState } from "react";
import { checkUser } from "../service/UserService";
import { SourdoughForm } from "../components/forms/SourdoughForm";
import { RecipeForm } from "../components/forms/RecipeForm";
import "../style/AdminPage.scss"
import { IoCogOutline, IoPencilOutline } from "react-icons/io5";
import { getPastries } from "../service/PastryService";
import type { pastry } from "../types/pastry";
import { getRecipes } from "../service/RecipeService";
import type { recipe } from "../types/recipe";
import { Popup } from "../components/Popup";
import { EditRecipeCard } from "../components/EditRecipeCard";
import { EditPastryCard } from "../components/EditPastryCard";
import { ToastMessage, useToast } from "../components/ToastMessage";

type LogOutProps = {
  onLogOut: () => void;
}

export function AdminPage({ onLogOut }: LogOutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pastries, setPastries] = useState<pastry[]>([]);
  const [recipes, setRecipes] = useState<recipe[]>([]);
  const [isRecipePopupVisible, setRecipePopupVisible] = useState<boolean>(false);
  const [selectedRecipe, setSelectedRecipe] = useState<recipe | null>(null);
  const [selectedPastry, setSelectedPastry] = useState<pastry | null>(null);
  const [isPastryPopupVisible, setPastryPopupVisible] = useState<boolean>(false);
  const { visible, message, type, showToast } = useToast();

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

  function togglePopupRecipeEdit(recipe: recipe) {
    if (isRecipePopupVisible) {
      setRecipePopupVisible(false)
      setSelectedRecipe(null)
    } else {
      setRecipePopupVisible(true)
      setSelectedRecipe(recipe)
    }
  }

  function togglePopupPastryEdit(pastry: pastry) {
    if (isPastryPopupVisible) {
      setSelectedPastry(null);
      setPastryPopupVisible(false);
    } else {
      setSelectedPastry(pastry);
      setPastryPopupVisible(true);
    }
  }

  async function loadRecipes() {
    try {
      const data = await getRecipes();
      setRecipes(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadPastries() {
    try {
      const data = await getPastries();
      setPastries(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    loadPastries();
  }, [])

  useEffect(() => {
    loadRecipes();
  }, [])

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (!isAuthorized) {
    return <div>You are not an user!</div>;
  }

  return (
    <>
      <h2 className="admin-title">Admin <IoCogOutline /> </h2>
      <main className="admin-body">
        <div className="details-section">
          <details >
            <summary>Add Pastry</summary>
            <SourdoughForm></SourdoughForm>
          </details>
          <details>
            <summary>Add Recipe</summary>
            <RecipeForm></RecipeForm>
          </details>
          <details>
            <summary>Manage Pastries</summary>
            <ul className="edit-list">
              {pastries.map((pastry) => {
                return (
                  <li key={pastry.id} className="delete-item-card">
                    <h3>{pastry.title}</h3>
                    <p>{pastry.description}</p>
                    {pastry.created_at
                      ? new Date(pastry.created_at).toLocaleDateString("de-DE")
                      : "no date"}
                    <button className="edit-item" onClick={() => togglePopupPastryEdit(pastry)}>
                      <IoPencilOutline />
                    </button>
                  </li>
                )
              }
              )}
              {selectedPastry && <Popup
                content={<EditPastryCard pastry={selectedPastry} />}
                title={selectedPastry.title}
                isVisible={() => togglePopupPastryEdit(selectedPastry)}
                visible={isPastryPopupVisible} />
              }
            </ul>
          </details>
          <details>
            <summary>Manage Recipes</summary>
            <ul className="edit-list">
              {recipes.map((recipe) => {
                return (
                  <li key={recipe.id} className="delete-item-card">
                    <h3>{recipe.title}</h3>
                    <p>{recipe.description}</p>
                    {recipe.created_at
                      ? new Date(recipe.created_at).toLocaleDateString("de-DE")
                      : "no date"}
                    <button className="edit-item" onClick={() => togglePopupRecipeEdit(recipe)}>
                      <IoPencilOutline />
                    </button>
                  </li>
                )
              }
              )}
              {selectedRecipe && <Popup
                content={<EditRecipeCard
                  recipe={selectedRecipe}
                  onSaved={
                    () => {
                      showToast("recipe updated", 2000, "success");
                      setRecipePopupVisible(false);
                      loadRecipes();
                    }}
                  onDeleted={() => {
                    showToast("recipe deleted", 2000, "success");
                    setRecipePopupVisible(false);
                    loadRecipes();
                  }}
                />}
                title={"Edit " + selectedRecipe.title}
                isVisible={() => togglePopupRecipeEdit(selectedRecipe)}
                visible={isRecipePopupVisible} />
              }
            </ul>
          </details>
        </div>
        <button
          className="logout-button"
          onClick={() => onLogOut()}>Log Out</button>
        <ToastMessage visible={visible} message={message} type={type}></ToastMessage>

      </main >

    </>
  );
}
