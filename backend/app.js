import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { getTodos, addTodo, removeTodo, markAsCompleted } from './controllers/todoController.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/api/todos', getTodos);
app.post('/api/todos', addTodo);
app.delete('/api/todos/:id', removeTodo);
app.put('/api/todos/:id', markAsCompleted);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
