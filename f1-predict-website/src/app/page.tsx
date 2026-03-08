"use client"

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { player_predicts } from "./player_predicts";
import picks2021 from "../data/swef1_picks_2021.json";
import picks2022 from "../data/swef1_picks_2022.json";
import picks2023 from "../data/swef1_picks_2023.json";
import picks2024 from "../data/swef1_picks_2024.json";
import picks2025 from "../data/swef1_picks_2025.json";

// Static fallback driver list for when API data is incomplete
const staticDriverList = [
  ["Max Verstappen", "Red Bull Racing"],
  ["Lando Norris", "McLaren"],
  ["Oscar Piastri", "McLaren"],
  ["Charles Leclerc", "Ferrari"],
  ["Lewis Hamilton", "Ferrari"],
  ["George Russell", "Mercedes"],
  ["Kimi Antonelli", "Mercedes"],
  ["Fernando Alonso", "Aston Martin"],
  ["Lance Stroll", "Aston Martin"],
  ["Nico Hulkenberg", "Audi"],
  ["Gabriel Bortoleto", "Audi"],
  ["Sergio Perez", "Cadillac"],
  ["Valtteri Bottas", "Cadillac"],
  ["Alexander Albon", "Williams"],
  ["Carlos Sainz", "Williams"],
  ["Pierre Gasly", "Alpine"],
  ["Franco Colapinto", "Alpine"],
  ["Esteban Ocon", "Haas"],
  ["Oliver Bearman", "Haas"],
  ["Liam Lawson", "Racing Bulls (VCARB)"],
  ["Arvid Lindblad", "Racing Bulls (VCARB)"]
];

const staticFormatted = staticDriverList.map((row, idx) => ({
  Driver: { familyName: String(row[0]).split(" ").slice(-1)[0] },
  Constructor: { name: String(row[1]) },
  position: idx + 1,
  points: "0"
}));

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

// Function to normalize driver names for matching
const normalizeName = (name: string) => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// Function to compare player predictions with actual race data
const comparePredictions = (predictions: string[], raceData: Driver[]) => {
  let totalPoints = 0;
  const comparisonResults =  predictions.map((driver, index) => {
    const normalizedDriver = normalizeName(driver);
    const actualDriver = raceData.find(d => normalizeName(d.Driver.familyName) === normalizedDriver);
    const actualPosition = actualDriver ? (isNaN(Number(actualDriver.position)) ? 20 : Number(actualDriver.position)) : 20;
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
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const [raceData, setRaceData] = useState<Driver[]>([]);
  const [usedFallback, setUsedFallback] = useState<boolean>(false);

  useEffect(() => {
    async function fetchRaceResults() {
      const response = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/driverstandings.json`);
      const data = await response.json();
      const standingsLists = data?.MRData?.StandingsTable?.StandingsLists;
      if (Array.isArray(standingsLists) && standingsLists.length > 0) {
        let fetchedData = standingsLists[0].DriverStandings || [];
        // Sort by points descending and assign correct positions
        fetchedData = fetchedData
          .sort((a: Driver, b: Driver) => parseFloat(b.points) - parseFloat(a.points))
          .map((driver: Driver, index: number) => ({ ...driver, position: index + 1 }));
        setRaceData(fetchedData);
        setUsedFallback(false);
      } else {
        console.warn(`No standings available for season ${year}`);
        // If 2026 has no data, use the provided static standings list so the page can render
        if (year === 2026) {
          setRaceData(staticFormatted);
          setUsedFallback(false);
          return;
        }
        console.warn(`attempting previous season ${year - 1}`);
        try {
          const prevResponse = await fetch(`https://api.jolpi.ca/ergast/f1/${year - 1}/driverstandings.json`);
          const prevData = await prevResponse.json();
          const prevLists = prevData?.MRData?.StandingsTable?.StandingsLists;
          if (Array.isArray(prevLists) && prevLists.length > 0) {
            let standings = prevLists[0].DriverStandings || [];
            if (year === currentYear) {
              standings = standings.map((d: any) => ({ ...d, points: "0" }));
            }
            if (year === currentYear) {
              standings = standings.map((d: any) => ({ ...d, points: "0" }));
            }
            // Sort by points descending and assign correct positions
            standings = standings
              .sort((a: Driver, b: Driver) => parseFloat(b.points) - parseFloat(a.points))
              .map((driver: Driver, index: number) => ({ ...driver, position: index + 1 }));
            setRaceData(standings);
            // indicate that we used fallback standings (selected season had no data)
            setUsedFallback(true);
          } else {
            console.warn(`No standings available for previous season ${year - 1}`);
            setRaceData([]);
            setUsedFallback(false);
          }
        } catch (err) {
          console.error('Error fetching previous season standings', err);
          setUsedFallback(false);
        }
      }
    }
    fetchRaceResults();
  }, [year]);

  let antonPredictions = comparePredictions(player_predicts.Anton, raceData);
  let totalAntonPoints = antonPredictions.comparisonResults.reduce((sum, driver) => sum + driver.point, 0);

  let davidPredictions = comparePredictions(player_predicts.David, raceData);
  let totalDavidPoints = davidPredictions.comparisonResults.reduce((sum, driver) => sum + driver.point, 0);

  let swoldPredictions = comparePredictions(player_predicts.Swold, raceData);
  let totalSwoldPoints = swoldPredictions.comparisonResults.reduce((sum, driver) => sum + driver.point, 0);

  let samuelPredictions = comparePredictions(player_predicts.Samuel, raceData);
  let totalSamuelPoints = samuelPredictions.comparisonResults.reduce((sum, driver) => sum + driver.point, 0);

  let hannesPredictions = comparePredictions(player_predicts.Hannes, raceData);
  let totalHannesPoints = hannesPredictions.comparisonResults.reduce((sum, driver) => sum + driver.point, 0);

  let hermanPredictions = comparePredictions(player_predicts.Herman, raceData);
  let totalHermanPoints = hermanPredictions.comparisonResults.reduce((sum, driver) => sum + driver.point, 0);

  let petterPredictions = comparePredictions(player_predicts.Petter, raceData);
  let totalPetterPoints = petterPredictions.comparisonResults.reduce((sum, driver) => sum + driver.point, 0);

  let bet365Predictions = comparePredictions(player_predicts["Betting sidor"], raceData);
  let totalBet365Points = bet365Predictions.comparisonResults.reduce((sum, driver) => sum + driver.point, 0);
  
      // Accordion state for compact mobile design
      const [openPlayers, setOpenPlayers] = useState<Record<string, boolean>>({});
  
      useEffect(() => {
        const init: Record<string, boolean> = {};
        players.forEach(p => { init[p.name] = true; });
        setOpenPlayers(init);
      }, [year]);
  
      const togglePlayer = (name: string) => {
        setOpenPlayers(prev => ({ ...prev, [name]: !prev[name] }));
      };

  // If there is no race data available for the selected season, or we used fallback standings,
  // zero all player points so current-season totals remain 0.
  if (!raceData || raceData.length === 0 || usedFallback) {
    const zeroOut = (p: any) => {
      p.comparisonResults = p.comparisonResults.map((r: any) => ({ ...r, point: 0, actualPosition: null }));
      return p;
    };

    antonPredictions = zeroOut(antonPredictions); totalAntonPoints = 0;
    davidPredictions = zeroOut(davidPredictions); totalDavidPoints = 0;
    swoldPredictions = zeroOut(swoldPredictions); totalSwoldPoints = 0;
    samuelPredictions = zeroOut(samuelPredictions); totalSamuelPoints = 0;
    hannesPredictions = zeroOut(hannesPredictions); totalHannesPoints = 0;
    hermanPredictions = zeroOut(hermanPredictions); totalHermanPoints = 0;
    petterPredictions = zeroOut(petterPredictions); totalPetterPoints = 0;
    bet365Predictions = zeroOut(bet365Predictions); totalBet365Points = 0;
  }

  // If we have a local JSON for the selected year, use its `players` array
  const picksByYear: Record<number, any> = {
    2021: picks2021,
    2022: picks2022,
    2023: picks2023,
    2024: picks2024,
    2025: picks2025
  };

  let players: Array<any> = [];
  const jsonForYear = picksByYear[year];
  if (jsonForYear && Array.isArray(jsonForYear.players)) {
    players = jsonForYear.players.map((p: any) => ({
      name: p.name,
      // normalize to the same structure the UI expects
      predictions: { comparisonResults: p.picks.map((pk: any) => ({ driver: pk.driver, predictedPosition: pk.position, actualPosition: pk.actualPosition ?? null, point: pk.points })) },
      totalPoints: p.total
    }));
  } else {
    players = [
      { name: "Anton", predictions: antonPredictions, totalPoints: totalAntonPoints },
      { name: "David", predictions: davidPredictions, totalPoints: totalDavidPoints },
      { name: "Swold", predictions: swoldPredictions, totalPoints: totalSwoldPoints },
      { name: "Samuel", predictions: samuelPredictions, totalPoints: totalSamuelPoints },
      { name: "Hannes", predictions: hannesPredictions, totalPoints: totalHannesPoints },
      { name: "Herman", predictions: hermanPredictions, totalPoints: totalHermanPoints },
      { name: "Petter", predictions: petterPredictions, totalPoints: totalPetterPoints },
      { name: "Bet365", predictions: bet365Predictions, totalPoints: totalBet365Points }
    ];
  }

  players.sort((a, b) => a.totalPoints - b.totalPoints);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>SweF1</h1>
        <h3>"Sveriges Största F1 Casino"</h3>
        <div style={{margin: '12px 0'}}>
          <strong>Showing season:</strong> {year}
          <div style={{marginTop:8}}>
            {
              // build seasons array with current year first, then older seasons
            }
            {
              (() => {
                const older = [2025, 2024, 2023, 2022, 2021];
                const seasons = [currentYear, ...older.filter(y => y !== currentYear)];
                return (
                  <select value={year} onChange={(e) => setYear(Number(e.target.value))} style={{padding: '6px 8px'}}>
                    {seasons.map(s => (
                      <option key={s} value={s}>{s === currentYear ? `${s} (current)` : s}</option>
                    ))}
                  </select>
                );
              })()
            }
          </div>
        </div>
          <div className={styles.listsContainer}>
            <div className={styles.list}>
                <h2>Standings</h2>
                <ul>
                {raceData.map((driver: Driver) => (
                  <li key={`${driver.position}-${driver.Driver.familyName}`}>
                    {isNaN(Number(driver.position)) ? 20 : Number(driver.position)}.{"\u00A0"}<strong>{driver.Driver.familyName}</strong> <span className={styles.points}>{driver.points}</span>
                  </li>
                ))}
                </ul>
            </div>
            {players.map(player => (
              <div className={styles.list} key={player.name}>
                <h2>{player.name} <span className={styles.totpoints}>{player.totalPoints}</span></h2>
                <ul>
                  {player.predictions.comparisonResults.map((driver: any, index: number) => (
                    <li key={`${player.name}-${driver.driver}-${index}`}>
                      {index + 1}.{"\u00A0"}<strong>{driver.driver}</strong> <span className={styles.points}>{driver.point}</span>
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