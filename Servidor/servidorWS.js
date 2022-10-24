function ServidorWS(){
    //peticiones



    //gestionar peticiones
    this.lanzarServidorWS=function(io,juego){
        io.on('connection', (socket) => {
            console.log('usuario conectado');
          });
          
    }
}

module.exports.ServidorWS=ServidorWS;