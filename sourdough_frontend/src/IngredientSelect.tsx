import { useState } from "react";
import type { ingredientUpload, partIngredient } from "./models/recipe";


export function IngredientSelect() {
    const [title, setTitle] = useState<string>("");
    const [amount, setAmount] = useState<number>(1);
    const [unit, setUnit] = useState<string>("");
    const [specification, setSpecification] = useState<string>("");


    const handleSubmitIngredient: React.SubmitEventHandler<HTMLFormElement> = (formValue) => {
        formValue.preventDefault();

        try {
            const ingredient: ingredientUpload = {
                title: title
            }

            const partIngredient: partIngredient = {
                amount: amount,
                unit: unit,
                specification: specification
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmitIngredient}>
                <div className="input-group">
                    <span className="input-title">Title: </span>
                    <input type="text"
                        name="title"
                        required
                        value={title}
                        onChange={(t) => setTitle(t.target.value)}
                    />
                </div>
                <div className="input-group">
                    <span className="input-title">Amount: </span>
                    <input type="number"
                        name="description"
                        required
                        value={amount}
                        onChange={(d) => setAmount(d.target.valueAsNumber)}
                    />
                </div>
                <div className="input-group">
                    <span className="input-title">Unit: </span>
                    <input type="text"
                        name="tag"
                        required
                        value={unit}
                        onChange={(t) => setUnit(t.target.value)}
                    />
                </div>
                <div className="input-group">
                    <span className="input-title">Specification: </span>
                    <input type="text"
                        onChange={(s) => setSpecification(s.target.value)}
                    />
                </div>
                <button type="submit">Add ingredient</button>

            </form>
        </div >
    )
}