var mongo=require("mongodb").MongoClient;
var ObjectID=require("mongodb").ObjectID;


 
function Cad(){
        this.logs;

        //logs
        this.insertarLog=function(registroLog,callback){
            insertar(this.logs,registroLog,callback);
        }

        this.obtenerLogs=function(callback){
            obtenerTodos(this.logs,callback);
        }
    

        //partidas
        //usuarios
    
        function insertar(coleccion,elemento,callback){
            coleccion.insertOne(elemento,function(err,result){
                if(err){
                    console.log("error");
                }
                else{
                    console.log("Nuevo elemento creado");
                    callback(elemento);
                }
            });
        }
        function obtenerTodos(coleccion,callback){
            coleccion.find().toArray(function(error,col){
                callback(col);
            });
        };

        this.conectar=function(){
            let cad=this;

            //mongodb+srv://batalla:<password>@clusterprocesos.md1mi9n.mongodb.net/?retryWrites=true&w=majority
            mongo.connect("mongodb+srv://batalla:batalla@cluster0.pdc6txj.mongodb.net/?retryWrites=true&w=majority",{ useUnifiedTopology: true },function(err,database){


            if(!err){
                console.log("Conectado a MongoDB Atlas")
                database.db("batalla").collection("logs",function(err,col){
                    if (err){
                        console.log("No se puede obtener la coleccion")
                    }
                    else{       
                        console.log("tenemos la colección logs");                                 
                        cad.logs=col;                                                  
                    }
                });

            }else{
                console.log("No se pudo conectar con MongoDB Atlas")
            }
})

        }
        

     
      
}

module.exports.Cad=Cad;

