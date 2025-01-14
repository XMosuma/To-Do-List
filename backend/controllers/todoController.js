import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'backend/data/todos.json');

const readTodos = () => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    console.error('Error reading todos:', error);
    return [];
  }
};

const writeTodos = (data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

export const getTodos = (req, res) => res.json(readTodos());

export const addTodo = (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const todos = readTodos();
  const newTodo = { id: Date.now(), title, completed: false };
  todos.push(newTodo);
  writeTodos(todos);
  res.json(newTodo);
};

export const removeTodo = (req, res) => {
  const { id } = req.params;
  const todos = readTodos();
  const updatedTodos = todos.filter((todo) => todo.id != id);
  if (todos.length === updatedTodos.length) return res.status(404).json({ error: 'Todo not found' });
  writeTodos(updatedTodos);
  res.json({ message: 'Todo removed successfully' });
};

export const markAsCompleted = (req, res) => {
  const { id } = req.params;
  const todos = readTodos();
  const todo = todos.find((todo) => todo.id == id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  todo.completed = true;
  writeTodos(todos);
  res.json(todo);
};
