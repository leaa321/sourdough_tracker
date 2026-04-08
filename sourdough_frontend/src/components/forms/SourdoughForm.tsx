import { useState } from "react";
import type { pastryUpload } from "../../types/pastry"
import { ToastMessage, useToast } from "../ToastMessage";
import { uploadPastry, uploadPastryImage } from "../../service/PastryService";
import "../../style/Form.scss"

export function SourdoughForm() {
    const [file, setFile] = useState<File | null>(null);
    const { visible, message, type, showToast } = useToast();


    const handleSubmitLoaf: React.SubmitEventHandler<HTMLFormElement> = async (formValue) => {
        formValue.preventDefault();
        const data = new FormData(formValue.currentTarget)

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
            formValue.currentTarget.reset();
            setFile(null);
        } catch (err) {
            console.error(err);
            showToast("error uploading pastry", 2000, "error");
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
                <button type="submit">Upload pastry</button>
            </form>
            <ToastMessage visible={visible} message={message} type={type}></ToastMessage>
        </div>
    )
}
