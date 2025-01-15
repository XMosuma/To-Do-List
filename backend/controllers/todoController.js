import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data/todos.json');

// Function to read todos from the JSON file
const readTodos = () => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    console.error('Error reading todos:', error);
    return [];
  }
};

// Function to write todos to the JSON file
const writeTodos = (data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// Controller to get all todos
export const getTodos = (req, res) => {
  const todos = readTodos();
  if (todos.length === 0) {
    return res.status(404).json({ error: 'No todos found' });
  }
  // Include actions in each todo
  const todosWithActions = todos.map((todo) => ({
    ...todo,
    actions: {
      markAsCompleted: !todo.completed, // Can only mark as completed if it's not already completed
      delete: true, // Allow deletion for all todos
    },
  }));
  res.json(todosWithActions);
};

// Controller to add a new todo
export const addTodo = (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  
  const todos = readTodos();
  const newTodo = { id: Date.now(), title, completed: false, actions: { markAsCompleted: true, delete: true } };
  todos.push(newTodo);
  writeTodos(todos);
  res.json(newTodo);
};

// Controller to remove a todo by ID
export const removeTodo = (req, res) => {
  const { id } = req.params;
  const todos = readTodos();
  const updatedTodos = todos.filter((todo) => todo.id != id);
  
  if (todos.length === updatedTodos.length) return res.status(404).json({ error: 'Todo not found' });
  
  writeTodos(updatedTodos);
  res.json({ message: 'Todo removed successfully' });
};

// Controller to mark a todo as completed by ID
export const markAsCompleted = (req, res) => {
  const { id } = req.params;
  const todos = readTodos();
  const todo = todos.find((todo) => todo.id == id);
  
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  
  todo.completed = true;
  todo.actions.markAsCompleted = false; // Disable the action once completed
  writeTodos(todos);
  res.json(todo);
};
