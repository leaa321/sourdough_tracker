import { useEffect, useState } from "react"
import { checkUser, uploadLoaf } from "./service/LoafService"
import type { loafUpload } from "./models/loaf";
import { ToastMessage, useToast } from "./ToastMessage";


export function AdminPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const { visible, message, showToast } = useToast();

    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [tag, setTag] = useState<string>("");

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
        try {
            const loaf: loafUpload = {
                title: title,
                description: description,
                image_path: "salz.png",
                tag: tag
            }
            await uploadLoaf(loaf);
            showToast("Upload successful");

            setDescription("");
            setTitle("");
            setTag("");

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
                <button type="submit">Upload loaf</button>

            </form>

            <ToastMessage visible={visible} message={message} />
        </>
    )
}