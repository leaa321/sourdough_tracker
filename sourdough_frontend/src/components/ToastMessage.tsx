import { useState } from "react"

type ToastProps = {
    message: string;
    visible: boolean;
};

export function ToastMessage({ message, visible }: ToastProps) {
    if (!visible) return null;

    return <div className="toast">{message}</div>;
}

export function useToast() {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");

    function showToast(newMessage: string, duration = 2000) {
        setMessage(newMessage);
        setVisible(true);

        setTimeout(() => {
            setVisible(false);
        }, duration);
    }

    return {
        visible,
        message,
        showToast
    };
}