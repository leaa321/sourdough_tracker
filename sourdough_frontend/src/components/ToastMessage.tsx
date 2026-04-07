import { useState } from "react"
import "../style/ToastMessage.scss"

type ToastProps = {
    message: string;
    visible: boolean;
    type: string;
};

export function ToastMessage({ message, visible, type }: ToastProps) {
    if (!visible) return null;


    return (
        <>
            {type === "success" && <div className="toast success">{message}</div>}
            {type === "error" && <div className="toast error">{message}</div>}
        </>
    )
}

export function useToast() {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState("success");

    function showToast(newMessage: string, duration = 2000, type: string) {
        setMessage(newMessage);
        setVisible(true);
        setType(type);

        setTimeout(() => {
            setVisible(false);
        }, duration);
    }

    return {
        visible,
        message,
        type,
        showToast
    };
}