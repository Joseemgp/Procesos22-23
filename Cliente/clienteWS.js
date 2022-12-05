function ClienteWS(){
    this.socket;
    this.codigo;
        //enviar peticiones
        this.conectar=function(){
            this.socket=io();
            this.servidorWS();
        }

        this.crearPartida=function(){
            this.socket.emit("crearPartida",rest.nick);
        }

        this.unirseAPartida=function(codigo){
            this.socket.emit("unirseAPartida",rest.nick,codigo)
        }

        this.abandonarPartida=function(){
            this.socket.emit("abandonarPartida",rest.nick,cws.codigo)
        }
       this.colocarBarco=function(nombre,x,y){
            this.socket.emit("colocarBarco",rest.nick, nombre, x,y)
        }
        this.barcosDesplegados=function(){ //let data={"nick":rest.nick,"nombre":nombre,"x":x,"y":y}
            this.socket.emit("barcosDesplegados",rest.nick)

        }
        this.disparar=function(x,y){
            this.socket.emit("disparar",rest.nick,x,y)
        }

        //gestionar peticiones 
        this.servidorWS=function(){
            let cli=this;

            this.socket.on("partidaCreada",function(data){
                console.log(data);
                if(data.codigo!=-1){
                   
                    console.log("Partida creada con codigo"+data.codigo+"por el usuario"+rest.nick)
                    iu.mostrarCodigo(data.codigo);
                    cli.codigo=data.codigo;
                }else{
                    console.log("No se ha podido crear la partida")
                    iu.mostrarModal
                    rest.comprobarUsuario();
                }
            })
            this.socket.on("unidoAPartida",function(data){
                if (data.codigo!=-1){
                    console.log("Usuario "+rest.nick+" se une a partida codigo: "+data.codigo);
                    iu.mostrarCodigo(data.codigo);
                    //ws.nick=data.nick;
                    //$.cookie("nick",ws.nick);
                    //iu.mostrarHome(data);
                    cli.codigo=data.codigo;
                }
                else{
                    console.log("No se ha podido unir a partida")
                    //iu.mostrarModal("El nick ya está en uso");
                    //iu.mostrarAgregarJugador();
                }
            })

            this.socket.on("actualizarListaPartidas",function(lista){
                if (!cli.codigo){
                    iu.mostrarListaDePartidasDisponibles(lista);
                }
            });
            this.socket.on("faseDesplegando",function(data){
                tablero.flota=data.flota;
                console.log("ya puedes desplegar la flota");
                //aqui tengo que llamar a las funciones de tablero
                tablero.elementosGrid();
                tablero
            })

            /*this.socket.on("esperandoRival",function()){
                    console.log("")
            }*/
            
            this.socket.on("aJugar",function(){
                iu.mostrarModal("A jugaaar!");
            })

            this.socket.on("barco colocado",function(res){
                if (res.colocado){
                    let barco=tablero.flota[res.barco];
                    console.log(barco);
                    tablero.puedesColocarBarco(barco);
                }else{
                    iu.mostrarModal("No se puede colocar barco")
                }
            })



            
        }
}