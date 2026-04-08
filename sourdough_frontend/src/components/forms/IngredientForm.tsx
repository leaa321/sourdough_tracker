import { useState } from "react";
import type { recipeIngredientDraft } from "../../types/recipe";
import { ToastMessage, useToast } from "../ToastMessage";

export type IngredientSelectProps = {
  onAdd: (ingredient: recipeIngredientDraft) => void;
};

export function IngredientForm({ onAdd }: IngredientSelectProps) {
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number>(1);
  const [unit, setUnit] = useState<string>("");
  const [specification, setSpecification] = useState<string>("");
  const { visible, message, type, showToast } = useToast();

  //Form Date or state object

  const handleSubmitIngredient: React.SubmitEventHandler<
    HTMLFormElement
  > = async (formValue) => {
    formValue.preventDefault();

    try {
      const ingredient: recipeIngredientDraft = {
        title: title,
        amount: amount,
        unit: unit,
        specification: specification,
      };

      onAdd(ingredient);
      showToast("Added Ingredient", 2000, "success");
      setTitle("");
      setAmount(1);
      setUnit("");
      setSpecification("");
    } catch (err) {
      console.error(err);
      showToast("Adding Ingredient failed", 2000, "error");
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmitIngredient} id="ingredientForm">
          <div className="input-group">
            <span className="input-title">Title: </span>
            <input
              type="text"
              name="title"
              required
              form="ingredientForm"
              value={title}
              onChange={(t) => setTitle(t.target.value)}
            />
          </div>
          <div className="input-group">
            <span className="input-title">Amount: </span>
            <input
              type="number"
              name="description"
              required
              form="ingredientForm"
              value={amount}
              onChange={(d) => setAmount(d.target.valueAsNumber)}
            />
          </div>
          <div className="input-group">
            <span className="input-title">Unit: </span>
            <input
              type="text"
              name="tag"
              required
              form="ingredientForm"
              value={unit}
              onChange={(t) => setUnit(t.target.value)}
            />
          </div>
          <div className="input-group">
            <span className="input-title">Specification: </span>
            <input
              type="text"
              form="ingredientForm"
              value={specification}
              onChange={(s) => setSpecification(s.target.value)}
            />
          </div>
          <button type="submit" form="ingredientForm">
            Add ingredient
          </button>
        </form>
      </div>
      <ToastMessage visible={visible} message={message} type={type}></ToastMessage>
    </>
  );
}
