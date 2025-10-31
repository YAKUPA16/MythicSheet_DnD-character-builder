# MythicSheet – D&D 5E Character Builder

MythicSheet is a lightweight **React-based Dungeons & Dragons 5e character builder** that automates many of the manual steps in traditional character creation.  
It’s designed for quick, intuitive use — perfect for both new players learning the rules and experienced players who want to skip the math.

---

## ✨ Features

### 🧙‍♂️ Race, Class & Background
- **Race Selection** automatically sets speed, languages, and racial bonuses.  
- **Class Selection** grants tool and saving throw proficiencies.  
- **Background Selection** adds skills, tools, and unique character features.

### 💪 Abilities & Modifiers
- Roll ability scores with **4d6 drop lowest** logic.  
- Automatic **racial bonus** application to relevant abilities.  
- **Live-updating modifiers** displayed next to each stat.

### ⚔️ Combat & Skills
- **Initiative** auto-calculated from Dexterity.  
- **Saving Throws** auto-marked based on class.  
- **Skills** include proficiency toggles that dynamically update Passive Perception.

### ❤️ Hit Points
- **Max HP** calculated using class hit die, Constitution modifier, and level.  
- **Current HP** adjustable, capped by calculated maximum.

### 🧠 Passive Perception
- Auto-updated using Wisdom modifier, Proficiency Bonus, and skill proficiency.

---

## 🧩 Tech Stack

| Tool | Purpose |
|------|----------|
| **React + Vite** | Front-end framework & dev environment |
| **JavaScript (ES6)** | Core logic and UI reactivity |
| **HTML5 / CSS3** | Layout and styling |
| **Node.js (NPM)** | Dependency management |

No external UI libraries or databases used — fully front-end and standalone.

---

## 🚀 Running the Project

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mythicsheet.git
   cd mythicsheet

2. Install dependencies:
   ```bash
   npm install

3. Run the server:
   ```bash
   npm run dev

---
### 📸 Preview
<img width="1365" height="632" alt="Screenshot 2025-10-31 040347" src="https://github.com/user-attachments/assets/b59a4e01-1c60-4aa3-bb51-5d1100722d20" />

---
  
### 🎯 Future Improvements
- Add class features and spell management.
- Include export to PDF option for printable character sheets.
- Visual dice animation for rolls.
- Optional light/dark theme toggle.
