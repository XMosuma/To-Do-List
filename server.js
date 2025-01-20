// Express setup
const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serving static files (make sure 'public' folder is accessible)
app.use(express.static(path.join(__dirname, "public")));

// Function to read todos from a JSON file
function readTodos() {
  const filePath = path.join(__dirname, 'todos.json');
  try {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading todos.json', err);
    return [];
  }
}

// Function to write todos to the JSON file
function writeTodos(todos) {
  const filePath = path.join(__dirname, 'todos.json');
  try {
    fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));
  } catch (err) {
    console.error('Error writing todos.json', err);
  }
}

// API routes
app.get("/api/todos", (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

app.post("/api/todos", (req, res) => {
  const { title, status } = req.body;
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
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
