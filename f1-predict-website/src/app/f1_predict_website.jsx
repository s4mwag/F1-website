import { useState, useEffect } from "react";

export default function Home() {
  const [raceData, setRaceData] = useState(null);

  useEffect(() => {
    async function fetchRaceResults() {
      const response = await fetch("http://ergast.com/api/f1/current/last/results.json");
      const data = await response.json();
      setRaceData(data.MRData.RaceTable.Races[0]); 
    }
    fetchRaceResults();
  }, []);

// test

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>🏎️ Formula 1 Latest Race Results 🏁</h1>
      {raceData ? (
        <div>
          <h2>{raceData.raceName} - {raceData.Circuit.circuitName}</h2>
          <h3>{raceData.date}</h3>
          <ul>
            {raceData.Results.map((driver, index) => (
              <li key={index}>
                <strong>{driver.Driver.familyName}</strong> ({driver.Constructor.name}) - Position: {driver.position}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading race results...</p>
      )}
    </div>
  );
}