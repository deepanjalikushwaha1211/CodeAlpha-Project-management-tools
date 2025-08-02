const http = require('http');
const fs = require('fs');
const url = require('url');

// Data files 
const PROJECTS_FILE = './backend/data/projects.json';
const TASKS_FILE = './backend/data/tasks.json';
const COMMENTS_FILE = './backend/data/comments.json';

// Helpers
const readJSON = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const writeJSON = (path, data) => fs.writeFileSync(path, JSON.stringify(data, null, 2));

// Server
const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const { pathname } = parsed;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.end();

  // Body parser
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    const data = body ? JSON.parse(body) : {};

    // Create Project
    if (pathname === '/create-project' && req.method === 'POST') {
      const projects = readJSON(PROJECTS_FILE);
      const newProject = { id: Date.now(), name: data.name };
      projects.push(newProject);
      writeJSON(PROJECTS_FILE, projects);
      return res.end(JSON.stringify(newProject));
    }

    // Create Task
    if (pathname === '/create-task' && req.method === 'POST') {
      const tasks = readJSON(TASKS_FILE);
      const newTask = { id: Date.now(), projectId: data.projectId, title: data.title, assignedTo: data.assignedTo };
      tasks.push(newTask);
      writeJSON(TASKS_FILE, tasks);
      return res.end(JSON.stringify(newTask));
    }

    // Add Comment to Task
    if (pathname === '/add-comment' && req.method === 'POST') {
      const comments = readJSON(COMMENTS_FILE);
      const newComment = {
        id: Date.now(),
        taskId: data.taskId,
        message: data.message,
        author: data.author,
        timestamp: new Date().toISOString()
      };
      comments.push(newComment);
      writeJSON(COMMENTS_FILE, comments);
      return res.end(JSON.stringify(newComment));
    }

    // Get All Data
    if (pathname === '/data' && req.method === 'GET') {
      const response = {
        projects: readJSON(PROJECTS_FILE),
        tasks: readJSON(TASKS_FILE),
        comments: readJSON(COMMENTS_FILE)
      };
      return res.end(JSON.stringify(response));
    }

    // 404
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
  });
});

server.listen(3000, () => {
  console.log('✅ Server running at http://localhost:3000');
});
