import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { getTodos, addTodo, removeTodo, markAsCompleted } from './controllers/todoController.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the frontend/public directory
app.use(express.static(path.join(process.cwd(), 'frontend/public')));

// API Routes
app.get('/api/todos', getTodos);
app.post('/api/todos', addTodo);
app.delete('/api/todos/:id', removeTodo);
app.put('/api/todos/:id', markAsCompleted);

// Fallback to serve index.html for any other requests (for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'frontend/public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
