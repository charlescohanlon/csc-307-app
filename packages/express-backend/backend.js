import express from "express";
import cors from "cors";
import {
  addUser,
  getUsers,
  findUserById,
  removeUserById,
} from "./services/user-service.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/users", async (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  res.send({ users_list: await getUsers(name, job) });
});

app.get("/users/:id", async (req, res) => {
  const id = req.params["_id"];
  let result = await findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.delete("/users/:id", async (req, res) => {
  const id = req.params["id"];
  if ((await removeUserById(id)) === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(204).send();
  }
});

app.post("/users", async (req, res) => {
  try {
    const userToAdd = req.body;
    const newUser = await addUser(userToAdd);
    res.status(201).send(JSON.stringify(newUser));
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
