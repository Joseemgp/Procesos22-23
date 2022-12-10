function ServidorWS(){
    // enviar peticiones
    this.enviarAlRemitente=function(socket,mensaje,datos){
		socket.emit(mensaje,datos);
	}

    this.enviarATodosEnPartida=function(io,codigo,mensaje,datos){
		io.sockets.in(codigo).emit(mensaje,datos)
	}
    this.enviarATodos=function(socket,mens,datos){
    	socket.broadcast.emit(mens,datos);
    }





    //gestionar peticiones
    this.lanzarServidorWS=function(io,juego){
        let cli=this;
        io.on('connection', (socket) => {
            console.log('usuario conectado');
            socket.on("crearPartida",function(nick){
                let res = juego.jugadorCreaPartida(nick);
                let codigoStr= res.codigo.toString();
                socket.join(codigoStr);
                //cli.enviarAlRemitente(socket,"partidaCreada",res)
                cli.enviarATodosEnPartida(io,codigoStr,"partidaCreada",res)
                let lista=juego.obtenerPartidasDisponibles();
                cli.enviarATodos(socket,"actualizarListaPartidas",lista)
            });

            socket.on("unirseAPartida",function(nick,codigo){
                let codigoStr=codigo.toString();
                socket.join(codigoStr);
                let res = juego.jugadorSeUneAPartida(nick,codigo);		  	
                cli.enviarAlRemitente(socket,"unidoAPartida",res);		  	
                let partida=juego.obtenerPartida(codigo);
               /* if (partida.esJugando()){
                    cli.enviarATodosEnPartida(io,codigoStr,"aJugar",{});
                }*/
                if(partida.esDesplegando()){
                    let us=juego.obtenerUsuario(nick);
                    let flota=us.obtenerFlota();
                    let res={};
                    res.flota=flota;
                    cli.enviarATodosEnPartida(io,codigoStr,"faseDesplegando",res);
                }

          });

          socket.on("usuarioSale",function(nick,codigo){
            let lista = juego.obtenerPartidasDisponibles();
          
            res= {jugadorS:nick} 
            if(codigo){
                let codigoStr =codigo.toString();              
                cli.enviarATodosEnPartida(io, codigoStr, "usuarioSalido", res);
                cli.enviarATodos(socket, "actualizarListaPartidas", lista); 
            }

        })
            
            socket.on("abandonarPartida",function(nick,codigo){
                juego.jugadorAbandona(nick,codigo);
                cli.enviarATodosEnPartida(io,codigo,"jugadorAbandona",{})
            });
            
            socket.on("colocarBarco",function(nick,nombre,x,y){

                let us=juego.obtenerUsuario(nick);
                if(us){
                   us.colocarBarco(nombre,x,y);
                    let desplegado = us.obtenerBarcoDesplegado(nombre)
                    let res={ barco:nombre,x:x,y:y,colocado:desplegado};
                    cli.enviarAlRemitente(socket,"barcoColocado",res)
                    
                }
                
            });
            socket.on("barcosDesplegados",function(nick){
                let us=juego.obtenerUsuario(nick);
                if(us){
                    us.barcosDesplegados();
                    let partida=us.partida;
                    if(partida && (partida.esJugando())){
                        let res={fase:partida.fase,turno:partida.turno.nick}
                        let codigoStr=partida.codigo.toString();
                        cli.enviarATodosEnPartida(io,codigoStr,"aJugar",res)
                    }
                }else{
                    cli.enviarAlRemitente(socket,"esperandoRival")
                }
            });

            socket.on("disparar",function(nick,x,y){
                let us=juego.obtenerUsuario(nick);
                let partida=us.partida;
                if(us && partida.esJugando()&& partida.turno.nick==nick){
                    us.disparar(x,y);
                    let estado=us.obtenerEstadoMarcado(x,y);
                    let partida=us.partida;
                    let codigoStr=partida.codigo.toString();
                    let res={impacto:estado,x:x,y:y,turno:partida.turno.nick,atacante:nick};
                    cli.enviarATodosEnPartida(io,codigoStr,"disparo",res);
                    if(partida.fase=="final"){
                        cli.enviarATodosEnPartida(io,codigoStr,"finPartida",res)
                    }
                }
            });
          });
          
    }
}

module.exports.ServidorWS=ServidorWS;