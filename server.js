const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Define path to the JSON file
const todosFilePath = path.join(__dirname, "todos.json");

// Read todos from the JSON file
function readTodos() {
  try {
    const data = fs.readFileSync(todosFilePath);
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading file', err);
    return [];
  }
}

// Write todos to the JSON file
function writeTodos(todos) {
  try {
    fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2));
  } catch (err) {
    console.error('Error writing file', err);
  }
}

// Routes
app.get("/api/todos", (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

app.post("/api/todos", (req, res) => {
  const { title, status } = req.body;
  if (!title || !status) return res.status(400).json({ error: "Invalid data" });

  const todos = readTodos();
  const newTodo = { id: Date.now(), title, status };
  todos.push(newTodo);
  writeTodos(todos);

  res.status(201).json(newTodo);
});

app.delete("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const todos = readTodos();
  const updatedTodos = todos.filter(todo => todo.id !== parseInt(id));
  writeTodos(updatedTodos);
  res.status(200).json({ message: "To-do deleted" });
});

app.put("/api/todos/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const todos = readTodos();
  const todo = todos.find(todo => todo.id === parseInt(id));

  if (todo) {
    todo.status = status;
    writeTodos(todos);
    res.status(200).json(todo);
  } else {
    res.status(404).json({ error: "To-do not found" });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
