let modelo=require("./modelo.js");

describe("El juego...", function() {
  var miJuego;
  var us1,us2,partida;

  beforeEach(function() {
    miJuego=new modelo.Juego();
    miJuego.agregarUsuario("pepe");
    miJuego.agregarUsuario("luis");
    let res=miJuego.jugadorCreaPartida("pepe");
    miJuego.jugadorSeUneAPartida("luis",res.codigo);
    us1=miJuego.obtenerUsuario("pepe");
    us2=miJuego.obtenerUsuario("luis");
    partida=miJuego.obtenerPartida(res.codigo);
  });

  it("comprobamos los nick de los usuarios", function(){
    expect(us1.nick).toEqual("pepe");
    expect(us2.nick).toEqual("luis");
  });

  it("comprobamos que luis y pepe están en la partida",function(){
    expect(partida.estoy("pepe")).toEqual(true);
    expect(partida.estoy("luis")).toEqual(true);
  });

  it("los dos jugadores tienen tablero propio y rival",function(){
    expect(us1.tableroPropio).toBeDefined();
    expect(us2.tableroPropio).toBeDefined();
    expect(us1.tableroRival).toBeDefined();
    expect(us2.tableroRival).toBeDefined();

    expect(us1.tableroPropio.casillas.length).toEqual(10);
    expect(us2.tableroPropio.casillas.length).toEqual(10);

    //habría que recorrer las 5 columnas
    for(x=0;x<5;x++){
      expect(us1.tableroPropio.casillas[x].length).toEqual(10);
    }
  //  expect(us2.tableroPropio.casillas[0].length).toEqual(5);
    
    //habría que recorrer todo el tablero
    expect(us1.tableroPropio.casillas[0][0].contiene.esAgua()).toEqual(true);
  });

  it("los dos jugadores tienen flota (4 barcos, tam 1,2,3 y 4)",function(){
    expect(us1.flota).toBeDefined();
    expect(us2.flota).toBeDefined();
    
    expect(Object.keys(us1.flota).length).toEqual(4);
    expect(Object.keys(us2.flota).length).toEqual(4);
    
    expect(us1.flota["Velero"].tam).toEqual(2);
    expect(us1.flota["PortaAviones"].tam).toEqual(4);
    expect(us1.flota["Crucero"].tam).toEqual(3);
    expect(us1.flota["Canoa"].tam).toEqual(1);

    expect(us2.flota["Velero"].tam).toEqual(2);
    expect(us2.flota["PortaAviones"].tam).toEqual(4);
    expect(us2.flota["Crucero"].tam).toEqual(3);
    expect(us2.flota["Canoa"].tam).toEqual(1);
  });

  it("la partida está en fase desplegando",function(){
    expect(partida.esJugando()).toEqual(false);
    expect(partida.esDesplegando()).toEqual(true);
  });

  describe("A jugar!",function(){
    beforeEach(function(){
      us1.colocarBarco("Velero",0,0); // 0,0 1,0
      us1.colocarBarco("PortaAviones",0,1);// 0,1 1,1 2,1 3,1
      us1.colocarBarco("Crucero",0,2); 
      us1.colocarBarco("Canoa",0,3); 
      us1.barcosDesplegados();
      us2.colocarBarco("Velero",0,0); // 0,0 1,0
      us2.colocarBarco("PortaAviones",0,1);// 0,1 1,1 2,1 3,1
      us2.colocarBarco("Crucero",0,2); 
      us2.colocarBarco("Canoa",0,3); 
      us2.barcosDesplegados();
    });

    it("Comprobar que las flotas están desplegadas",function(){
      expect(us1.todosDesplegados()).toEqual(true);
      expect(us2.todosDesplegados()).toEqual(true);
      expect(partida.flotasDesplegadas()).toEqual(true);
      expect(partida.esJugando()).toEqual(true);
    });

    it("Comprobar jugada que Pepe gana",function(){
      expect(partida.turno.nick).toEqual("pepe");
      //Velero
      expect(us2.tableroPropio.casillas[0][0].contiene.estado).toEqual("intacto");
      expect(us2.tableroPropio.casillas[1][0].contiene.estado).toEqual("intacto");
      //PortaAviones

      expect(us2.tableroPropio.casillas[0][1].contiene.estado).toEqual("intacto");
      expect(us2.tableroPropio.casillas[1][1].contiene.estado).toEqual("intacto");
      expect(us2.tableroPropio.casillas[2][1].contiene.estado).toEqual("intacto");
      expect(us2.tableroPropio.casillas[3][1].contiene.estado).toEqual("intacto");

      //Crucero
      expect(us2.tableroPropio.casillas[0][2].contiene.estado).toEqual("intacto");
      expect(us2.tableroPropio.casillas[1][2].contiene.estado).toEqual("intacto");
      expect(us2.tableroPropio.casillas[2][2].contiene.estado).toEqual("intacto");

      //Canoa
      expect(us2.tableroPropio.casillas[0][3].contiene.estado).toEqual("intacto");


      expect(us2.tableroPropio.casillas[2][0].contiene.estado).toEqual("agua");


      expect(us2.flota["Velero"].estado).toEqual("intacto");
      us1.disparar(0,0);
      expect(us2.flota["Velero"].estado).toEqual("tocado");
      expect(partida.turno.nick).toEqual("pepe");
      us1.disparar(1,0);
      expect(us2.flota["Velero"].estado).toEqual("hundido");

      expect(us2.flota["PortaAviones"].estado).toEqual("intacto");
      us1.disparar(0,1);
      expect(us2.flota["PortaAviones"].estado).toEqual("tocado");
      us1.disparar(1,1);
      expect(us2.flota["PortaAviones"].estado).toEqual("tocado");
      us1.disparar(2,1);
      expect(us2.flota["PortaAviones"].estado).toEqual("tocado");
      us1.disparar(3,1);
      expect(us2.flota["PortaAviones"].estado).toEqual("hundido");

      expect(us2.flota["Crucero"].estado).toEqual("intacto");
      us1.disparar(0,2);
      expect(us2.flota["Crucero"].estado).toEqual("tocado");
      us1.disparar(1,2);
      expect(us2.flota["Crucero"].estado).toEqual("tocado");
      us1.disparar(2,2);
      expect(us2.flota["Crucero"].estado).toEqual("hundido");

      expect(us2.flota["Canoa"].estado).toEqual("intacto");
      us1.disparar(0,3);
      expect(us2.flota["Canoa"].estado).toEqual("hundido");

      expect(partida.esFinal()).toEqual(true);
      expect(us2.flotaHundida()).toEqual(true);
      expect(us1.flotaHundida()).toEqual(false);
    });

    it("Comprobar jugada que Luis gana",function(){
      us1.disparar(3,0);
      expect(partida.turno.nick).toEqual("luis");
      //Velero
      expect(us2.tableroPropio.casillas[0][0].contiene.estado).toEqual("intacto");
      expect(us2.tableroPropio.casillas[1][0].contiene.estado).toEqual("intacto");
      //PortaAviones

      expect(us2.tableroPropio.casillas[0][1].contiene.estado).toEqual("intacto");
      expect(us2.tableroPropio.casillas[1][1].contiene.estado).toEqual("intacto");
      expect(us2.tableroPropio.casillas[2][1].contiene.estado).toEqual("intacto");
      expect(us2.tableroPropio.casillas[3][1].contiene.estado).toEqual("intacto");

      //Crucero
      expect(us2.tableroPropio.casillas[0][2].contiene.estado).toEqual("intacto");
      expect(us2.tableroPropio.casillas[1][2].contiene.estado).toEqual("intacto");
      expect(us2.tableroPropio.casillas[2][2].contiene.estado).toEqual("intacto");

      //Canoa
      expect(us2.tableroPropio.casillas[0][3].contiene.estado).toEqual("intacto");


      expect(us2.tableroPropio.casillas[2][0].contiene.estado).toEqual("agua");

      
      expect(us1.flota["Velero"].estado).toEqual("intacto");
      us2.disparar(0,0);
      expect(us1.flota["Velero"].estado).toEqual("tocado");
      expect(partida.turno.nick).toEqual("luis");
      us2.disparar(1,0);
      expect(us1.flota["Velero"].estado).toEqual("hundido");

      expect(us1.flota["PortaAviones"].estado).toEqual("intacto");
      us2.disparar(0,1);
      expect(us1.flota["PortaAviones"].estado).toEqual("tocado");
      us2.disparar(1,1);
      expect(us1.flota["PortaAviones"].estado).toEqual("tocado");
      us2.disparar(2,1);
      expect(us1.flota["PortaAviones"].estado).toEqual("tocado");
      us2.disparar(3,1);
      expect(us1.flota["PortaAviones"].estado).toEqual("hundido");

      expect(us1.flota["Crucero"].estado).toEqual("intacto");
      us2.disparar(0,2);
      expect(us1.flota["Crucero"].estado).toEqual("tocado");
      us2.disparar(1,2);
      expect(us1.flota["Crucero"].estado).toEqual("tocado");
      us2.disparar(2,2);
      expect(us1.flota["Crucero"].estado).toEqual("hundido");

      expect(us1.flota["Canoa"].estado).toEqual("intacto");
      us2.disparar(0,3);
      expect(us1.flota["Canoa"].estado).toEqual("hundido");

      expect(partida.esFinal()).toEqual(true);
      expect(us1.flotaHundida()).toEqual(true);
      expect(us2.flotaHundida()).toEqual(false);
    });

    it("Comprobar el cambio de turno",function(){
      us1.disparar(3,0);
      expect(partida.turno.nick).toEqual("luis");
    });

    it("Comprobar que no deja disparar sin turno",function(){
      us2.disparar(0,0);
      expect(us1.flota["Velero"].estado).toEqual("intacto");
    });
  });
});