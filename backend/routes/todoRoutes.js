// backend/routes/todoRoutes.js
import express from 'express';
import { getTodos, addTodo, removeTodo, markAsCompleted } from '../controllers/todoController.js';

const router = express.Router();

router.get('/', getTodos);
router.post('/add', addTodo);
router.delete('/remove/:id', removeTodo);
router.put('/complete/:id', markAsCompleted);

export default router;
