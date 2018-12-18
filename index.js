require("dotenv-safe").load()
const jwt = require("jsonwebtoken")
const express = require("express")
const usersRoute = require("./users/routes.js")
const users = require("./users/users.js")
const cors = require ('cors')
const app = express();
const PORT = process.env.PORT || 8080


const mongoose = require("mongoose")
mongoose.connect("mongodb://sabrina:users1234@ds115035.mlab.com:15035/integrar")
mongoose.Promise = global.Promise;



const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erro de conexão:"));
db.once("open", function() {
  console.log("Conexão feita com sucesso");
});


app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-access-token"
  );
  res.setHeader("Access-Control-Allow-Credentials", true)

  next();
});

app.use(express.json());
app.use("/api/users", usersRoute);
app.use(cors())

app.post("/api/login", (req, res) => {
  authenticatesUser(req.body, (error, id) => {
    let token;

    if (error) {
      return res.status(error.code).send(error.message);
    }

    token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 300
    });

    res.send({ auth: true, token });
  });
});

function authenticatesUser(authUser, cb) {
  users.findOne(
    { email: authUser.email, password: authUser.password },
    function(error, response) {
      if (error) {
        return cb({ code: 500, message: "Usuário ou senha inválido." })
      }
      return cb(null, response.id)
    }
  );
}

app.listen(PORT, () => console.log(`Ouvindo na porta ${PORT}...`))
