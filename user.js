class User {
  constructor(name, email, id = null) {
    this.name = name;
    this.email = email;
    this.id = id; // 🆔 Vi sparar id om det finns
  }

  // 🟢 Skapa en användare (POST)
  save() {
    if (this.id !== null) {
      console.warn("Användaren är redan sparad.");
      return Promise.resolve(); // Vi gör inget om id redan finns
    }

    return fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: this.name, email: this.email }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("User saved:", data);
        this.id = data.id; // Uppdatera objektet med id från servern
      })
      .catch((error) => console.error("Error saving user:", error));
  }

  // 🟡 Hämta alla användare (GET)
  static getAllUsers() {
    return fetch("http://localhost:3000/users")
      .then((response) => response.json())
      .then((data) => {
        console.log("Users:", data);
        return data.map((u) => new User(u.name, u.email, u.id)); // Konvertera till User-objekt
      })
      .catch((error) => console.error("Error fetching users:", error));
  }

  // 🟠 Uppdatera en användare (PUT)
  static updateUser(id, updatedData) {
    return fetch(`http://localhost:3000/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((data) => console.log("User updated:", data))
      .catch((error) => console.error("Error updating user:", error));
  }

  // 🔴 Ta bort en användare (DELETE)
  static deleteUser(id) {
    return fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
    })
      .then(() => console.log(`User ${id} deleted`))
      .catch((error) => console.error("Error deleting user:", error));
  }

  displayInfo() {
    return `Namn: ${this.name}, E-post: ${this.email}`;
  }
}

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
});

// let user1 = new User("Alice", "alice@example.com");
// let user2 = new User("Bob", "bob@example.com");
// user2.displayInfo(); // Namn: Bob, E-post: bob@example.com

// // console.log(user1);
// // user2.save(); // Lägger till en ny användare
// User.getAllUsers();
