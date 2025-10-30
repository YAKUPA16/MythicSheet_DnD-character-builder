import React from "react";
import { useState } from "react";
import { races } from "./data/races";
import { classes } from "./data/classes";
import { backgrounds } from "./data/backgrounds";

function App() {
  const baseAbilities = ["STRENGTH", "DEXTERITY", "CONSTITUTION", "INTELLIGENCE", "WISDOM", "CHARISMA"];
  const savingThrows = ["STRENGTH", "DEXTERITY", "CONSTITUTION", "INTELLIGENCE", "WISDOM", "CHARISMA"];
  const skills = [
    "Acrobatics (DEX)", "Animal Handling (WIS)", "Arcana (INT)", "Athletics (STR)",
    "Deception (CHA)", "History (INT)", "Insight (WIS)", "Intimidation (CHA)",
    "Investigation (INT)", "Medicine (WIS)", "Nature (INT)", "Perception (WIS)",
    "Performance (CHA)", "Persuasion (CHA)", "Religion (INT)", "Sleight of Hand (DEX)",
    "Stealth (DEX)", "Survival (WIS)"
  ];

  // ---- STATE ----
  const [level, setLevel] = useState(1);
  const [proficiencyBonus, setProficiencyBonus] = useState(2);
  const [proficientSkills, setProficientSkills] = useState([]);
  const [proficientSaves, setProficientSaves] = useState([]);
  const [selectedRace, setSelectedRace] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedBackground, setSelectedBackground] = useState("");
  const [characterData, setCharacterData] = useState({
    speed: "",
    profLang: "",
    bonuses: {},
    traits: "",
    equipment: "",
    initiative: 0,
    passivePerception: 10,
    maxHP: 0,
    currentHP: 0
  });

  const [abilities, setAbilities] = useState({
    STRENGTH: 10, DEXTERITY: 10, CONSTITUTION: 10, INTELLIGENCE: 10, WISDOM: 10, CHARISMA: 10
  });

  const hitDice = {
    Barbarian: 12,
    Fighter: 10,
    Paladin: 10,
    Ranger: 10,
    Cleric: 8,
    Druid: 8,
    Rogue: 8,
    Monk: 8,
    Wizard: 6,
    Sorcerer: 6
  };

  // ---- HANDLERS ----
  const handleSkillToggle = (skill) => {
    setProficientSkills((prev) => {
      const updated = prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill];

      // Check if Perception was toggled
      const perceptionProficient = updated.includes("Perception (WIS)");
      const newPassive = calculatePassivePerception(abilities, proficiencyBonus, perceptionProficient);

      setCharacterData((prevData) => ({
        ...prevData,
        passivePerception: newPassive
      }));

      return updated;
    });
  };

  const handleLevelChange = (newLevel) => {
    const lvl = Number(newLevel);
    setLevel(lvl);

    let bonus = 2;
    if (lvl >= 17) bonus = 6;
    else if (lvl >= 13) bonus = 5;
    else if (lvl >= 9) bonus = 4;
    else if (lvl >= 5) bonus = 3;
    
    setProficiencyBonus(bonus);

    const perceptionProficient = proficientSkills.includes("Perception (WIS)");
    const newPassive = calculatePassivePerception(abilities, bonus, perceptionProficient);
    setCharacterData((prev) => ({
      ...prev,
      passivePerception: newPassive
    }));

    const newMax = calculateMaxHP(selectedClass, lvl, abilities.CONSTITUTION);
    setCharacterData(prev => ({
      ...prev,
      maxHP: newMax,
      currentHP: Math.min(prev.currentHP, newMax)
    }));

  };

  const handleRaceChange = (race) => {
    setSelectedRace(race);

    if (races[race]) {
      const { speed, languages, bonuses } = races[race];
      setCharacterData((prev) => ({
        ...prev,
        speed,
        profLang:
          `Languages: ${languages.join(", ")}\n` +
          (prev.profLang || ""),
        bonuses
      }));

      // Apply racial ability bonuses
      setAbilities((prev) => {
        const updated = { ...prev };
        for (const [key, bonus] of Object.entries(bonuses)) {
          updated[key] = prev[key] + bonus;
        }
        return updated;
      });
    }
  };
  
  const handleClassChange = (cls) => {
    setSelectedClass(cls);
    if (classes[cls]) {
      const { proficiencies, tools, savingThrows } = classes[cls];

      const profText = `Proficiencies: ${[...proficiencies, ...tools].join(", ")}\n`;
      setCharacterData((prev) => ({
        ...prev,
        profLang: (prev.profLang || "") + profText
      }));

      setProficientSaves(savingThrows || []);

      const newMax = calculateMaxHP(cls, level, abilities.CONSTITUTION);
      setCharacterData(prev => ({
        ...prev,
        maxHP: newMax,
        currentHP: newMax 
      }));
    }
  };

  const handleBackgroundChange = (bg) => {
    setSelectedBackground(bg);
    if (backgrounds[bg]) {
      const { skills, tools, feature } = backgrounds[bg];
      const bgText = `Skills: ${skills.join(", ")}\nFeature: ${feature}\n`;
      const eqText = `Tools: ${tools.join(", ")}`;
      setCharacterData((prev) => ({
        ...prev,
        traits: (prev.traits || "") + bgText,
        equipment: (prev.equipment || "") + eqText
      }));
    }
  };

  const handleRollStats = () => {
  // Roll for each ability
    const rolled = {
      STRENGTH: rollAbility(),
      DEXTERITY: rollAbility(),
      CONSTITUTION: rollAbility(),
      INTELLIGENCE: rollAbility(),
      WISDOM: rollAbility(),
      CHARISMA: rollAbility()
    };

    // Apply racial bonuses if a race is selected
    if (selectedRace && races[selectedRace]?.bonuses) {
      for (const [key, bonus] of Object.entries(races[selectedRace].bonuses)) {
        rolled[key] += bonus;
      }
    }

    setAbilities(rolled);
    // Update initiative whenever DEX changes
    setCharacterData((prev) => ({
      ...prev,
      initiative: Math.floor((rolled.DEXTERITY - 10) / 2)
    }));

  };

  function rollAbility() {
    const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
    rolls.sort((a, b) => a - b);
    rolls.shift(); // remove the lowest
    return rolls.reduce((sum, val) => sum + val, 0);
  }

  // ---- CALCULATIONS ----
  function calculatePassivePerception(abilities, proficiencyBonus, perceptionProficient) {
    const wisMod = Math.floor((abilities.WISDOM - 10) / 2);
    return 10 + wisMod + (perceptionProficient ? proficiencyBonus : 0);
  }

  function calculateMaxHP(cls, lvl, conScore) {
    if (!cls || !hitDice[cls]) return 0;

    const conMod = Math.floor((conScore - 10) / 2);
    const die = hitDice[cls];

    // first level = full die; later = average
    const avgPerLevel = Math.floor(die / 2) + 1;
    const hp = die + (lvl - 1) * avgPerLevel + conMod * lvl;
    return hp;
  }

  return (
    <div className="sheet-container">
      {/* Header */}
      <header className="header">
        <div>
          <label>Character Name</label>
          <input type="text" />
        </div>
        
        <div>
          <label>Class</label>
          <select value={selectedClass} onChange={(e) => handleClassChange(e.target.value)}>
            <option value="">Select Class</option>
            {Object.keys(classes).map((cls) => (
              <option key={cls}>{cls}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Level</label>
          <input
            type="number"
            min="1"
            max="20"
            value={level}
            onChange={(e) => handleLevelChange(e.target.value)}
          />
        </div>

        <div>
          <label>Race</label>
          <select value={selectedRace} onChange={(e) => handleRaceChange(e.target.value)}>
            <option value="">Select Race</option>
            {Object.keys(races).map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Background</label>
          <select
            value={selectedBackground} onChange={(e) => handleBackgroundChange(e.target.value)}>
            <option value="">Select Background</option>
            {Object.keys(backgrounds).map((bg) => (
              <option key={bg}>{bg}</option>
            ))}
          </select>
        </div>


      </header>

      <main className="main-grid">
        {/* Left Column */}
        <section className="left">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Abilities</h2>
            <button
              onClick={handleRollStats}
              style={{
                background: "#333",
                color: "#eee",
                border: "1px solid #555",
                borderRadius: "5px",
                padding: "0.4rem 0.8rem",
                cursor: "pointer"
              }}
            >
              Roll Stats
            </button>
          </div>
          <div className="abilities-grid">
            {baseAbilities.map((a) => {
              const score = abilities[a];
              const mod = Math.floor((score - 10) / 2);
              return (
                <div className="ability-box" key={a}>
                  <p className="ability-name">{a}</p>
                  <input
                    type="number"
                    min="3"
                    max="20"
                    value={score}
                    onChange={(e) => {
                      const newVal = Number(e.target.value);
                      setAbilities((prev) => ({
                        ...prev,
                        [a]: newVal
                      }));
                      if (a === "DEXTERITY") {
                        setCharacterData((prev) => ({
                          ...prev,
                          initiative: Math.floor((newVal - 10) / 2)
                        }));
                      }
                      if (a === "WISDOM") {
                        const perceptionProficient = proficientSkills.includes("Perception (WIS)");
                        const newPassive = calculatePassivePerception(
                          { ...abilities, WISDOM: newVal },
                          proficiencyBonus,
                          perceptionProficient
                        );
                        setCharacterData((prev) => ({
                          ...prev,
                          passivePerception: newPassive
                        }));
                      }
                      if (a === "CONSTITUTION") {
                        const newMax = calculateMaxHP(selectedClass, level, newVal);
                        setCharacterData(prev => ({
                          ...prev,
                          maxHP: newMax,
                          currentHP: Math.min(prev.currentHP, newMax)
                        }));
                      }
                    }}
                  />
                  <div className="mod-box">
                    {mod >= 0 ? `+${mod}` : mod}
                  </div>
                </div>
              );
            })}
          </div>

          <h2>Saving Throws</h2>
          <ul className="list grid-3">
            {savingThrows.map((s) => (
              <li key={s}>
                <input
                  type="checkbox"
                  checked={proficientSaves.includes(s)}
                  readOnly
                />{" "}
                {s}
              </li>
            ))}
          </ul>

          <h2>Skills</h2>
          <ul className="list grid-3">
            {skills.map((s) => (
              <li key={s}>
                <input
                  type="checkbox"
                  checked={proficientSkills.includes(s)}
                  onChange={() => handleSkillToggle(s)}
                />
                {s}
              </li>
            ))}
          </ul>

        </section>
        {/* Right Column */}
        <section className="right">
          <h2>Combat Info</h2>
          <div className="grid-5">
            <div>
              <label>Armor<br/>Class</label>
              <input type="number" />
            </div>
            <div>
              <label><br/>Initiative</label>
              <input type="number" value={characterData.initiative} readOnly />
            </div>
            <div>
              <label><br/>Speed</label>
              <input type="number" value={characterData.speed} readOnly />
            </div>
            <div>
              <label>Proficiency Bonus</label>
              <input type="text" value={`+${proficiencyBonus}`} readOnly />
            </div>
            <div>
              <label>Passive Perception</label>
              <input type="number" value={characterData.passivePerception} readOnly />
            </div>
          </div>

          <div className="grid-2">
            <div>
              <label>Current HP</label>
              <input
                type="number"
                min="0"
                max={characterData.maxHP}
                value={characterData.currentHP}
                onChange={(e) =>
                  setCharacterData((prev) => ({
                    ...prev,
                    currentHP: Number(e.target.value)
                  }))
                }
              />
            </div>
            <div>
              <label>Max HP</label>
              <input type="number" value={characterData.maxHP} readOnly />
            </div>
          </div>

          <h2>Proficiencies & Languages</h2>
          <textarea
            rows="4"
            value={characterData.profLang} readOnly
          />

          <h2>Features & Traits</h2>
          <textarea
            rows="5"
            value={characterData.traits} readOnly
          />

          <h2>Equipment</h2>
          <textarea
            rows="4"
            value={characterData.equipment} readOnly
          />
        </section>
      </main>
    </div>
  );
}

export default App;

