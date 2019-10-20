const express = require("express");

const server = express();

server.use(express.json());
server.use((req, res, next) => {
  console.log(`Método: ${req.method}: URL ${req.url}`);
  console.time("time");
  next();
  console.timeEnd("time");
});

const projects = [];

function searchById(req, res, next) {
  const { id } = req.params;
  for (i = 0; i < projects.length; i++) {
    if (projects[i].id == id) {
      return next();
    }
  }
  return res.status(400).json({ error: "project does not exists" });
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const obj = {
    id,
    title,
    tasks: []
  };
  projects.push(obj);

  return res.json(projects);
});

server.put("/projects/:id", searchById, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  for (i = 0; i < projects.length; i++) {
    if (projects[i].id == id) {
      projects[i].title = title;
      break;
    }
  }

  return res.json(projects);
});

server.delete("/projects/:id", searchById, (req, res) => {
  const { id } = req.params;

  for (i = 0; i < projects.length; i++) {
    if (projects[i].id == id) {
      projects.splice(i, 1);
      break;
    }
  }

  return res.json(projects);
});

server.post("/projects/:id/tasks", searchById, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  for (i = 0; i < projects.length; i++) {
    if (projects[i].id == id) {
      projects[i].tasks.push(title);
      break;
    }
  }

  return res.json(projects);
});

server.listen(3000);
