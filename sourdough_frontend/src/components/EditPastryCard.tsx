import { useState } from "react";
import type { pastry, PastryUpdate } from "../types/pastry"
import { deletePastryFromDatabase, updatePastry } from "../service/PastryService";
import { ToastMessage, useToast } from "./ToastMessage";
import { IoTrashBinOutline } from "react-icons/io5";

export type EditPastryProps = {
    pastry: pastry
    onSaved?: () => void | Promise<void>;
    onDeleted?: () => void | Promise<void>;
}

export function EditPastryCard({ pastry, onSaved, onDeleted }: EditPastryProps) {
    const [title, setTitle] = useState<string>(pastry.title);
    const [description, setDescription] = useState<string>(pastry.description);
    const [tag, setTag] = useState<string>(pastry.tag);
    const { visible, message, type, showToast } = useToast();

    async function deletePastry() {
        try {
            await deletePastryFromDatabase(pastry.id);
            await onDeleted?.();
        } catch (err) {
            console.error(err);
            showToast("error deleting pastry", 2000, "error");
        }
    }

    const handleEditPastry: React.SubmitEventHandler<HTMLFormElement> = async (formValue) => {
        formValue.preventDefault()

        try {
            const pastryUpdate: PastryUpdate = {
                title: title,
                description: description,
                tag: tag
            }
            await updatePastry(pastry.id, pastryUpdate)
            await onSaved?.();
        } catch (err) {
            console.error(err);
            showToast("error updating pastry", 2000, "error")
        }
    }

    return (
        <>
            <form onSubmit={handleEditPastry} className="edit-card" id="edit-form">
                <div className="input-group">
                    <span>Title: </span>
                    <input
                        type="text"
                        name="text"
                        value={title}
                        onChange={(t) => setTitle(t.target.value)}
                    />
                </div>
                <div className="input-group">
                    <span>Description: </span>
                    <input
                        type="text"
                        name="description"
                        value={description}
                        onChange={(d) => setDescription(d.target.value)}
                    />
                </div>
                <div className="input-group">
                    <span>Tag: </span>
                    <input
                        type="text"
                        name="tag"
                        value={tag}
                        onChange={(t) => setTag(t.target.value)}
                    />
                </div>
            </form>
            <div className="bottom-section">
                <button type="submit" form="edit-form">Save</button>
                <button onClick={deletePastry}><IoTrashBinOutline className="delete-icon" /></button>
            </div>
            <ToastMessage visible={visible} message={message} type={type}></ToastMessage>
        </>
    )
}