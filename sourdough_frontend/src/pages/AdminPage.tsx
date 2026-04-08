import { useEffect, useState } from "react";
import { checkUser } from "../service/UserService";
import { SourdoughForm } from "../components/forms/SourdoughForm";
import { RecipeForm } from "../components/forms/RecipeForm";
import "../style/AdminPage.scss"
import { IoCogOutline } from "react-icons/io5";

type LogOutProps = {
  onLogOut: () => void;
}

export function AdminPage({ onLogOut }: LogOutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

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
        </div>
        <button
          className="logout-button"
          onClick={() => onLogOut()}>Log Out</button>
      </main >
    </>
  );
}
