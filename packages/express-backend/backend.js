import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

const generateUID = () => {
  const lastID = users["users_list"][users["users_list"].length - 1].id;
  const lastIdx = parseInt(lastID.charAt(lastID.length - 1)) + 1;
  return lastID + lastIdx;
};

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

const findUserByJob = (job) => {
  return users["users_list"].filter((user) => user["job"] === job);
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
  user.id = generateUID();
  users["users_list"].push(user);
  return user;
};

const removeUserById = (id) => {
  const idx = users["users_list"].findIndex((user) => user.id == id);
  if (idx !== -1) {
    return users["users_list"].splice(idx, 1);
  }
  return undefined;
};

app.use(cors());
app.use(express.json());

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job ? req.query.job : undefined;
  if (name != undefined) {
    let result = findUserByName(name);
    if (job != undefined) {
      result = findUserByJob(job);
    }
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  if (removeUserById(id) === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(204).send();
  }
});

app.post("/users", (req, res) => {
  try {
    const userToAdd = req.body;
    const newUser = addUser(userToAdd);
    res.status(201).send(JSON.stringify(newUser));
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
