import { useEffect, useMemo, useState } from "react";
import "../style/PastryPage.scss"
import type { pastry } from "../types/pastry";
import { getAllPastryTags, getPastries } from "../service/PastryService";
import { TagFilter } from "../components/TagFilter";
import { PastryList } from "../components/PastryList";

export type pastryGroupTag = {
    pastries: pastry[],
    tag: string
}

export function PastryPage() {
    const [pastries, setPastries] = useState<pastry[]>([]);
    const [tags, setTags] = useState<string[]>();
    const [selectedTag, setSelectedTag] = useState<string>("All");

    useEffect(() => {
        getPastries().then(setPastries).catch(console.error);
    }, []);

    useEffect(() => {
        getAllPastryTags().then(setTags).catch(console.error);
    }, [])

    function handleSelect(tag: string) {
        setSelectedTag(tag);
    }

    const filteredPastries = useMemo(() => {
        if (selectedTag === "All") return pastries;

        return pastries.filter((pastry) => pastry.tag === selectedTag);
    }, [pastries, selectedTag]);

    const pastryGroup = useMemo<pastryGroupTag[]>(() => {
        const groups: Record<string, pastry[]> = {};

        filteredPastries.forEach((pastry) => {
            const tag = pastry.tag ?? "No tag";

            if (!groups[tag]) {
                groups[tag] = [];
            }

            groups[tag].push(pastry);
        });

        return Object.entries(groups).map(([tag, pastries]) => ({
            tag,
            pastries,
        }));
    }, [filteredPastries]);

    return (
        <>
            <div className="top-section">
                <h2>Everything I baked</h2>
                <p>All the good and bad stuff I've baked</p>
            </div>
            <div className="filter-section">
                {tags && <TagFilter tags={tags} onSelectTag={handleSelect} />}
            </div>
            <h4>{selectedTag}</h4>
            {pastryGroup.map((group) => (
                <PastryList pastries={group.pastries} />
            ))}
        </>)
}