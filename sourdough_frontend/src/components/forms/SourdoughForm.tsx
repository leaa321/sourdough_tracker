import { useState } from "react";
import type { pastryUpload } from "../../types/pastry"
import { ToastMessage, useToast } from "../ToastMessage";
import { uploadPastry, uploadPastryImage } from "../../service/PastryService";
import "../../style/Form.scss"

export type SourdoughFormProps = {
    onAdd?: () => void | Promise<void>;
}

export function SourdoughForm({ onAdd }: SourdoughFormProps) {
    const [file, setFile] = useState<File | null>(null);
    const { visible, message, type, showToast } = useToast();


    const handleSubmitPastry: React.SubmitEventHandler<HTMLFormElement> = async (formValue) => {
        formValue.preventDefault();
        const data = new FormData(formValue.currentTarget)

        if (!data) return

        if (!file) {
            showToast("add a pic", 2000, "error")
            return;
        }
        try {
            const imagePath = await uploadPastryImage(file)

            const pastry: pastryUpload = {
                title: data.get("title") as string,
                description: data.get("description") as string,
                image_path: imagePath,
                tag: data.get("tag") as string
            }

            await uploadPastry(pastry);
            showToast("Upload successful", 2000, "success");
            await onAdd?.()
            formValue.currentTarget.reset();
            setFile(null);
        } catch (err) {
            console.error(err);
            showToast("error uploading pastry", 2000, "error");
        }
    }

    return (
        <div className="submit-section">
            <form onSubmit={handleSubmitPastry}>
                <div className="input-group">
                    <span className="input-title">Title: </span>
                    <input
                        type="text"
                        name="title"
                        required
                    />
                </div>
                <div className="input-group">
                    <span className="input-title">Description: </span>
                    <textarea
                        name="description"
                        typeof="text"
                    />
                </div>
                <div className="input-group">
                    <span className="input-title">Tag: </span>
                    <input
                        type="text"
                        name="tag"
                        required
                    />
                </div>
                <div className="input-group">
                    <span className="input-title">Picture: </span>
                    <input
                        type="file"
                        required
                        accept="image/*"
                        onChange={(f) => {
                            const file = f.target.files?.[0] ?? null;
                            setFile(file);
                        }}
                    />
                </div>
                <button type="submit">Upload pastry</button>
            </form>
            <ToastMessage visible={visible} message={message} type={type}></ToastMessage>
        </div>
    )
}
