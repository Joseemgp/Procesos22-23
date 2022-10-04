function ClienteRest(){
    this.nick
    this.agregarUsuario=function(nick){
		let cli=this;
        
		$.getJSON("/agregarUsuario/"+nick,function(data){
			//se ejecuta cuando conteste el servidor
			console.log(data);
			if (data.nick!=-1){
                cli.nick=data.nick
                console.log("Usuario"+cli.nick+"registrado")
				//ws.nick=data.nick;
				//$.cookie("nick",ws.nick);
				//iu.mostrarHome(data);
			}
			else{
                console.log("No se ha podido registrar el usuario")
				//iu.mostrarModal("El nick ya está en uso");
				//iu.mostrarAgregarJugador();
			}
		})
	}

    this.crearPartida=function(nickUsuario){
        let cli=this;
        $.getJSON("/crearPartida/"+nickUsuario,function(data){
            console.log(data);
            if(data.codigo!=-1){
                
                console.log("Partida creada con codigo"+data.codigo+"por el usuario"+data.nickUsuario)
                //ws.codigo=data.codigo;
            }else{
                console.log("No se ha podido crear la partida")
            }
        })

    }

    this.crearPartida=function(nick){
        let cli=this;
        $.getJSON("/crearPartida/"+nick,function(data){
            console.log(data);
            if(data.codigo!=-1){
                console.log("Partida creada con codigo"+data.codigo+"por el usuario"+data.nick)
                //ws.codigo=data.codigo;
            }else{
                console.log("No se ha podido crear la partida")
            }
        })

    }

}
