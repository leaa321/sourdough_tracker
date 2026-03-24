import { useEffect, useState } from "react"
import { uploadLoaf, uploadLoafImage } from "./service/LoafService"
import type { loafUpload } from "./models/loaf";
import { ToastMessage, useToast } from "./ToastMessage";
import { checkUser } from "./service/UserService";


export function AdminPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const { visible, message, showToast } = useToast();

    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [tag, setTag] = useState<string>("");
    const [file, setFile] = useState<File | null>();

    async function init() {
        try {
            const user = await checkUser();

            if (!user) {
                setIsAuthorized(false);
                setIsLoading(false);;
                return;
            }
            setIsAuthorized(true);
        } catch (err) {
            console.error(err);
            setIsAuthorized(false);
        } finally {
            setIsLoading(false)
        }
    }


    const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (formValue) => {
        formValue.preventDefault();

        if (!file) {
            showToast("add a pic")
            return;
        }

        try {
            const imagePath = await uploadLoafImage(file);

            const loaf: loafUpload = {
                title: title,
                description: description,
                image_path: imagePath,
                tag: tag
            }
            await uploadLoaf(loaf);
            showToast("Upload successful");

            setDescription("");
            setTitle("");
            setTag("");
            setFile(null);

        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        init();
    }, [])

    if (isLoading) {
        return <div>Loading ...</div>
    }

    if (!isAuthorized) {
        return <div>You are not an user!</div>
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <span className="input-title">Title: </span>
                    <input type="text"
                        name="title"
                        value={title}
                        onChange={(t) => setTitle(t.target.value)}
                    />
                </div>
                <div className="input-group">
                    <span className="input-title">Description: </span>
                    <input type="text"
                        name="description"
                        value={description}
                        onChange={(d) => setDescription(d.target.value)}
                    />
                </div>
                <div className="input-group">
                    <span className="input-title">Tag: </span>
                    <input type="text"
                        name="tag"
                        value={tag}
                        onChange={(t) => setTag(t.target.value)}
                    />
                </div>
                <div className="input-group">
                    <span className="input-title">Picture: </span>
                    <input type="file"
                        accept="image/*"
                        onChange={(f) => {
                            const file = f.target.files?.[0] ?? null;
                            setFile(file);
                        }
                        }
                    />
                </div>
                <button type="submit">Upload loaf</button>

            </form>

            <ToastMessage visible={visible} message={message} />
        </>
    )
}