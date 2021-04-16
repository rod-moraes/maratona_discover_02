const express = require("express");
const server = express();
const routes = require("./routes");
const path = require("path");
const cors = require("cors");

server.use(cors());
// habilita o motor ejs
server.set("view engine", "ejs");

// Mudar localização da views
server.set("views", path.join(__dirname, "views"));

//rotas para arquivos estaticos
server.use(express.static("public"));

//usar o req.body
server.use(express.urlencoded({ extended: true }));

// request, response
server.use(routes);

//abre a porta 3000 pro servidor
server.listen(3000, () => console.log("rodando"));
