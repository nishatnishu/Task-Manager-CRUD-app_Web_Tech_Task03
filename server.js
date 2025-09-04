// 1. Import express
const express = require("express");
const app = express();
const PORT = 3000;

// 2. Middleware
app.use(express.json());

// 3. In-memory storage
let tasks = [];
let idCounter = 1;
// 4. CRUD Routes

//(a) Create Task (POST)
app.post("/tasks", (req, res) => {
  const { title, description, status } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const task = {
    id: idCounter++,
    title,
    description: description || "",
    status: status || "To Do"
  };

  tasks.push(task);
  res.status(201).json(task);
});

//(b) Read Tasks (GET)
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

//(c) Update Task (PUT)
app.put("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, description, status } = req.body;

  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (title) task.title = title;
  if (description) task.description = description;
  if (status) task.status = status;

  res.json(task);
});

//(d) Delete Task (DELETE)
app.delete("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== taskId);
  res.json({ message: "Task deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
