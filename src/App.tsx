import React, { useMemo, useState } from "react";
import "./App.css";

const cells = [
  "Autonomy",
  "Delivery",
  "Growth",
  "Job knowledge",
  "Soft skills",
];

export const times = (count: number) => Array.from(Array(count).keys());

function App() {
  const [levels] = useState([
    { name: "JUNIOR_1", low: 1000 },
    { name: "JUNIOR_2", low: 1000, high: 1500 },
    { name: "DEV_1", low: 1500, high: 1850 },
    { name: "DEV_2", low: 1850, high: 2200 },
    { name: "SENIOR_1", low: 2200, high: 2800 },
    { name: "SENIOR_2", low: 2800, high: 3400 },
  ]);

  const [selected, setSelected] = useState([0, 0, 0, 0, 0]);

  const cellValues = useMemo(() => {
    const junior1Values = [
      Math.floor(levels[0].low / cells.length),
      Math.floor(levels[0].low / cells.length),
      Math.floor(levels[0].low / cells.length),
      Math.floor(levels[0].low / cells.length),
      Math.floor(levels[0].low / cells.length),
    ];

    return [
      junior1Values,
      ...levels.slice(1).map((level) => {
        const range = level.high! - level.low;
        const value = Math.floor(range / cells.length);
        return times(cells.length + 1).map(() => value);
      }),
    ];
  }, [levels]);

  const salary = useMemo(() => {
    return selected.reduce((acc, cur, index) => {
      const z = times(cur + 1);
      return (
        acc +
        z.reduce((x, y) => {
          return x + cellValues[y][index];
        }, 0)
      );
    }, 0);
  }, [cellValues, selected]);

  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            <th>Level</th>
            {cells.map((cell) => (
              <th key={cell}>{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {levels.map((level, levelIndex) => (
            <tr key={level.name}>
              <td>{level.name}</td>
              {cells.map((cell, cellIndex) => (
                <td
                  key={cell}
                  style={
                    levelIndex <= selected[cellIndex]
                      ? { background: "lightblue" }
                      : {}
                  }
                  onClick={() =>
                    setSelected((prevState) => {
                      const newState = [...prevState];
                      newState[cellIndex] = levelIndex;
                      return newState;
                    })
                  }
                >
                  {cellValues[levelIndex][cellIndex]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div>Salary: {salary} EUR</div>
    </div>
  );
}

export default App;
