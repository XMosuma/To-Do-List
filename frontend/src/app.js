const API_URL = 'http://localhost:3001/api/todos';

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
        <button onclick="markAsCompleted(${todo.id})">Complete</button>
        <button onclick="removeTodo(${todo.id})">Remove</button>
      </td>
    `;
    todoList.appendChild(row);
  });
};

const addTodo = async (title) => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error('Failed to add todo');
    fetchTodos();
  } catch (error) {
    console.error('Error:', error);
  }
};

const removeTodo = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to remove todo');
    fetchTodos();
  } catch (error) {
    console.error('Error:', error);
  }
};

const markAsCompleted = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'PUT' });
    if (!res.ok) throw new Error('Failed to mark as completed');
    fetchTodos();
  } catch (error) {
    console.error('Error:', error);
  }
};

document.getElementById('add-todo-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('todo-title').value;
  addTodo(title);
  document.getElementById('todo-title').value = '';
});

// Initial fetch
fetchTodos();
