class User {
  constructor(name, email, id = null) {
    this.name = name;
    this.email = email;
    this.id = id; // 🆔 Vi sparar id om det finns
  }

  // 🟢 Skapa en användare (POST)
  async save() {
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

  //   // 🟢 Skapa en användare (POST)
  //   async save() {
  //     if (this.id !== null) {
  //       console.warn("Användaren är redan sparad.");
  //       return; // Gör inget om id redan finns
  //     }

  //     try {
  //       const response = await fetch("http://localhost:3000/users", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ name: this.name, email: this.email }),
  //       });
  //       const data = await response.json();
  //       console.log("User saved:", data);
  //       this.id = data.id; // Uppdatera objektet med id från servern
  //     } catch (error) {
  //       console.error("Error saving user:", error);
  //     }
  //   }

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

  //   // 🟡 Hämta alla användare (GET)
  //   static async getAllUsers() {
  //     try {
  //       const response = await fetch("http://localhost:3000/users");
  //       const data = await response.json();
  //       console.log("Users:", data);
  //       return data.map((u) => new User(u.name, u.email, u.id)); // Konvertera till User-objekt
  //     } catch (error) {
  //       console.error("Error fetching users:", error);
  //     }
  //   }

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

  //   // 🟠 Uppdatera en användare (PUT)
  //   static async updateUser(id, updatedData) {
  //     try {
  //       const response = await fetch(`http://localhost:3000/users/${id}`, {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(updatedData),
  //       });
  //       const data = await response.json();
  //       console.log("User updated:", data);
  //     } catch (error) {
  //       console.error("Error updating user:", error);
  //     }
  //   }

  // 🔴 Ta bort en användare (DELETE)
  static deleteUser(id) {
    return fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
    })
      .then(() => console.log(`User ${id} deleted`))
      .catch((error) => console.error("Error deleting user:", error));
  }

  //   // 🔴 Ta bort en användare (DELETE)
  //   static async deleteUser(id) {
  //     try {
  //       await fetch(`http://localhost:3000/users/${id}`, { method: "DELETE" });
  //       console.log(`User ${id} deleted`);
  //     } catch (error) {
  //       console.error("Error deleting user:", error);
  //     }
  //   }

  displayInfo() {
    return `Namn: ${this.name}, E-post: ${this.email}`;
  }
}

export default User;

// let user1 = new User("Alice", "alice@example.com");
// let user2 = new User("Bob", "bob@example.com");
// user2.displayInfo(); // Namn: Bob, E-post: bob@example.com

// // console.log(user1);
// // user2.save(); // Lägger till en ny användare
// User.getAllUsers();
