
const server = 'http://localhost:3000';

async function createProject() {
  const name = document.getElementById('projectName').value;
  await fetch(`${server}/create-project`, {
    method: 'POST',
    body: JSON.stringify({ name })
  });
  loadData();
} 

async function createTask(projectId) {
  const title = prompt("Task title:");
  const assignedTo = prompt("Assigned to:");
  if (!title || !assignedTo) return;
  await fetch(`${server}/create-task`, {
    method: 'POST',
    body: JSON.stringify({ projectId, title, assignedTo })
  });
  loadData();
}

async function addComment(taskId) {
  const author = prompt("Your name:");
  const message = prompt("Comment:");
  if (!author || !message) return;
  await fetch(`${server}/add-comment`, {
    method: 'POST',
    body: JSON.stringify({ taskId, author, message })
  });
  loadData();
}

async function loadData() {
  const res = await fetch(`${server}/data`);
  const { projects, tasks, comments } = await res.json();
  const container = document.getElementById('projects');
  container.innerHTML = '';

  projects.forEach(p => {
    const div = document.createElement('div');
    div.className = 'project';
    div.innerHTML = `<h3>${p.name}</h3><button onclick="createTask(${p.id})">Add Task</button>`;

    tasks.filter(t => t.projectId === p.id).forEach(t => {
      const taskDiv = document.createElement('div');
      taskDiv.className = 'task';
      taskDiv.innerHTML = `<b>${t.title}</b> (Assigned to: ${t.assignedTo})<br>
        <button onclick="addComment(${t.id})">Comment</button>`;

      comments.filter(c => c.taskId === t.id).forEach(c => {
        const cmt = document.createElement('div');
        cmt.className = 'comment';
        cmt.innerText = `${c.author}: ${c.message}`;
        taskDiv.appendChild(cmt);
      });

      div.appendChild(taskDiv);
    });

    container.appendChild(div);
  });
}

loadData();
