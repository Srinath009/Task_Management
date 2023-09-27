// Set up variables to store references to the relevant HTML elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const showAllBtn = document.getElementById('show-all-btn');
const showCompletedBtn = document.getElementById('show-completed-btn');

// Retrieve tasks from localStorage or set up an empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Add event listeners for creating and rendering tasks
addTaskBtn.addEventListener('click', createTask);
taskInput.addEventListener('keydown', handleEnterKey);
taskList.addEventListener('change', handleTaskCompletion);
taskList.addEventListener('click', handleTaskAction);
showAllBtn.addEventListener('click', showAllTasks);
showCompletedBtn.addEventListener('click', showCompletedTasks);

// Function to create a new task
function createTask() {
  const taskName = taskInput.value.trim();
  if (taskName !== '') {
    const task = {
      id: Date.now(),
      name: taskName,
      completed: false
    };
    tasks.push(task);
    taskInput.value = '';
    saveTasks();
    renderTasks();
  }
}

// Function to handle the Enter key press event
function handleEnterKey(event) {
  if (event.key === 'Enter') {
    createTask();
  }
}

// Function to handle the task completion event
function handleTaskCompletion(event) {
  const checkbox = event.target;
  const taskId = parseInt(checkbox.dataset.id);
  tasks.forEach(task => {
    if (task.id === taskId) {
      task.completed = checkbox.checked;
    }
  });
  saveTasks();
  renderTasks();
}

// Function to handle the task action (edit or delete)
function handleTaskAction(event) {
  const target = event.target;
  const taskItem = target.closest('li');
  if (!taskItem) return;

  const taskId = parseInt(taskItem.dataset.id);

  if (target.classList.contains('edit-btn')) {
    handleTaskEdit(taskId);
  } else if (target.classList.contains('delete-btn')) {
    handleTaskDelete(taskId);
  }
}

// Function to handle the task edit event
function handleTaskEdit(taskId) {
  const task = tasks.find(task => task.id === taskId);
  if (!task) return;

  const newTaskName = prompt('Enter the new task name:', task.name);
  if (newTaskName !== null) {
    task.name = newTaskName.trim();
    saveTasks();
    renderTasks();
  }
}

// Function to handle the task delete event
function handleTaskDelete(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  saveTasks();
  renderTasks();
}

// Function to show all tasks
function showAllTasks() {
  renderTasks(tasks);
  showAllBtn.classList.add('active');
  showCompletedBtn.classList.remove('active');
}

// Function to show only completed tasks
function showCompletedTasks() {
  const completedTasks = tasks.filter(task => task.completed);
  renderTasks(completedTasks);
  showAllBtn.classList.remove('active');
  showCompletedBtn.classList.add('active');
}

// Function to save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to render the tasks
function renderTasks(tasksToRender) {
  taskList.innerHTML = '';
  tasksToRender.forEach(task => {
    const listItem = document.createElement('li');
    listItem.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.dataset.id = task.id;

    const taskName = document.createElement('span');
    taskName.textContent = task.name;
    if (task.completed) {
      taskName.style.textDecoration = 'line-through';
    }

    const editButton = document.createElement('button');
    editButton.className = 'edit-btn';
    editButton.textContent = 'Edit';

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = 'Delete';

    listItem.appendChild(checkbox);
    listItem.appendChild(taskName);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    taskList.appendChild(listItem);
  });
}

// Call the renderTasks function initially to display any existing tasks
renderTasks(tasks);
