import { useEffect, useState } from "react";
import { checkUser } from "../service/UserService";
import { SourdoughForm } from "../components/forms/SourdoughForm";
import { RecipeForm } from "../components/forms/RecipeForm";

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

      <SourdoughForm></SourdoughForm>
      <RecipeForm></RecipeForm>
      <button onClick={() => onLogOut()}>Log Out</button>
    </>
  );
}
