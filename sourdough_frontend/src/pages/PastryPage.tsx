import { PastryList } from "../components/PastryList";
import "../style/PastryPage.scss"

export function PastryPage() {
    return (
        <>
            <div className="top-section">

                <h2>Everything I baked</h2>
                <p>All the good and bad stuff I've baked</p>
            </div>

            <PastryList></PastryList>
        </>)
}