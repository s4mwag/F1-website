"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { player_predicts } from "./player_predicts";

// Define the interface for the race data
interface Driver {
  Driver: {
    familyName: string;
  };
  Constructor: {
    name: string;
  };
  position: number;
  points: string;
}

// Function to compare player predictions with actual race data
const comparePredictions = (predictions: string[], raceData: Driver[]) => {
  let totalPoints = 0;
  const comparisonResults =  predictions.map((driver, index) => {
    const actualDriver = raceData.find(d => d.Driver.familyName === driver);
    const actualPosition = actualDriver ? (isNaN(actualDriver.position) ? 20 : actualDriver.position) : 20;
    const point = Math.abs(actualPosition - (index + 1));
    totalPoints += point;
    return {
      driver,
      predictedPosition: index + 1,
      actualPosition,
      point
    };
  });
  return {comparisonResults, totalPoints};
};


export default function Home() {
  const [raceData, setRaceData] = useState<Driver[]>([]);

  useEffect(() => {
    async function fetchRaceResults() {
      const response = await fetch("https://api.jolpi.ca/ergast/f1/2025/driverstandings.json");
      const data = await response.json();
      // console.log("API Response:", data); // Log the API response
      setRaceData(data.MRData.StandingsTable.StandingsLists[0].DriverStandings);
    }
    fetchRaceResults();
  }, []);

  const antonPredictions = comparePredictions(player_predicts.Anton, raceData);
  const totalAntonPoints = antonPredictions.comparisonResults.reduce((sum, driver) => sum + driver.point, 0);

  const davidPredictions = comparePredictions(player_predicts.David, raceData);
  const totalDavidPoints = davidPredictions.comparisonResults.reduce((sum, driver) => sum + driver.point, 0);

  const swoldPredictions = comparePredictions(player_predicts.Swold, raceData);
  const totalSwoldPoints = swoldPredictions.comparisonResults.reduce((sum, driver) => sum + driver.point, 0);

  const samuelPredictions = comparePredictions(player_predicts.Samuel, raceData);
  const totalSamuelPoints = samuelPredictions.comparisonResults.reduce((sum, driver) => sum + driver.point, 0);

  const hannesPredictions = comparePredictions(player_predicts.Hannes, raceData);
  const totalHannesPoints = hannesPredictions.comparisonResults.reduce((sum, driver) => sum + driver.point, 0);

  const hermanPredictions = comparePredictions(player_predicts.Herman, raceData);
  const totalHermanPoints = hermanPredictions.comparisonResults.reduce((sum, driver) => sum + driver.point, 0);

  const petterPredictions = comparePredictions(player_predicts.Petter, raceData);
  const totalPetterPoints = petterPredictions.comparisonResults.reduce((sum, driver) => sum + driver.point, 0);

  const bet365Predictions = comparePredictions(player_predicts["Betting sidor"], raceData);
  const totalBet365Points = bet365Predictions.comparisonResults.reduce((sum, driver) => sum + driver.point, 0);

  const players = [
    { name: "Anton", predictions: antonPredictions, totalPoints: totalAntonPoints },
    { name: "David", predictions: davidPredictions, totalPoints: totalDavidPoints },
    { name: "Swold", predictions: swoldPredictions, totalPoints: totalSwoldPoints },
    { name: "Samuel", predictions: samuelPredictions, totalPoints: totalSamuelPoints },
    { name: "Hannes", predictions: hannesPredictions, totalPoints: totalHannesPoints },
    { name: "Herman", predictions: hermanPredictions, totalPoints: totalHermanPoints },
    { name: "Petter", predictions: petterPredictions, totalPoints: totalPetterPoints },
    { name: "Bet365", predictions: bet365Predictions, totalPoints: totalBet365Points }
  ];
  
  players.sort((a, b) => a.totalPoints - b.totalPoints);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>SweF1</h1>
        <h3>"Sveriges Största F1 Casino"</h3>
          <div className={styles.listsContainer}>
            <div className={styles.list}>
                <h2>Standings</h2>
                <ul>
                  {raceData.map((driver: Driver) => (
                    <li key={driver.position}>
                      {isNaN(driver.position) ? 20 : driver.position}. <strong>{driver.Driver.familyName}</strong> <span className={styles.points}>{driver.points}</span>
                    </li>
                  ))}
                </ul>
            </div>
            {players.map(player => (
            <div className={styles.list} key={player.name}>
              <h2>{player.name} <span className={styles.totpoints}>{player.totalPoints}</span></h2>
              <ul>
                {player.predictions.comparisonResults.map((driver, index) => (
                  <li key={`${player.name}-${index}`}>
                    {index + 1}. <strong>{driver.driver}</strong> <span className={styles.points}>{driver.point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </main>

    </div>
  );
}
 

// <div className={styles.list}>
// <h2>Anton <span className={styles.totpoints}>{totalAntonPoints}</span></h2>
// <ul>
// {antonPredictions.comparisonResults.map((driver, index) => (
//       <li key={index}>
//         {index+1}. <strong>{driver.driver}</strong> <span className={styles.points}>{driver.point}</span>
//       </li>
//   ))}
// </ul>
// </div>

// <div className={styles.list}>
// <h2>David <span className={styles.totpoints}>{totalDavidPoints}</span></h2>
// <ul>
// {davidPredictions.comparisonResults.map((driver, index) => (
//       <li key={index}>
//         {index+1}. <strong>{driver.driver}</strong> <span className={styles.points}>{driver.point}</span>
//       </li>
//   ))}
// </ul>
// </div>

// <div className={styles.list}>
// <h2>Swold <span className={styles.totpoints}>{totalSwoldPoints}</span></h2>
// <ul>
// {swoldPredictions.comparisonResults.map((driver, index) => (
//       <li key={index}>
//         {index+1}. <strong>{driver.driver}</strong> <span className={styles.points}>{driver.point}</span>
//       </li>
//   ))}
// </ul>
// </div>

// <div className={styles.list}>
// <h2>Samuel <span className={styles.totpoints}>{totalSamuelPoints}</span></h2>
// <ul>
// {samuelPredictions.comparisonResults.map((driver, index) => (
//       <li key={index}>
//         {index+1}. <strong>{driver.driver}</strong> <span className={styles.points}>{driver.point}</span>
//       </li>
//   ))}
// </ul>
// </div>


// <div className={styles.list}>
// <h2>Hannes <span className={styles.totpoints}>{totalHannesPoints}</span></h2>
// <ul>
// {hannesPredictions.comparisonResults.map((driver, index) => (
//       <li key={index}>
//         {index+1}. <strong>{driver.driver}</strong> <span className={styles.points}>{driver.point}</span>
//       </li>
//   ))}
// </ul>
// </div>

// <div className={styles.list}>
// <h2>Herman <span className={styles.totpoints}>{totalHermanPoints}</span></h2>
// <ul>
// {hermanPredictions.comparisonResults.map((driver, index) => (
//       <li key={index}>
//         {index+1}. <strong>{driver.driver}</strong> <span className={styles.points}>{driver.point}</span>
//       </li>
//   ))}
// </ul>
// </div>

// <div className={styles.list}>
// <h2>Petter <span className={styles.totpoints}>{totalPetterPoints}</span></h2>
// <ul>
// {petterPredictions.comparisonResults.map((driver, index) => (
//       <li key={index}>
//         {index+1}. <strong>{driver.driver}</strong> <span className={styles.points}>{driver.point}</span>
//       </li>
//   ))}
// </ul>
// </div>

// <div className={styles.list}>
// <h2>Bet365 <span className={styles.totpoints}>{totalBet365Points}</span></h2>
// <ul>
// {bet365Predictions.comparisonResults.map((driver, index) => (
//       <li key={index}>
//         {index+1}. <strong>{driver.driver}</strong> <span className={styles.points}>{driver.point}</span>
//       </li>
//   ))}
// </ul>
// </div>
// </div>