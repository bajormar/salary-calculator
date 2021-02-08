import React, { useMemo, useState } from "react";
import "./App.css";

export const times = (count: number) => Array.from(Array(count).keys());

enum Role {
  Developer = "DEV",
  ProjectManager = "PM",
}
function App() {
  const [role, setRole] = useState(Role.Developer);

  const [devSkills, setDevSkills] = useState([
    { name: "Autonomy", weight: 0.1 },
    { name: "Delivery", weight: 0.3 },
    { name: "Growth", weight: 0.2 },
    { name: "Job knowledge", weight: 0.2 },
    { name: "Soft skills", weight: 0.2 },
  ]);

  const [pmSkills, setPmSkills] = useState([
    { name: "Capabilities", weight: 0.2 },
    { name: "Quality of work", weight: 0.2 },
    { name: "Communication", weight: 0.2 },
    { name: "Autonomy", weight: 0.2 },
    { name: "Job Knowledge / Growth / Initiative", weight: 0.2 },
  ]);

  const [teamLeadSkills, setTeamLeadSkills] = useState([
    { name: "Hiring", weight: 0.2 },
    { name: "TechLead", weight: 0.2 },
    { name: "Team management", weight: 0.2 },
    { name: "Soft skills", weight: 0.2 },
    { name: "Mentoring", weight: 0.2 },
  ]);

  const [devLevels, setDevLevels] = useState([
    { name: "JUNIOR_1", low: 1150 },
    { name: "JUNIOR_2", low: 1150, high: 1510 },
    { name: "DEV_1", low: 1510, high: 2000 },
    { name: "DEV_2", low: 2000, high: 2400 },
    { name: "SENIOR_1", low: 2400, high: 2800 },
    { name: "SENIOR_2", low: 2800, high: 3400 },
  ]);

  const [teamLeadLevels, setTeamLeadLevels] = useState([
    { name: "LEAD_1", low: 500 },
    { name: "LEAD_2", low: 500, high: 1000 },
  ]);

  const [pmLevels, setPmLevels] = useState([
    { name: "JUNIOR_1", low: 700 },
    { name: "JUNIOR_2", low: 700, high: 1149 },
    { name: "PM_1", low: 1149, high: 1577 },
    { name: "PM_2", low: 1577, high: 2359 },
    { name: "SENIOR_1", low: 2359, high: 2878 },
    { name: "SENIOR_2", low: 2878, high: 3397 },
  ]);

  const [isTeamLead, setIsTeamLead] = useState(false);

  const [selected, setSelected] = useState([0, 0, 0, 0, 0]);
  const [teamLeadSelected, setTeamLeadSelected] = useState([0, 0, 0, 0, 0]);

  const skills = role === Role.Developer ? devSkills : pmSkills;
  const levels = role === Role.Developer ? devLevels : pmLevels;
  const setSkills = role === Role.Developer ? setDevSkills : setPmSkills;
  const setLevels = role === Role.Developer ? setDevLevels : setPmLevels;

  const cellValues = useMemo(() => {
    const totalWeight = skills.reduce((acc, skill) => acc + skill.weight, 0);
    const junior1Values = skills.map((skill) => {
      return Math.floor((levels[0].low / totalWeight) * skill.weight);
    });

    return [
      junior1Values,
      ...levels.slice(1).map((level) => {
        const range = level.high! - level.low;
        return skills.map((skill) => {
          return Math.floor((range / totalWeight) * skill.weight);
        });
      }),
    ];
  }, [skills, levels]);

  const teamLeadCellValues = useMemo(() => {
    const totalWeight = teamLeadSkills.reduce(
      (acc, skill) => acc + skill.weight,
      0
    );
    const lead11Values = teamLeadSkills.map((skill) => {
      return Math.floor((teamLeadLevels[0].low / totalWeight) * skill.weight);
    });

    return [
      lead11Values,
      ...teamLeadLevels.slice(1).map((level) => {
        const range = level.high! - level.low;
        return teamLeadSkills.map((skill) => {
          return Math.floor((range / totalWeight) * skill.weight);
        });
      }),
    ];
  }, [teamLeadLevels, teamLeadSkills]);

  const salary = useMemo(() => {
    return selected.reduce((acc, columnSelectedLevel, index) => {
      const columnSum = times(columnSelectedLevel + 1).reduce(
        (columnAcc, levelIndex) => {
          return columnAcc + cellValues[levelIndex][index];
        },
        0
      );

      return acc + columnSum;
    }, 0);
  }, [cellValues, selected]);

  const teamLeadSalary = useMemo(() => {
    return teamLeadSelected.reduce((acc, columnSelectedLevel, index) => {
      const columnSum = times(columnSelectedLevel + 1).reduce(
        (columnAcc, levelIndex) => {
          return columnAcc + teamLeadCellValues[levelIndex][index];
        },
        0
      );

      return acc + columnSum;
    }, 0);
  }, [teamLeadCellValues, teamLeadSelected]);

  const totalSalary = salary + teamLeadSalary;

  const getSalaryRanges = (sal: number) => {
    return `${sal - sal * 0.1} - ${sal + sal * 0.1}`;
  };

  return (
    <div className="App">
      <div className="Settings-Row">
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

        {role === Role.Developer && (
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
        )}
      </div>
      <div className="Row">
        <table>
          <thead>
            <tr>
              <th>Skills</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => (
              <tr key={skill.name}>
                <td>{skill.name}</td>
                <td>
                  <input
                    type="text"
                    defaultValue={skill.weight}
                    onChange={(e) => {
                      setSkills((prevState) => {
                        const newState = [...prevState];
                        const skillToEdit = newState.find(
                          (item) => item.name === skill.name
                        );
                        skillToEdit!.weight = Number(e.target.value || 0) || 0;
                        return newState;
                      });
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {role === Role.Developer && isTeamLead && (
          <table>
            <thead>
              <tr>
                <th>Team lead skills</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              {teamLeadSkills.map((skill) => (
                <tr key={skill.name}>
                  <td>{skill.name}</td>
                  <td>
                    <input
                      type="text"
                      defaultValue={skill.weight}
                      onChange={(e) => {
                        setTeamLeadSkills((prevState) => {
                          const newState = [...prevState];
                          const skillToEdit = newState.find(
                            (item) => item.name === skill.name
                          );
                          skillToEdit!.weight =
                            Number(e.target.value || 0) || 0;
                          return newState;
                        });
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="Row">
        <table>
          <thead>
            <tr>
              <th>Level</th>
              {skills.map((skill) => (
                <th key={skill.name}>{skill.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {levels.map((level, levelIndex) => (
              <tr key={level.name}>
                <td>{level.name}</td>
                {skills.map((skill, skillIndex) => (
                  <td
                    key={skill.name}
                    style={
                      levelIndex <= selected[skillIndex]
                        ? { background: "lightblue" }
                        : {}
                    }
                    onClick={() =>
                      setSelected((prevState) => {
                        const newState = [...prevState];
                        newState[skillIndex] = levelIndex;
                        return newState;
                      })
                    }
                  >
                    {cellValues[levelIndex][skillIndex]}
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
      {role === Role.Developer && isTeamLead && (
        <>
          <div className="Row">
            <table>
              <thead>
                <tr>
                  <th></th>
                  {teamLeadSkills.map((skill) => (
                    <th key={skill.name}>{skill.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teamLeadLevels.map((level, levelIndex) => (
                  <tr key={level.name}>
                    <td>{level.name}</td>
                    {teamLeadSkills.map((skill, skillIndex) => (
                      <td
                        key={skill.name}
                        style={
                          levelIndex <= teamLeadSelected[skillIndex]
                            ? { background: "lightblue" }
                            : {}
                        }
                        onClick={() =>
                          setTeamLeadSelected((prevState) => {
                            const newState = [...prevState];
                            newState[skillIndex] = levelIndex;
                            return newState;
                          })
                        }
                      >
                        {teamLeadCellValues[levelIndex][skillIndex]}
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
            <div>Team lead salary: {getSalaryRanges(teamLeadSalary)} EUR</div>
          </div>
          <div className="Row">
            <div />
            <div />
            <div>Total salary: {getSalaryRanges(totalSalary)} EUR</div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
