import type { IconType } from "react-icons";
import "../style/CustomButton.scss"

export type ButtonProps = {
    onButtonClick: () => void;
    style?: string;
    icon?: IconType;
    text?: string
}

export function CustomButton({ onButtonClick, style, icon: Icon, text }: ButtonProps) {

    return (
        <>
            <button onClick={onButtonClick} className={style}>
                {text && <p>{text}</p>}
                {Icon && <Icon />}
            </button>
        </>
    )
}