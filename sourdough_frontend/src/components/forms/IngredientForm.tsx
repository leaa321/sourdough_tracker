import { useState } from "react";
import type { recipeIngredientDraft } from "../../types/recipe";
import { ToastMessage, useToast } from "../ToastMessage";
import "../../style/Form.scss"

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
        <details>
          <summary>Add Ingredient</summary>
          <form onSubmit={handleSubmitIngredient} >
            <div className="input-group">
              <span className="input-title">Title: </span>
              <input
                type="text"
                name="title"
                required
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
                value={amount}
                onChange={(d) => setAmount(d.target.valueAsNumber)}
              />
            </div>
            <div className="input-group">
              <span className="input-title">Unit: </span>
              <input
                type="text"
                name="unit"
                required
                value={unit}
                onChange={(t) => setUnit(t.target.value)}
              />
            </div>
            <div className="input-group">
              <span className="input-title">Specification: </span>
              <input
                type="text"
                value={specification}
                onChange={(s) => setSpecification(s.target.value)}
              />
            </div>
            <button type="submit" >
              Add ingredient
            </button>
          </form>
        </details>
      </div>
      <ToastMessage visible={visible} message={message} type={type}></ToastMessage>
    </>
  );
}
