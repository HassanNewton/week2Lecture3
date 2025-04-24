// main.js
import User from "./user.js"; // Importera User-klassen

// 🔁 Hjälpfunktion: Lägg till användare i HTML-listan
function addUserToList(user) {
  const li = document.createElement("li");
  li.textContent = user.displayInfo();

  // ❌ Radera-knapp
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.style.marginLeft = "10px";
  deleteBtn.onclick = () => {
    if (confirm(`Ta bort ${user.name}?`)) {
      User.deleteUser(user.id).then(() => li.remove());
    }
  };

  // 🖊️ Redigera-knapp
  const editBtn = document.createElement("button");
  editBtn.textContent = "🖊️";
  editBtn.style.marginLeft = "5px";
  editBtn.onclick = () => {
    const newName = prompt("Nytt namn:", user.name);
    const newEmail = prompt("Ny e-post:", user.email);
    if (newName && newEmail) {
      User.updateUser(user.id, { name: newName, email: newEmail }).then(() => {
        user.name = newName;
        user.email = newEmail;
        li.textContent = user.displayInfo(); // uppdatera texten
        li.appendChild(editBtn); // lägg till knappar igen
        li.appendChild(deleteBtn);
      });
    }
  };

  li.appendChild(editBtn);
  li.appendChild(deleteBtn);
  document.getElementById("userList").appendChild(li);
}

// 🧾 Formulär-hantering
document.addEventListener("DOMContentLoaded", () => {
  // ✅ Ladda alla användare och visa dem i listan
  User.getAllUsers().then((users) => {
    users.forEach((user) => addUserToList(user));
  });

  const form = document.getElementById("userForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Förhindra att sidan laddas om

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!name || !email) return;

    const newUser = new User(name, email);
    newUser.save().then(() => {
      addUserToList(newUser); // Lägg till nya användaren i listan
      form.reset(); // Rensa formuläret
    });
  });

  // Hantera rensa-knappen
  const clearButton = document.getElementById("clear");
  clearButton.addEventListener("click", () => {
    console.log("jag är i reset");
    form.reset(); // Rensa alla fält i formuläret
    localStorage.removeItem("formData");
  });

  // Ladda formulärdata när sidan laddas
  const savedData = JSON.parse(localStorage.getItem("formData"));
  if (savedData) {
    document.getElementById("name").value = savedData.name;
    document.getElementById("email").value = savedData.email;
  }

  // ✅ Använd preferenser för mörkt läge när sidan laddas
  if (getDarkMode()) {
    document.body.classList.add("dark-mode");
  }
});

// Spara formulärdata
document.getElementById("userForm").addEventListener("input", function () {
  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
  };
  localStorage.setItem("formData", JSON.stringify(formData));
});

// Mörkt läge funktioner
function setDarkMode(isDark) {
  localStorage.setItem("darkMode", JSON.stringify(isDark));
}

function getDarkMode() {
  return JSON.parse(localStorage.getItem("darkMode")) || false; // Standardvärde är false om inget finns
}

// Funktion för att växla mörkt läge
document.getElementById("darkModeToggle").addEventListener("click", () => {
  const currentMode = getDarkMode();
  const newMode = !currentMode;
  setDarkMode(newMode);
  if (newMode) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
});
