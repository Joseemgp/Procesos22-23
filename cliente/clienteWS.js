function ClienteWS(){
	this.socket;
	this.codigo;
	this.conectar=function(){
		this.socket=io();
		this.servidorWS();
	}
	this.crearPartida=function(){
		this.socket.emit("crearPartida",rest.nick);
	}
	this.unirseAPartida=function(codigo){
		this.socket.emit("unirseAPartida",rest.nick,codigo);
	}
	this.abandonarPartida=function(){
		this.socket.emit("abandonarPartida",rest.nick,cws.codigo);
	}
	this.salir=function(){
		this.socket.emit("usuarioSale",rest.nick,cws.codigo);
	}
	this.colocarBarco=function(nombre,x,y){
		this.socket.emit("colocarBarco",rest.nick,nombre,x,y);
	}
	this.barcosDesplegados=function(){
		this.socket.emit("barcosDesplegados",rest.nick);	
	}
	this.disparar=function(x,y){
		this.socket.emit("disparar",rest.nick,x,y);
	}



    
	this.servidorWS=function(){
		let cli=this;
		this.socket.on("partidaCreada",function(data){
			console.log(data);
			if (data.codigo!=-1){
				console.log("Usuario "+rest.nick+" crea partida codigo: "+data.codigo)
				iu.mostrarCodigo(data.codigo);
				cli.codigo=data.codigo;
			}
			else{
				console.log("No se ha podido crear partida");
				iu.mostrarModal("Atención","No se ha podido crear partida");
				//iu.mostrarCrearPartida();
				rest.comprobarUsuario();
			}
		});
		this.socket.on("unidoAPartida",function(data){
			if (data.codigo!=-1){
				console.log("Usuario "+rest.nick+" se une a partida codigo: "+data.codigo);
				iu.mostrarCodigo(data.codigo);
				cli.codigo=data.codigo;				
			}
			else{
				console.log("No se ha podido unir a partida");
			}
		});
		this.socket.on("actualizarListaPartidas",function(lista){
			if (!cli.codigo){
				iu.mostrarListaDePartidasDisponibles(lista);
			}
		});
		this.socket.on("faseDesplegando",function(data){
			tablero.flota=data.flota;
			tablero.elementosGrid();
			tablero.mostrarFlota();//data.flota);
			//iu.quitarER();
			console.log("Ya puedes desplegar la flota");
		})
		this.socket.on("aJugar",function(res){
			iu.mostrarModal("Batalla Naval","A jugar!");			
			//tablero.mostrar(true);
			iu.mostrarModal("Turno","Turno de "+res.turno);
		});
		this.socket.on("jugadorAbandona",function(data){
			iu.mostrarModal("Aviso","Jugador "+data.nick+" abandona");
			iu.finPartida();
		});
		
		this.socket.on("barcoColocado",function(res){
			console.log("Barco "+res.barco+" colocado?: "+res.colocado);
			let barco=tablero.flota[res.barco];
			if (res.colocado){
				tablero.terminarDeColocarBarco(barco,res.x,res.y);
				cli.barcosDesplegados();
			}
			else{
				iu.mostrarModal("Aviso","No se puede colocar barco");
			}
		});
		this.socket.on("aJugar",function(res){
			if (res.fase=="jugando"){
				console.log("A jugar, le toca a: "+res.turno);
			}
			
		});
		this.socket.on("esperandoRival",function(){
			console.log("Esperando rival");
		})
		this.socket.on("disparo",function(res){
			console.log(res.impacto);
			if(res.impacto=="agua"){
				iu.mostrarModal("Turno","Turno de "+res.turno);
			}

			console.log("Turno: "+res.turno);
			//iu.mostrarModal("Turno","Turno de "+res.turno);
			console.log("Atacante: "+res.atacante);
			if (res.atacante==rest.nick){
				tablero.updateCell(res.x,res.y,res.impacto,'computer-player');
			}
			else{
				tablero.updateCell(res.x,res.y,res.impacto,'human-player');	
			}
		});
		this.socket.on("info",function(info){
			console.log(info);
		});
		this.socket.on("finPartida",function(res){
			console.log("Fin de la partida");
			console.log("Ganador: "+res.turno);
			iu.mostrarModal("Batalla Naval","Fin de la partida. Ganador: "+res.turno);
			iu.finPartida();
		});
		this.socket.on("partidaAbandonada", function (res) {

            if (res.codigoP != -1) {

                console.log(res.nombre + " ha abandonado la partida con codigo: " + res.codigoP  + " Ha ganado " + res.nombreR)
				//console.log(data)
                

                iu.mostrarModal("Batalla Naval", res.nombre+" ha abandonado la partida , Ha ganado " + res.nombreR);
				iu.mostrarHome();
            }

            

        });



        this.socket.on("partidaCancelada", function (res) {

            iu.mostrarModal("Batalla Naval","Has terminado la partida " + res.codigoP + " antes de que se uniese alguien")

            iu.mostrarHome()

        });
	}
}