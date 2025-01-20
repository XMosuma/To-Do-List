const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


// Database setup
const db = new sqlite3.Database("todo.db", (err) => {
  if (err) return console.error("Database connection error:", err.message);
  console.log("Connected to SQLite database.");
});

// Create table if not exists
db.run(
  "CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, status TEXT NOT NULL)"
);

// Routes
app.get("/api/todos", (req, res) => {
  db.all("SELECT * FROM todos", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/api/todos", (req, res) => {
  const { title, status } = req.body;
  if (!title || !status) return res.status(400).json({ error: "Invalid data" });

  db.run(
    "INSERT INTO todos (title, status) VALUES (?, ?)",
    [title, status],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, title, status });
    }
  );
});

app.delete("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM todos WHERE id = ?", id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "To-do deleted" });
  });
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
