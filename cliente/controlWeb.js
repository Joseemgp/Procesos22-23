function ControlWeb(){
//pon el fondo de color azul claro
    $('body').css('background-color','#e6f2ff');
  

   this.comprobarCookie=function(){
       
        if($.cookie("nick")){
            rest.nick=$.cookie("nick")
            rest.comprobarUsuario();
           //cws.conectar();
           //this.mostrarHome();
        }else{
           
        this.mostrarAgregarUsuario();
        }
    }
    
    this.mostrarAgregarUsuario=function(){
        $('#mAU').remove();
        $('#mInf').remove();
        var cadena= '<div class="row" id="mAU">';//'<form class="form-row needs-validation"  id="mAJ">';
        //Muestra el titulo de Batalla Naval arriba en el centro de la Página

        cadena=cadena+'<div class="row"><h2>Batalla Naval </h2></div>';
     
       
        cadena=cadena+'<div class="row">';
        cadena=cadena+'<div class="col">'
        
        cadena=cadena+'<div class="col"></div>';
        cadena=cadena+'<input type="text" class="form-control mb-2 mr-sm-2" id="usr" placeholder="Introduce tu nick (max 6 letras)" required></div>';
        cadena=cadena+'<div class="col">';
        cadena=cadena+'<button id="btnAU" class="btn btn-primary mb-2 mr-sm-2">Iniciar sesión</button>';
        cadena=cadena+'<a href="/auth/google" class="btn btn-primary mb-2 mr-sm-2">Accede con Google</a>';
        cadena=cadena+'</div></div>'; //' </form>';
        cadena=cadena+'<div id="nota"></div></div>';
        cadena=cadena +  '<div class="row"><h7>Este proyecto se basa en el Proyecto de la Asignatura de Ingeniería del Software creado por Jose Antonio Gallud Lázaro</h7></div>'

        $("#agregarUsuario").append(cadena);     
          

        $("#btnAU").on("click",function(e){
            if ($('#usr').val() === '' || $('#usr').val().length>6) {
                e.preventDefault();
                $('#nota').append('Nick inválido');
            }
            else{
                var nick=$('#usr').val();
                $("#mAU").remove();
                //$("#aviso").remove();
                rest.agregarUsuario(nick);
                
            }
        })

        
    }
    this.mostrarHome=function(){
        $('#mH').remove();
        $('#gc').remove();
        let cadena= '<div clas="row" id="mH">';//'<form class="form-row needs-validation"  id="mAJ">';
        cadena=cadena+'<div class="col">'
       
        cadena=cadena+'<div class="row" style="background-color:#e6ffe6">';
        cadena=cadena+"<p>Bienvenido "+rest.nick+"</p>";
        cadena=cadena+'<button id="btnS" class="btn btn-primary mb-2 mr-sm-2">Salir</button>'
     

        
    

        cadena=cadena+'</div></div>'
        cadena=cadena+"<div id='codigo'></div>"
        cadena=cadena+'</div></div>'
        $('#agregarUsuario').append(cadena);
        this.mostrarCrearPartida();
        rest.obtenerListaPartidasDisponibles();
        
        $("#btnS").on("click",function(){
            //var nick=$('#usr').val();
            
           /* $('#mLP').remove();
            $("#aviso").remove();
            rest.crearPartida();*/
            $('#mCP').remove();
            $('#mLP').remove();
            $('#mH').remove();
            
            $.removeCookie("nick");
            iu.comprobarCookie();
            rest.usuarioSale();
            $('#gc').remove();
            
        });

        
}

    this.mostrarCrearPartida=function(){
        $('#mCP').remove();
//dibujar un boton , que al hacer click llame a crear partida de rest
        let cadena= '<div class="row" id="mCP">';//'<form class="form-row needs-validation"  id="mAJ">';
        cadena=cadena+'<div class="col">'
        cadena=cadena+'<button id="btnCP" class="btn btn-primary mb-2 mr-sm-2">Crear Partida</button>';
        
        cadena=cadena+'</div></div>';
        //cadena=cadena+'<div id="nota2"></div></div></div>';


        $("#crearPartida").append(cadena);     
        //$("#nota").append("<div id='aviso' style='text-align:right'>Inicia sesión con Google para jugar</div>");    

        $("#btnCP").on("click",function(e){
                //var nick=$('#usr').val();
                $("#mCP").remove();
                $('#mLP').remove();
                //$("#aviso").remove();
                //rest.crearPartida();
                cws.crearPartida();
            }
        )
    }

    this.mostrarCodigo=function(codigo){
        let cadena="Codigo de la partida: " + codigo;
        $('#codigo').append(codigo);
        iu.mostrarAbandonarPartida();
    }
    
        //crear un control visual tipo lista para mostrar la lista de partida y permitir unirse con un click a la partida seleccionada
        this.mostrarListaDePartidas=function(lista){
            $('#mLP').remove();
            let cadena="<div id='mLP'>";
            cadena=cadena+'<ul class="list-group">';
            for(i=0;i<lista.length;i++){
              cadena = cadena+'<li class="list-group-item">'+lista[i].codigo+' propietario: '+lista[i].owner+'</li>';
            }
            cadena=cadena+"</ul>";
            cadena=cadena+"</div>"
            $('#listaPartidas').append(cadena);
            
    
        }

        this.mostrarListaDePartidasDisponibles=function(lista){
            $('#mLP').remove();
            let cadena="<div class='row' id='mLP'>";
            cadena=cadena+"<div class='col'>";
            cadena=cadena+"<h3>Lista de partidas disponibles</h3>";
           
            cadena=cadena+'<ul class="list-group">';
            for(i=0;i<lista.length;i++){
              cadena = cadena+'<li class="list-group-item"><a href="#" value="'+lista[i].codigo+'"> Nick propietario: '+lista[i].owner+'</a></li>';
            }
            cadena=cadena+"</ul>";
            cadena=cadena+"</div></div>"
            $('#listaPartidas').append(cadena);
    
            $(".list-group a").click(function(){
                codigo=$(this).attr("value");
                   console.log(codigo);
                if (codigo){
                    $('#mLP').remove();
                    $('#mCP').remove();
                    cws.unirseAPartida(codigo);
                }
            });	
            $("#btnAL").on("click",function(e){		
                rest.obtenerListaPartidasDisponibles();
            })	
        }
        this.mostrarModal=function(titulo,msg){
            $('#mM').remove();
            $('#cT').remove();
            var cadena2="<div id='cT'>"+titulo+"</div>";
             cadena="<p id='mM'>"+msg+"</p>";
             $('#titulo').append(cadena2);
            $('#contenidoModal').append(cadena);
            $('#miModal').modal("show");
        }
        this.finPartida = function(){

            $('#mH').remove()
    
            cws.codigo = undefined;
    
            $('#gc').remove();
    
            tablero = new Tablero(10);
    
            this.mostrarHome()
    
        }

        this.mostrarAbandonarPartida = function(){
             $('#mAbP').remove();
    let cadena = '<div class="row" id="mAbP">';
    cadena = cadena + '<div style="margin-top:15px" class="col">'
    cadena = cadena + '<button id="btnAbP" class="btn btn-primary mb-2 mr-sm-2">Abandonar Partida</button>';
    cadena = cadena + '</div>'
    cadena = cadena + '</div>'
     $('#codigo').append(cadena);
    $("#btnAbP").on("click", function (e) {
    cws.abandonarPartida();

            })
    
        }


}