document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const dueInput = document.getElementById("dueDateInput");
  const taskText = taskInput.value.trim();
  const dueDate = dueInput.value;

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  const now = new Date();
  const addedTime = now.toISOString();

  const task = {
    text: taskText,
    completed: false,
    addedTime,
    dueTime: dueDate ? new Date(dueDate).toISOString() : null
  };

  const tasks = getTasksFromStorage();
  tasks.push(task);
  saveTasksToStorage(tasks);
  renderTasks();

  taskInput.value = "";
  dueInput.value = "";
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  let tasks = getTasksFromStorage();

  // Sort by due date first if it exists, otherwise by added date
  tasks.sort((a, b) => {
    const dateA = a.dueTime || a.addedTime;
    const dateB = b.dueTime || b.addedTime;
    return new Date(dateA) - new Date(dateB);
  });

  taskList.innerHTML = "";

  const now = new Date();

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    const dueDateObj = task.dueTime ? new Date(task.dueTime) : null;
    const isOverdue = dueDateObj && dueDateObj < now && !task.completed;

    if (isOverdue) li.classList.add("overdue");

    const taskHTML = `
      <div class="task-info" onclick="toggleComplete(${index})">
        <span class="task-text">${task.text}</span><br/>
        <small class="task-time">Added: ${new Date(task.addedTime).toLocaleString()}</small><br/>
        ${
          task.dueTime
            ? `<small class="due-time">Due: ${new Date(task.dueTime).toLocaleString()}</small>`
            : ""
        }
      </div>
      <button onclick="deleteTask(${index})">Delete</button>
    `;

    li.innerHTML = taskHTML;
    taskList.appendChild(li);
  });
}

function toggleComplete(index) {
  const tasks = getTasksFromStorage();
  tasks[index].completed = !tasks[index].completed;
  saveTasksToStorage(tasks);
  renderTasks();
}

function deleteTask(index) {
  const tasks = getTasksFromStorage();
  tasks.splice(index, 1);
  saveTasksToStorage(tasks);
  renderTasks();
}

function getTasksFromStorage() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasksToStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  renderTasks();
}
