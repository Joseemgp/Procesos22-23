function ClienteWS(){
    this.socket=io();
    
        //enviar peticiones
        this.conectar=function(){
            this.socket=io();
            this.servidorWS();
        }

        this.crearPartida=function(){
            this.socket.emit("crearPartida",rest.nick);
        }

        this.unirseAPartida=function(){
            this.socket.emit("unirseAPartida",rest.nick,cws.codigo)
        }

        //gestionar peticiones 
        this.servidorWS=function(){
            let cli=this;

            this.socket.on("partidaCreada",function(data){
                console.log(data);
                if(data.codigo!=-1){
                   
                    console.log("Partida creada con codigo"+data.codigo+"por el usuario"+data.nick)
                    iu.mostrarCodigo(data.codigo);
                    
                }else{
                    console.log("No se ha podido crear la partida")
                }
            })
            this.socket.on("unidoAPartida",function(data){
                if (data.codigo!=-1){
                    console.log("Usuario "+cli.nick+" se une a partida codigo: "+data.codigo);
                    iu.mostrarCodigo(data.codigo);
                    //ws.nick=data.nick;
                    //$.cookie("nick",ws.nick);
                    //iu.mostrarHome(data);
                }
                else{
                    console.log("No se ha podido unir a partida")
                    //iu.mostrarModal("El nick ya está en uso");
                    //iu.mostrarAgregarJugador();
                }
            })
            
        }
}