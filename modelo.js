function Juego(){
    this.partidas={};
    this.usuarios={};//array asociativo

    this.agregarUsuario=function(nick){
        if(!this.usuarios[nick]){
            this.usuarios[nick]=new Usuario(nick,this)
        }
    }

    this.eliminarUsuario=function(nick){
        delete this.usuarios[nick];
    }

    this.crearPartida=function(nick){
        //obtener codigo unico
        //crear partida con propietario nick
        //devolver el codigo 
        
    }
}

function Usuario(nick,juego)
{
    this.nick=nick;
    this.juego;
   this.crearPartida=function(){
        this.juego.crearPartida(nick)
   }

}
function Partida(nombre){
    this.codigo=codigo;
}