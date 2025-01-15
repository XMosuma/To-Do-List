import { initializeDatabase } from '../data/database.js';

// Get all todos
export const getTodos = async (req, res) => {
  const db = await initializeDatabase();
  const todos = await db.all('SELECT * FROM todos');
  const todosWithActions = todos.map(todo => ({
    ...todo,
    actions: {
      markAsCompleted: !todo.completed,
      delete: true,
    },
  }));
  res.json(todosWithActions);
};

// Add a new todo
export const addTodo = async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const db = await initializeDatabase();
  const result = await db.run('INSERT INTO todos (title) VALUES (?)', [title]);
  const newTodo = {
    id: result.lastID,
    title,
    completed: false,
    actions: { markAsCompleted: true, delete: true },
  };

  res.json(newTodo);
};

// Remove a todo by ID
export const removeTodo = async (req, res) => {
  const { id } = req.params;

  const db = await initializeDatabase();
  const result = await db.run('DELETE FROM todos WHERE id = ?', [id]);

  if (result.changes === 0) return res.status(404).json({ error: 'Todo not found' });

  res.json({ message: 'Todo removed successfully' });
};

// Mark a todo as completed
export const markAsCompleted = async (req, res) => {
  const { id } = req.params;

  const db = await initializeDatabase();
  const result = await db.run('UPDATE todos SET completed = 1 WHERE id = ?', [id]);

  if (result.changes === 0) return res.status(404).json({ error: 'Todo not found' });

  const updatedTodo = await db.get('SELECT * FROM todos WHERE id = ?', [id]);
  res.json(updatedTodo);
};
