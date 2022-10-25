function ServidorWS(){
    // enviar peticiones
    this.enviarAlRemitente=function(socket,mensaje,datos){
		socket.emit(mensaje,datos);
	}

    this.enviarATodosEnPartida=function(io,codigo,mensaje,datos){
		io.sockets.in(codigo).emit(mensaje,datos)
	}




    //gestionar peticiones
    this.lanzarServidorWS=function(io,juego){
        let cli=this;
        io.on('connection', (socket) => {
            console.log('usuario conectado');
            socket.on("crearPartida",function(nick){
                let res = juego.jugadorCreaPartida(nick);
                socket.join(res.codigo);
                cli.enviarAlRemitente(socket,"partidaCreada",res)
            });

            socket.on("unirseAPartida",function(nick,codigo){
                let res = juego.jugadorseUneAPartida(nick,codigo);
                cli.enviarAlRemitente(socket,"unidoAPartida",res)
                socket.join(codigo);
                //comprobar que la partids puede comenzar
                //partida en fase jugando?
                let partida=juego.obtenerPartida(codigo);
                if(partida.fase.esJugando()){
                    cli.enviarATodosEnPartida(io,codigo," a JUGAR",{})
                }
            });
          });
          
    }
}

module.exports.ServidorWS=ServidorWS;