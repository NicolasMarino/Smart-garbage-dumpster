var Residuo = require('../model/garbage');

var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://nico:toor@sgd-ftwrh.mongodb.net/reciclaje')

var residuos =  [
    new Residuo({
        nombre_residuo: 'folletos',
        tipo_residuo: 'azul'
    })
];
//seeder doesnt run in the app ,

var done = 0;
//loop para guardar las cosas
//Despues desconectarse cuando termine de registrar los productos
for(var i=0; i< residuos.length;i++){
    residuos[i].save(function (err, result) {
        done++;
        if(done== residuos.length){
            console.log('data added');
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}








