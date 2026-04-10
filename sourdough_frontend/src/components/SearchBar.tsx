import { IoSearchCircleOutline } from "react-icons/io5";
import "../style/Searchbar.scss"

export type SearchProp = {
    onWrite: (input: string) => void;
}

export function Searchbar({ onWrite }: SearchProp) {
    return (
        <>
            <form className="search-form">
                <div className="input-field">
                    <input type="text" name="searchText" onChange={(e) => onWrite(e.target.value)} placeholder="search recipe" />
                    <IoSearchCircleOutline className="search-icon" />
                </div>
            </form>
        </>
    )
}