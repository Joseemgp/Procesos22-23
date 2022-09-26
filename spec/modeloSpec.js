describe("El juego...", function() {
  var miJuego;
  var usr1,usr1;

  beforeEach(function() {
    miJuego=new Juego();
    miJuego.agregarUsuario("pepe");
    miJuego.agregarUsuario("luis");
    usr1=miJuego.usuarios["pepe"];
    usr2=miJuego.usuarios["luis"];
  });

  it("Inicialmente", function() {
    let lista=miJuego.obtenerPartidas();
    expect(lista.length).toEqual(1);
    expect(usr1.nick).toEqual("pepe");
    expect(usr2.nick).toEqual("luis");
    });


    beforeEach(function() {
      miJuego=new Juego();
      miJuego.agregarUsuario("pepe");
      miJuego.agregarUsuario("luis");
      usr1=miJuego.usuarios["pepe"];
      usr2=miJuego.usuarios["luis"];
      usr1.crearPartida("pepe")
    });
  
    it("Inicialmente2", function() {
      let lista=miJuego.obtenerPartidas();
      expect(usr1.nick).toEqual("pepe");
      expect(usr2.nick).toEqual("luis");
      expect(lista.length).toEqual(1);
      });


});
