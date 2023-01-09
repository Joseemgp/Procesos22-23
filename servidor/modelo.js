let cad=require('./cad.js');

function Juego(test){


	this.partidas={};
	this.usuarios={}; //array asociativo
	this.cad=new cad.Cad();
	this.test=test;

	this.agregarUsuario=function(nick){
		let res={"nick":-1};
		if (!this.usuarios[nick]){
			this.usuarios[nick]=new Usuario(nick,this);
			res={"nick":nick};
			console.log("Nuevo usuario: "+nick);
			this.insertarLog({"operacion":"inicio de sesion","propietario":nick,"fecha":Date()},function(){
				console.log("Registro  de log insertado(inicio de sesion)")
			})
		}
		return res;
	}
	this.eliminarUsuario=function(nick){
		delete this.usuarios[nick];
		
	}
	this.usuarioSale=function(nick){
		if (this.usuarios[nick]){
			this.finalizarPartida(nick);
			this.eliminarUsuario(nick);
			this.insertarLog({"operacion":"eliminarUsuario","propietario":nick,"fecha":Date()},function(){
				console.log("Registro  de log insertado(eliminarUsuario)")
			})
		}
	}
	this.jugadorCreaPartida=function(nick){
		let usr = this.usuarios[nick];
		let res={codigo:-1};
  		if (usr){
    		let codigo=usr.crearPartida();
	    	//let codigo=this.crearPartida(usr);
	    	res={codigo:codigo};
	    }
    	return res;
	}
	this.jugadorSeUneAPartida=function(nick,codigo){
		let usr = this.usuarios[nick];
		let res={"codigo":-1};
  		if (usr){
    		let valor=usr.unirseAPartida(codigo);
    		//let valor=this.unirseAPartida(codigo,usr)
	    	res={"codigo":valor};
	    }
    	return res;
	}
	this.obtenerUsuario=function(nick){
		if (this.usuarios[nick]){
			return this.usuarios[nick];
		}
	}
	this.crearPartida=function(usr){
		let codigo=Date.now();
		console.log("Usuario "+usr.nick+ " crea partida "+codigo);
		this.insertarLog({"operacion":"crearPartida","propietario":usr.nick,"fecha":Date()},function(){
			console.log("Registro de log insertado")
	});
		this.partidas[codigo]=new Partida(codigo,usr); 
		return codigo;
	}
	this.unirseAPartida=function(codigo,usr){
		let res=-1;
		if (this.partidas[codigo]){
			res=this.partidas[codigo].agregarJugador(usr);
			//insertar log
			this.insertarLog({"operacion":"unirseAPartida","propietario":usr.nick,"fecha":Date()},function(){
				console.log("Registro  de log insertado(unirse)")
			})
		}
		else{
			console.log("La partida no existe");
		}
		return res;
	}
	this.obtenerPartidas=function(){
		let lista=[];
		for (let key in this.partidas){
			lista.push({"codigo":key,"owner":this.partidas[key].owner.nick});
		}
		return lista;
	}
	this.obtenerPartidasDisponibles=function(){
		let lista=[];
		for (let key in this.partidas){
			if (this.partidas[key].fase=="inicial"){
				lista.push({"codigo":key,"owner":this.partidas[key].owner.nick});
			}
		}
		return lista;
	}
	this.finalizarPartida=function(nick){
		for (let key in this.partidas){
			if (this.partidas[key].fase=="inicial" && this.partidas[key].estoy(nick)){
				this.partidas[key].fase="final";
				this.insertarLog({"operacion":"finalizarPartida","propietario":nick,"fecha":Date()},function(){
					console.log("Registro  de log insertado(finalizarPartida)")
				})
			}
		}
	}
	this.obtenerPartida=function(codigo){
		return this.partidas[codigo];
	}
	this.abandonarPartida = function (nick, codigo) {
		this.insertarLog({ "operacion": "abandonarPartida", "propietario": nick, "fecha": Date() }, function () {
			console.log("Registro de log insertado");
		});
		return this.eliminarPartida(codigo);
	}
	this.insertarLog=function(log,callback){
		if(this.test=="false"){
			this.cad.insertarLog(log,callback);
		}
	}

	this.obtenerLogs=function(callback){
			this.cad.obtenerLogs(callback);

	}
	if(test=="false"){
		this.cad.conectar(function(db){
			console.log("conectado a Atlas")
		})
	}
	//this.cad.conectar();
}

function Usuario(nick,juego){
	this.nick=nick;
	this.juego=juego;
	this.tableroPropio;
	this.tableroRival;
	this.partida;

	this.flota={}; //podría ser array []
	this.crearPartida=function(){
		return this.juego.crearPartida(this)
	}
	this.unirseAPartida=function(codigo){
		return this.juego.unirseAPartida(codigo,this);
	}
	this.inicializarTableros=function(dim){
		this.tableroPropio=new Tablero(dim);
		this.tableroRival=new Tablero(dim);
	}
	this.inicializarFlota=function(){
		// this.flota.push(new Barco("b2",2));
		// this.flota.push(new Barco("b4",4));
		this.flota["b2"]=new Barco("b2",2);
		this.flota["b4"]=new Barco("b4",4);
		// otros barcos: 1, 3, 5,...
	}
	this.obtenerFlota=function(){
		return this.flota;
	}
	this.colocarBarco=function(nombre,x,y){
		//comprobar fase
		if (this.partida.fase=="desplegando"){
			let barco=this.flota[nombre];
			this.tableroPropio.colocarBarco(barco,x,y);
		}
	}
	this.todosDesplegados=function(){
		for(var key in this.flota){
			if (!this.flota[key].desplegado){
				return false;
			}
		}
		return true;
	}
	this.barcosDesplegados=function(){

		if(this.partida){
			this.partida.barcosDesplegados();
		}
		
	}
	this.disparar=function(x,y){
		this.partida.disparar(this.nick,x,y);
	}
	this.meDisparan=function(x,y){
		return this.tableroPropio.meDisparan(x,y);
	}
	this.obtenerEstado=function(x,y){
		return this.tableroPropio.obtenerEstado(x,y);
	}

	this.obtenerEstadoMarcado=function(x,y){
		return this.tableroRival.obtenerEstado(x,y);
	}
	this.marcarEstado=function(estado,x,y){
		this.tableroRival.marcarEstado(estado,x,y);
		if (estado=="agua"){
			this.partida.cambiarTurno(this.nick);
		}
	}
	this.flotaHundida=function(){
		for(var key in this.flota){
			if (this.flota[key].estado!="hundido"){
				return false;
			}
		}
		return true;
	}
	this.obtenerBarcoDesplegado=function(nombre){
		return this.flota[nombre].desplegado
	}

	this.logAbandonarPartida = function(jugador,codigo){

        this.juego.insertarLog({"operacion":"abandonarPartida","usuario":jugador.nick,"codigo":codigo,"fecha":Date()},function(){

            console.log("Registro de log(abandonar) insertado");

        });
}
}

function Partida(codigo,usr){
	this.codigo=codigo;
	this.owner=usr;
	this.jugadores=[];
	this.fase="inicial"; //new Inicial()
	this.maxJugadores=2;
	this.agregarJugador=function(usr){
		let res=this.codigo;
		if (this.hayHueco()){
			this.jugadores.push(usr);
			console.log("El usuario "+usr.nick+" se une a la partida "+this.codigo);
			
			usr.juego.insertarLog({ "operacion": "abandonarPartida", "propietario": usr.nick, "fecha": Date() }, function () {
				console.log("Registro de log insertado");
			});
		
	
			usr.partida=this;
			usr.inicializarTableros(10);
			usr.inicializarFlota();
			this.comprobarFase();
		}
		else{
			res=-1;
			console.log("La partida está completa")
		}
		return res;
	}
	this.comprobarFase=function(){
		if (!this.hayHueco()){
			this.fase="desplegando";
		}
	}
	this.hayHueco=function(){
		return (this.jugadores.length<this.maxJugadores)
	}
	this.estoy=function(nick){
		for(i=0;i<this.jugadores.length;i++){
			if (this.jugadores[i].nick==nick){
				return true
			}
		}
		return false;
	}
	this.esJugando=function(){
		return this.fase=="jugando";
	}
	this.esDesplegando=function(){
		return this.fase=="desplegando";
	}
	this.esFinal=function(){
		return this.fase=="final";
	}
	
	this.flotasDesplegadas=function(){
		for(i=0;i<this.jugadores.length;i++){
			if (!this.jugadores[i].todosDesplegados()){
				return false;
			}
		}
		return true;
	}
	this.barcosDesplegados=function(){
		if (this.flotasDesplegadas()){
			this.fase="jugando";
			this.asignarTurnoInicial();
		}
	}
	this.asignarTurnoInicial=function(){
		this.turno=this.jugadores[0];
	}
	this.cambiarTurno=function(nick){
		this.turno=this.obtenerRival(nick);
	}
	this.obtenerRival=function(nick){
		let rival;
		for(i=0;i<this.jugadores.length;i++){
			if (this.jugadores[i].nick!=nick){
				rival=this.jugadores[i];
			}
		}
		return rival;
	}
	this.obtenerJugador=function(nick){
		let jugador;
		for(i=0;i<this.jugadores.length;i++){
			if (this.jugadores[i].nick==nick){
				jugador=this.jugadores[i];
			}
		}
		return jugador;
	}
	this.disparar=function(nick,x,y){
		let atacante=this.obtenerJugador(nick);
		if (this.turno.nick==atacante.nick){
			let atacado=this.obtenerRival(nick);
			let estado= atacado.meDisparan(x,y);
			//let estado=atacado.obtenerEstado(x,y);
			atacante.marcarEstado(estado,x,y);
			this.comprobarFin(atacado);
		}	
		else{
			console.log("No es tu turno")
		}
	}
	this.comprobarFin=function(jugador){
		if (jugador.flotaHundida()){
			this.fase="final";
			console.log("Fin de la partida");
			console.log("Ganador: "+this.turno.nick);
		}
	}
	this.agregarJugador(this.owner);
	this.abandonarPartida = function (jugador) {

        if (jugador) {



            rival = this.obtenerRival(jugador.nick)

            this.fase = "final";

            console.log("Fin de la partida");

            console.log("Ha abandonado el jugador " + jugador.nick);

            if(rival){

            console.log("Ganador: " + rival.nick);

            }

            jugador.logAbandonarPartida(jugador,this.codigo);




        }

    }
}



function Tablero(size){
	this.size=size; //filas=columnas=size
	this.casillas;
	this.crearTablero=function(tam){
		this.casillas=new Array(tam);
		for(x=0;x<tam;x++){
			this.casillas[x]=new Array(tam);
			for(y=0;y<tam;y++){
				this.casillas[x][y]=new Casilla(x,y);
			}
		}
	}
	this.colocarBarco=function(barco,x,y){
		// if (this.casillasLibres(x,y,barco.tam)){
		// 	for(i=x;i<barco.tam;i++){
		// 		this.casillas[i][y].contiene=barco;
		// 	}
		// 	barco.desplegado=true;
		// }
		barco.colocar(this,x,y);
	}
	this.casillasLibres=function(x,y,tam){
		for(i=x;i<tam;i++){
			let contiene=this.casillas[i][y].contiene;
			if (!contiene.esAgua()){
				return false;
			}
		}
		return true;
	}
	this.meDisparan=function(x,y){
		return this.casillas[x][y].contiene.meDisparan(this,x,y);
	}

	this.ponerAgua=function(x,y){
		 this.casillas[x][y].contiene= new Agua();
	}
	this.obtenerEstado=function(x,y){
		return this.casillas[x][y].contiene.obtenerEstado();
	}
	this.marcarEstado=function(estado,x,y){
		this.casillas[x][y].contiene.estado=estado;
	}
	this.crearTablero(size);
}

function Casilla(x,y){
	this.x=x;
	this.y=y;
	this.contiene=new Agua();
}

function Barco(nombre,tam){ //"b2" barco tamaño 2
	this.nombre=nombre;
	this.tam=tam;
	this.orientacion= new Horizontal(); //horizontal, vertical...
	this.desplegado=false;
	this.estado="intacto";
	this.disparos=0;
	this.casillas = {}; //en vez de []
	this.esAgua=function(){
		return false;
	}
	this.meDisparan = function (tablero, x, y) {
        //this.disparos++;
        //if (this.casillas[x] == 'intacto') { //Cambiado, puede no ser necesario este if
            this.estado = "tocado";
            this.casillas[x] = 'tocado'
			console.log("Tocado")
        //}
        if (this.comprobarCasillas()) {
            this.estado = "hundido";
			console.log("Hundido")
        }
        //tablero.ponerAgua(x, y);
        return this.estado;
    }
	this.posicion = function (x, y) {
        this.x = x;
        this.y = y;
        this.desplegado = true;
		this.iniCasillas()
		//console.log(this)
    }
	this.colocar = function(tablero,x,y){
		//console.log(this,tablero,x,y)
		this.orientacion.colocarBarco(this,tablero,x,y);
	}
	this.comprobarCasillas = function () { //Esto puede dejar de funcionar si tenemos formas raras de los barcos
        for (i = 0; i < this.tam; i++) {
            if (this.casillas[this.x + i] == 'intacto') {
                return false;
            }
        }
        return true;
    }

	this.iniCasillas = function () { //Ha cambiado todo esto al ser un array asociativo
        for (i = 0; i < this.tam; i++) {
            this.casillas[i+this.x] = "intacto"; //cambiado
        }
    }
	this.obtenerEstado=function(){
		return this.estado;
	}
}

function Horizontal() {
	this.nombre="horizontal"
	this.colocarBarco=function(barco,tablero,x,y){
		console.log(barco,tablero,x,y)
        if (tablero.casillasLibres(x,y,barco.tam)){
            for(i=0;i<barco.tam;i++){
                tablero.casillas[i+x][y].contiene=barco;
            }
            barco.posicion(x,y);
            //barco.desplegado=true;
        }
    }
	this.esHorizontal = function(){
		return true;
	}
	this.esVertical = function(){
		return false;
	}

}

function Agua(){
	this.nombre="agua";
	this.estado="agua";
	this.esAgua=function(){
		return true;
	}
	this.meDisparan=function(tablero,x,y){
		console.log("agua");
		return this.estado;
	}
	this.obtenerEstado=function(){
		return this.estado;
	}
}

//module.exports.Juego = Juego;
module.exports.Juego=Juego;
