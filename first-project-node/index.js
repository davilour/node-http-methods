const express = require("express");
const uuid = require("uuid");
const bodyParser = require("body-parser");

const app = express();
const users = [];

app.use(bodyParser.json());

const CheckUserId = (request, response, next) => {
    const id = request.params.id;
    const index = users.findIndex((user) => user.id === id);

    if (index < 0) {
        return response.status(404).json({ error: "Not found" });
    }

    request.UserIndex = index;
    request.UserId = id;

    next();
};

//EXIBIR NO FRONT
app.get("/users", (request, response) => {
    return response.json(users);
});

//CRIAR USUARIO
app.post("/users", (request, response) => {
    if (!request.body || !request.body.name || !request.body.age) {
        return response.status(400).json({ error: "Dados inválidos" });
    }

    const { name, age } = request.body;
    const user = { id: uuid.v4(), name, age };
    users.push(user);

    return response.status(201).json(users);
});

//ATUALIZAR USUARIO
app.put("/users/:id", CheckUserId, (request, response) => {
    const { name, age } = request.body;
    const index = request.UserIndex;
    const id = request.UserId;

    const updateUser = { id, name, age };

    users[index] = updateUser;

    return response.json(users);
});

//DELETAR USUARIO
app.delete("/users/:id", CheckUserId, (request, response) => {
    const index = request.UserIndex;

    users.splice(index, 1);

    return response.status(204).json();
});

//CONECTAR NO SERVIDOR
const port = 3000;
app.listen(port, () => {
    console.log(`Your server is running on port ${port} 😁`);
});
