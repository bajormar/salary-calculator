import React, { useMemo, useState } from "react";
import "./App.css";

const devCells = [
  "Autonomy",
  "Delivery",
  "Growth",
  "Job knowledge",
  "Soft skills",
];

const pmCells = [
  "Capabilities",
  "Quality of work",
  "Communication",
  "Autonomy",
  "Job Knowledge / Growth / Initiative",
];

const teamLeadCells = [
  "Hiring",
  "TechLead",
  "Team management",
  "Soft skills",
  "Mentoring",
];

export const times = (count: number) => Array.from(Array(count).keys());

enum Role {
  Developer = "DEV",
  ProjectManager = "PM",
}
function App() {
  const [role, setRole] = useState(Role.Developer);

  const [devLevels, setDevLevels] = useState([
    { name: "JUNIOR_1", low: 1000 },
    { name: "JUNIOR_2", low: 1000, high: 1500 },
    { name: "DEV_1", low: 1500, high: 1850 },
    { name: "DEV_2", low: 1850, high: 2200 },
    { name: "SENIOR_1", low: 2200, high: 2800 },
    { name: "SENIOR_2", low: 2800, high: 3400 },
  ]);

  const [teamLeadLevels, setTeamLeadLevels] = useState([
    { name: "LEAD_1", low: 500 },
    { name: "LEAD_2", low: 500, high: 1000 },
  ]);

  const [pmLevels, setPmLevels] = useState([
    { name: "JUNIOR_1", low: 1149 },
    { name: "JUNIOR_2", low: 1149, high: 1573 },
    { name: "PM_1", low: 1573, high: 1766 },
    { name: "PM_2", low: 1766, high: 2359 },
    { name: "SENIOR_1", low: 2359, high: 2878 },
    { name: "SENIOR_2", low: 2878, high: 3397 },
  ]);

  const [isTeamLead, setIsTeamLead] = useState(false);

  const [selected, setSelected] = useState([0, 0, 0, 0, 0]);
  const [teamLeadSelected, setTeamLeadSelected] = useState([0, 0, 0, 0, 0]);

  const cells = role === Role.Developer ? devCells : pmCells;
  const levels = role === Role.Developer ? devLevels : pmLevels;
  const setLevels = role === Role.Developer ? setDevLevels : setPmLevels;

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
  }, [cells, levels]);

  const teamLeadCellValues = useMemo(() => {
    const lead11Values = [
      Math.floor(teamLeadLevels[0].low / teamLeadCells.length),
      Math.floor(teamLeadLevels[0].low / teamLeadCells.length),
      Math.floor(teamLeadLevels[0].low / teamLeadCells.length),
      Math.floor(teamLeadLevels[0].low / teamLeadCells.length),
      Math.floor(teamLeadLevels[0].low / teamLeadCells.length),
    ];

    return [
      lead11Values,
      ...teamLeadLevels.slice(1).map((level) => {
        const range = level.high! - level.low;
        const value = Math.floor(range / teamLeadCells.length);
        return times(teamLeadCells.length + 1).map(() => value);
      }),
    ];
  }, [teamLeadLevels]);

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

  const teamLeadSalary = useMemo(() => {
    return teamLeadSelected.reduce((acc, cur, index) => {
      const z = times(cur + 1);
      return (
        acc +
        z.reduce((x, y) => {
          return x + teamLeadCellValues[y][index];
        }, 0)
      );
    }, 0);
  }, [teamLeadCellValues, teamLeadSelected]);

  const totalSalary = salary + teamLeadSalary;

  const getSalaryRanges = (sal: number) => {
    return `${sal - sal * 0.1} - ${sal + sal * 0.1}`;
  };

  return (
    <div className="App">
      <div>
        <h2>Choose role</h2>
        <button
          type="button"
          className={`RoleButton ${
            role === Role.Developer ? "RoleButton-active" : ""
          }`}
          onClick={() => setRole(Role.Developer)}
        >
          Developer
        </button>
        <button
          type="button"
          className={`RoleButton ${
            role === Role.ProjectManager ? "RoleButton-active" : ""
          }`}
          onClick={() => setRole(Role.ProjectManager)}
        >
          Project manager
        </button>
      </div>
      <div className="Row">
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
        <table>
          <thead>
            <tr>
              <th>Level</th>
              <th>Low</th>
              <th>High</th>
            </tr>
          </thead>
          <tbody>
            {levels.map((level) => {
              return (
                <tr key={level.name}>
                  <td>
                    {level.name === "JUNIOR_1"
                      ? `${level.name} (Base)`
                      : level.name}
                  </td>
                  <td>
                    <input
                      type="text"
                      value={level.low}
                      onChange={(e) => {
                        setLevels((prevState) => {
                          const newState = [...prevState];
                          const levelToEdit = newState.find(
                            (l) => l.name === level.name
                          );
                          levelToEdit!.low = Number(e.target.value || 0) || 0;
                          return newState;
                        });
                      }}
                    />
                  </td>
                  <td>
                    {level.name !== "JUNIOR_1" && (
                      <input
                        type="text"
                        value={level.high}
                        onChange={(e) => {
                          setLevels((prevState) => {
                            const newState = [...prevState];
                            const levelToEdit = newState.find(
                              (l) => l.name === level.name
                            );
                            levelToEdit!.high =
                              Number(e.target.value || 0) || 0;
                            return newState;
                          });
                        }}
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div>Salary: {getSalaryRanges(salary)} EUR</div>
      </div>
      {role === Role.Developer && (
        <>
          <div className="Row">
            <div>
              <div>Is team lead?</div>
              <input
                type="checkbox"
                checked={isTeamLead}
                onChange={(e) => {
                  setIsTeamLead(!isTeamLead);
                }}
              />
            </div>
          </div>
          {isTeamLead && (
            <>
              <div className="Row">
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      {teamLeadCells.map((cell) => (
                        <th key={cell}>{cell}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {teamLeadLevels.map((level, levelIndex) => (
                      <tr key={level.name}>
                        <td>{level.name}</td>
                        {teamLeadCells.map((cell, cellIndex) => (
                          <td
                            key={cell}
                            style={
                              levelIndex <= teamLeadSelected[cellIndex]
                                ? { background: "lightblue" }
                                : {}
                            }
                            onClick={() =>
                              setTeamLeadSelected((prevState) => {
                                const newState = [...prevState];
                                newState[cellIndex] = levelIndex;
                                return newState;
                              })
                            }
                          >
                            {teamLeadCellValues[levelIndex][cellIndex]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <table>
                  <thead>
                    <tr>
                      <th>Level</th>
                      <th>Low</th>
                      <th>High</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamLeadLevels.map((level) => {
                      return (
                        <tr key={level.name}>
                          <td>
                            {level.name === "LEAD_1"
                              ? `${level.name} (Base)`
                              : level.name}
                          </td>
                          <td>
                            <input
                              type="text"
                              value={level.low}
                              onChange={(e) => {
                                setTeamLeadLevels((prevState) => {
                                  const newState = [...prevState];
                                  const levelToEdit = newState.find(
                                    (l) => l.name === level.name
                                  );
                                  levelToEdit!.low =
                                    Number(e.target.value || 0) || 0;
                                  return newState;
                                });
                              }}
                            />
                          </td>
                          <td>
                            {level.name !== "LEAD_1" && (
                              <input
                                type="text"
                                value={level.high}
                                onChange={(e) => {
                                  setTeamLeadLevels((prevState) => {
                                    const newState = [...prevState];
                                    const levelToEdit = newState.find(
                                      (l) => l.name === level.name
                                    );
                                    levelToEdit!.high =
                                      Number(e.target.value || 0) || 0;
                                    return newState;
                                  });
                                }}
                              />
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div>
                  Team lead salary: {getSalaryRanges(teamLeadSalary)} EUR
                </div>
              </div>
              <div className="Row">
                <div />
                <div />
                <div>Total salary: {getSalaryRanges(totalSalary)} EUR</div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
