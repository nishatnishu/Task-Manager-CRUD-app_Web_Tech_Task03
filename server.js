// 1. Import express
const express = require("express");
const app = express();
const PORT = 3000;

// 2. Middleware
app.use(express.json());

// 3. In-memory storage
let tasks = [];
let idCounter = 1;

// Valid status options
const validStatus = ["To Do", "In Progress", "Completed"];

// 4. CRUD Routes with optional features

// (a) Create Task (POST)
app.post("/tasks", (req, res) => {
  const { title, description, status } = req.body;

  // Validate title
  if (!title) return res.status(400).json({ error: "Title is required" });

  // Validate status if provided
  if (status && !validStatus.includes(status))
    return res
      .status(400)
      .json({ error: `Status must be one of: ${validStatus.join(", ")}` });

  const task = {
    id: idCounter++,
    title,
    description: description || "",
    status: status || "To Do",
  };

  tasks.push(task);
  res.status(201).json(task);
});

// (b) Read Tasks (GET) with filtering, search, sort
app.get("/tasks", (req, res) => {
  let filteredTasks = [...tasks];

  // Filter by status
  if (req.query.status) {
    filteredTasks = filteredTasks.filter(
      (t) => t.status === req.query.status
    );
  }

  // Search by title or description
  if (req.query.search) {
    const keyword = req.query.search.toLowerCase();
    filteredTasks = filteredTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(keyword) ||
        t.description.toLowerCase().includes(keyword)
    );
  }

  // Sort by title
  if (req.query.sort === "title") {
    filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
  }

  res.json(filteredTasks);
});

// (c) Update Task (PUT)
app.put("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, description, status } = req.body;

  const task = tasks.find((t) => t.id === taskId);
  if (!task) return res.status(404).json({ error: "Task not found" });

  if (title) task.title = title;
  if (description) task.description = description;
  if (status) {
    if (!validStatus.includes(status))
      return res
        .status(400)
        .json({ error: `Status must be one of: ${validStatus.join(", ")}` });
    task.status = status;
  }

  res.json(task);
});

// (d) Delete Task (DELETE)
app.delete("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter((t) => t.id !== taskId);
  res.json({ message: "Task deleted successfully" });
});

// (e) Mark Task as Completed (PATCH optional)
app.patch("/tasks/:id/complete", (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return res.status(404).json({ error: "Task not found" });

  task.status = "Completed";
  res.json(task);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
