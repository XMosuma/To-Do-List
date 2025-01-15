const API_URL = 'http://localhost:3001/api/todos';

// Fetch all todos and render them
const fetchTodos = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch todos');
    const todos = await res.json();
    renderTodos(todos);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Render todos to the table
const renderTodos = (todos) => {
  const todoList = document.getElementById('todo-list');
  todoList.innerHTML = '';

  todos.forEach((todo) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${todo.id}</td>
      <td>${todo.title}</td>
      <td>${todo.completed ? 'Completed' : 'Not Completed'}</td>
      <td>
        ${todo.actions.markAsCompleted ? `<button onclick="markAsCompleted(${todo.id})">Complete</button>` : ''}
        ${todo.actions.delete ? `<button onclick="removeTodo(${todo.id})">Remove</button>` : ''}
      </td>
    `;
    todoList.appendChild(row);
  });
};

// Add a new todo
const addTodo = async (title) => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error('Failed to add todo');
    fetchTodos(); // Re-fetch todos after adding
  } catch (error) {
    console.error('Error:', error);
  }
};

// Remove a todo by ID
const removeTodo = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to remove todo');
    fetchTodos(); // Re-fetch todos after removal
  } catch (error) {
    console.error('Error:', error);
  }
};

// Mark a todo as completed
const markAsCompleted = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'PUT' });
    if (!res.ok) throw new Error('Failed to mark as completed');
    fetchTodos(); // Re-fetch todos after marking as completed
  } catch (error) {
    console.error('Error:', error);
  }
};

// Handle form submission for adding a new todo
document.getElementById('add-todo-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('todo-title').value;
  addTodo(title);
  document.getElementById('todo-title').value = ''; // Clear input field
});

// Initial fetch to load todos
fetchTodos();
