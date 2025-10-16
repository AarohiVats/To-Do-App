// ===== Elements =====
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskDeadline = document.getElementById("taskDeadline");
const addBtn = document.getElementById("addBtn");

const pendingTasksDiv = document.getElementById("pendingTasks");
const completedTasksDiv = document.getElementById("completedTasks");
const overdueTasksDiv = document.getElementById("overdueTasks");

// ===== Task Array =====
let tasks = [];

// ===== Add Task =====
addBtn.addEventListener("click", () => {
  const title = taskTitle.value.trim();
  const desc = taskDescription.value.trim();
  const deadline = taskDeadline.value;

  if (!title || !deadline) {
    alert("Please enter a title and deadline.");
    return;
  }

  const task = {
    id: Date.now(),
    title,
    desc,
    deadline: new Date(deadline),
    createdAt: new Date(),
    completed: false,
  };

  tasks.push(task);
  taskTitle.value = "";
  taskDescription.value = "";
  taskDeadline.value = "";
  renderTasks();
});

// ===== Render Tasks =====
function renderTasks() {
  pendingTasksDiv.innerHTML = "";
  completedTasksDiv.innerHTML = "";
  overdueTasksDiv.innerHTML = "";

  const now = new Date();

  tasks.forEach(task => {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task-item";

    const titleEl = document.createElement("div");
    titleEl.className = "task-title";
    titleEl.textContent = task.title;

    const descEl = document.createElement("div");
    descEl.className = "task-desc";
    descEl.textContent = task.desc;

    const timeInfo = document.createElement("small");
    timeInfo.textContent = `Added: ${task.createdAt.toLocaleString()} | Deadline: ${task.deadline.toLocaleString()}`;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    // Buttons
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit-btn";
    editBtn.addEventListener("click", () => editTask(task.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    // Complete / Undo button
    if (!task.completed && task.deadline > now) {
      const completeBtn = document.createElement("button");
      completeBtn.textContent = "Complete";
      completeBtn.className = "complete-btn";
      completeBtn.addEventListener("click", () => completeTask(task.id));
      actions.appendChild(completeBtn);
    } else if (task.completed) {
      const undoBtn = document.createElement("button");
      undoBtn.textContent = "Undo";
      undoBtn.className = "undo-btn";
      undoBtn.addEventListener("click", () => undoTask(task.id));
      actions.appendChild(undoBtn);
    }

    taskDiv.appendChild(titleEl);
    taskDiv.appendChild(descEl);
    taskDiv.appendChild(timeInfo);
    taskDiv.appendChild(actions);

    // Categorize task
    if (task.completed) {
      taskDiv.classList.add("completed");
      completedTasksDiv.appendChild(taskDiv);
    } else if (task.deadline < now) {
      taskDiv.classList.add("overdue");
      overdueTasksDiv.appendChild(taskDiv);
    } else {
      pendingTasksDiv.appendChild(taskDiv);
    }
  });
}

// ===== Task Operations =====
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newTitle = prompt("Edit Title:", task.title);
  const newDesc = prompt("Edit Description:", task.desc);
  const newDeadline = prompt("Edit Deadline (YYYY-MM-DDTHH:MM):", task.deadline.toISOString().slice(0,16));

  if (newTitle) task.title = newTitle;
  if (newDesc) task.desc = newDesc;
  if (newDeadline) task.deadline = new Date(newDeadline);

  renderTasks();
}

function completeTask(id) {
  const task = tasks.find(t => t.id === id);
  task.completed = true;
  renderTasks();
}

function undoTask(id) {
  const task = tasks.find(t => t.id === id);
  task.completed = false;
  renderTasks();
}

// ===== Auto-Check Overdue =====
setInterval(renderTasks, 60000); // every 1 minute
