import { useState } from "react";
import { uploadLoaf, uploadLoafImage } from "../../service/LoafService";
import type { loafUpload } from "../../types/loaf"
import { ToastMessage, useToast } from "../ToastMessage";

export function SourdoughForm() {
    const [file, setFile] = useState<File | null>(null);
    const { visible, message, showToast } = useToast();

    const handleSubmitLoaf: React.SubmitEventHandler<HTMLFormElement> = async (formValue) => {
        formValue.preventDefault();
        const data = new FormData(formValue.currentTarget)

        if (!file) {
            showToast("add a pic")
            return;
        }
        try {
            const imagePath = await uploadLoafImage(file)

            const loaf: loafUpload = {
                title: data.get("title") as string,
                description: data.get("description") as string,
                image_path: imagePath,
                tag: data.get("tag") as string
            }

            await uploadLoaf(loaf);
            showToast("Upload successful");
            formValue.currentTarget.reset();
            setFile(null);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="submit-section">
            <form onSubmit={handleSubmitLoaf}>
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
                    <input
                        type="text"
                        name="description"
                        required
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
                <button type="submit">Upload loaf</button>
            </form>
            <ToastMessage visible={visible} message={message} />
        </div>
    )
}
