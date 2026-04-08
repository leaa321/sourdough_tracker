import "../style/Home.scss";
import gollum from "../assets/gollum.png";
import { useEffect, useState } from "react";
import { RecentPastriesList } from "../components/RecentPastriesList";

function Home() {
  const [timeMinutes, setTimeMinutes] = useState<number>(0);
  const [timeSeconds, setTimeSeconds] = useState<number>(0);

  useEffect(() => {
    displayTime();
  })

  const calcMinsPassed = (startDate: number, now: number) => Math.trunc(Math.abs((now - startDate) / (1000 * 60)) - 1);
  const calcSecsPassed = (startDate: number, now: number) => Math.trunc((now - startDate) / 1000);

  function displayTime() {
    let startDate = new Date(2026, 0, 27).getTime();
    let now = Date.now();
    let minutesPassed = calcMinsPassed(startDate, now)
    let secondsPassed = calcSecsPassed(startDate, now);
    setTimeMinutes(minutesPassed);
    setTimeSeconds(secondsPassed);
    refreshTime();
  }

  function refreshTime() {
    setTimeout(displayTime, 1000);
  }

  return (
    <>
      <main>

        <div className="card greeting">
          <h2>My sourdough tracker :)</h2>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repudiandae esse deleniti reprehenderit nemo? Cum quam ut dolores, nesciunt non eligendi veniam tempore similique explicabo suscipit obcaecati, natus dolorem omnis et!</p>
        </div>
        <div className="card gollum">
          <h2>Gollum</h2>
          <img src={gollum} alt="picture of my sourdough starter" />
          <div className="timer">
            <span className="timer-title">
              My time alive:
            </span>
            <span>
              {timeMinutes} minutes or {timeSeconds} </span>
          </div>
        </div>
        <div className="card-grid">
          <h2>Recent pastries</h2>
          <RecentPastriesList></RecentPastriesList>
          {/* hier 3 mini card nur bild der 3 neusten dinge in loafes */}
        </div>
      </main>
    </>
  );
}

export default Home;
