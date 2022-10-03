
const fs=require("fs");
const express = require('express');
//const uuid = require('uuid/v4');
const app = express();
const modelo = require("./servidor/modelo.js");

const PORT = process.env.PORT || 3000;

let juego =new modelo.Juego();

app.get('/', (req, res) => {
  res
    .status(200)
    .send("Hola")
    .end();
});




app.use(express.static(__dirname + "/"));
app.get("/", function(request,response){
  var contenido=fs.readFileSync(__dirname+"/cliente/index.html");
  response.setHeader("Content-type","text/html");
  response.send(contenido);
});

app.get("/agregarUsuario/:nick",function(request,response){
  let nick =request.params.nick;
  let res;
  res=juego.agregarUsuario(nick);
  response.send(res);
});

app.get("/crearPartida/:nick",function(request,response){
  let nick =request.params.nick;
  let res = juego.jugadorCreaPartida(nick);
  /*let usr=juego.usuarios[nick];
  let res={codigo:-1};
  let codigo
  if(usr){
    codigo=usr.crearPartida();
    res={codigo:codigo}
  }*/

  response.send(res);
});

app.get("/unirseAPartida/:codigo/:usr",function(request,response){
  let codigo= request.params.codigo;
  let nick=request.params.nick
  let res;
  res=juego.jugadorseUneAPartida(nick,codigo);
  response.send(res);
});

app.get("/obtenerPartidas"),function(request,response){
  let lista=juego.obtenerPartidas();
  response.send(lista);
}
app.get("/obtenerPartidasDisponibles",function(request,response){
  
})

app.listen(PORT, () => {
  console.log(`App esta escuchando en el puerto  ${PORT}`);
  console.log(' Ctrl+C pa salir.');
});
