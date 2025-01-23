const todoList = document.getElementById('todo-list');
const newTaskBtn = document.getElementById('newTaskBtn');
const taskModal = document.getElementById('taskModal');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');

// Fetch and display tasks
const fetchTasks = async () => {
  const response = await fetch('/api/tasks');
  const tasks = await response.json();

  todoList.innerHTML = tasks
    .map(
      (task) => `
    <tr>
      <td>${task.id}</td>
      <td>${task.task}</td>
      <td>${task.completed ? 'Completed' : 'Pending'}</td>
      <td>
        <button onclick="completeTask(${task.id})" ${
          task.completed ? 'disabled' : ''
        }>✔</button>
        <button onclick="deleteTask(${task.id})">🗑️</button>
      </td>
    </tr>
  `
    )
    .join('');
};

// Add a new task
const addTask = async () => {
  const task = taskInput.value;
  if (task.trim() === '') return;

  await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task }),
  });

  taskInput.value = '';
  taskModal.classList.add('hidden');
  fetchTasks();
};

// Mark a task as completed
const completeTask = async (id) => {
  await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
  });
  fetchTasks();
};

// Delete a task
const deleteTask = async (id) => {
  await fetch(`/api/tasks/${id}`, {
    method: 'DELETE',
  });
  fetchTasks();
};

// Show the modal to add a new task
newTaskBtn.addEventListener('click', () => {
  taskModal.classList.remove('hidden');
});

// Add a new task from the modal
addTaskBtn.addEventListener('click', addTask);

// Fetch tasks on page load
fetchTasks();
