import { IoArrowForward } from "react-icons/io5"
import "../style/Popup.scss"
import type { ReactNode } from "react"

export type PopupProps = {
    title: string,
    content: ReactNode,
    isVisible: () => void,
    visible: boolean,
}

export function Popup({ title, content, isVisible, visible }: PopupProps) {

    return (
        <>
            {visible &&
                <div className="popup-background">
                    <div className="popup-body">
                        <div className="top-section">
                            <h3>{title}</h3>
                            <button onClick={isVisible}><IoArrowForward /></button>
                        </div>
                        <div className="content">
                            {content}
                        </div>
                    </div>
                </div>}
        </>
    )
}