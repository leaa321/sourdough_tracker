import { useState } from "react";
import "../style/TagFilter.scss"
import { IoFilterCircleOutline } from "react-icons/io5";

export type TagProps = {
    tags: string[];
    onSelectTag: (tag: string) => void;
}

export function TagFilter({ tags, onSelectTag }: TagProps) {
    const [isOpen, setIsOpen] = useState(false);

    function toggleSelect() {
        if (isOpen) setIsOpen(false)
        else setIsOpen(true);
    }

    return (
        <>
            <div className="input-section" >
                <h3 onClick={toggleSelect}><IoFilterCircleOutline className="icon-filter" /></h3>
                {isOpen && <ul>
                    <li key="null" onClick={() => {
                        onSelectTag("All")
                        toggleSelect()
                    }}>All</li>
                    {tags.map((tag) => (
                        <li key={tag} onClick={() => {
                            onSelectTag(tag)
                            toggleSelect()
                        }
                        }>{tag}</li>
                    ))
                    }
                </ul>}
            </div>
        </>
    )
}