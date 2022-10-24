
const fs=require("fs");
const express = require('express');
//const uuid = require('uuid/v4');
const app = express();

const http = require('http');
const server=http.createServer(app)
const {Server}=require("socket.io");
const io =new Server(server);

const modelo = require("./Servidor/modelo.js");
const sWS=require("./Servidor/servidorWS.js")

const PORT = process.env.PORT || 3000;

let juego =new modelo.Juego();
let servidorWS=new sWS.ServidorWS();

/*app.get('/', (req, res) => {
  res
    .status(200)
    .send("Hola")
    .end();
});*/




app.use(express.static(__dirname + "/"));
app.get("/", function(request,response){
  var contenido=fs.readFileSync(__dirname+"/Cliente/index.html");
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
  let lista=juego.obtenerPartidasDisponibles();
  response.send(lista);
});

server.listen(PORT, () => {
  console.log(`App esta escuchando en el puerto  ${PORT}`);
  console.log(' Ctrl+C pa salir.');
});

sWS.ServidorWS.lanzarServidorWS(io,juego);
/*app.listen(PORT, () => {
  console.log(`App esta escuchando en el puerto  ${PORT}`);
  console.log(' Ctrl+C pa salir.');
});*/
