const express = require("express")
const server = express()
const routes = require("./routes")


// habilita o motor ejs
server.set("view engine","ejs")

//rotas para arquivos estaticos
server.use(express.static("public"))

//usar o req.body
server.use(express.urlencoded({ extended: true}))

// request, response
server.use(routes)


//abre a porta 3000 pro servidor
server.listen(3000,()=> console.log("rodando"))