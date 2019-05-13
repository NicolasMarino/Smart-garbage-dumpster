const garbage = require('../model/garbage');

var fs = require('fs');
//Buscar residuo por ID /api/residuo/:residuoId
function getGarbageID(req, res) {
    let residuoId = req.params.residuoId;

    garbage.findById(residuoId, (err, garbage) => {
        if (err) return res.status(500).send({
            message: `error al realizar la peticion : ${err}`
        });
        if (!garbage) return res.status(404).send({
            message: `No existe el producto`
        });

        res.status(200).send({
            garbage
        });
    });
};

//Buscar residuo por nombre_residuo /api/residuo/nom/:nom_residuo
function getGarbageNR(req, res) {
    var name = req.params.nom_residuo;
    garbage.findOne({
        "nombre_residuo": name
    }, (err, name) => {
        if (err) {
            return res.status(500).send({
                message: `error al realizar la peticion : ${err}`
            });
        }
        res.json(name);
    });
};

//Buscar residuo por nombre_residuo /api/residuo/nom/:nom_residuo
function getGarbage(req, res) {

    garbage.find({}, (err, residuos) => {
        if (err) return res.status(500).send({
            message: `error al realizar la peticion : ${err}`
        });
        if (!garbage) return res.status(404).send({
            message: `No existen productos`
        });
        res.status(200).send({
            residuos
        });
    });
};

//Guardar tipos de basura /api/residuo/
//No lo usamos por ahora
function saveGarbage(req, res) {

    let residuo = new garbage();
    residuo.nombre_residuo = req.body.nombre_residuo;
    residuo.tipo_residuo = req.body.tipo_residuo;
    residuo.descripcion = req.body.descripcion;

    residuo.save((err, residuoStored) => {
        if (err) res.status(500).send({
            message: `error al almacenar datos : ${err}`
        })
        else res.status(200).send({
            residuo: residuoStored
        })
    });
};

function deleteR(req, res) {
    garbage.deleteMany({});
};
//Guardar archivo basura.txt /api/residuo/archivo/:nom_residuo_file
function saveFilen(req, res) {

    var dataName = req.params.nom_residuo_file;
    const dataCuatro = 4;

    var fs = require("fs");
    let path = "basura.txt";
    fs.writeFile(path, dataName, (err) => {
        if (err) throw err;
        console.log('guardado el: ' + dataName);
    });

    setTimeout(function () {
        fs.writeFile(path, dataCuatro, (err) => {
            if (err) throw err;
            console.log('guardado el 4');
        });
    }, 5000);

    res.status(200).send("Correcto");
};

function nlp(req, res) {

    var name = req.params.nom_residuo;

    var natural = require('natural');
    var classifier = new natural.BayesClassifier();
    var tokenizer = new natural.WordTokenizer();

    var tengoUna = tokenizer.tokenize(name);

    classifier.addDocument('tengo', 'intencion');
    classifier.addDocument('un', 'intencion');
    classifier.addDocument('una', 'intencion');
    classifier.addDocument('uno', 'intencion');
    classifier.addDocument('quiero tirar', 'intencion');
    //classifier.addDocument('botella', 'residuo');

    var fs = require('fs');
    var data = fs.readFileSync('./resources/data.json', 'utf8');
    var words = JSON.parse(data);

    words.residuos.forEach(element => {
        
        classifier.addDocument(element.nombre_residuo.normalize('NFD').replace(/[\u0300-\u036f]/g, ""), element.tipo_residuo.normalize('NFD').replace(/[\u0300-\u036f]/g, ""));
        //console.log(element.nombre_residuo);
    });
    
    //Si quiero levantar la data, lo hago desde acá
    /* natural.BayesClassifier.load('./resources/dataToClassify.json', null, function(err, classifier) {
         //classifier.addDocument(classifiers);
         //console.log(classifier);
     });
     ;*/

    classifier.train();
    //Si quiero guardar lo que se "entrenó"
    //classifier.save('./resources/dataToClassify.json', function(err, classifier) {});
    var residuos ="";
    tengoUna.forEach(element => {
        console.log('\x1b[35m%s\x1b[0m', element);
        console.log(classifier.getClassifications(element));
        console.log('\x1b[36m%s\x1b[0m', classifier.classify(element), "\x1b[0m");      
        var categoria = classifier.classify(element);  
        if(categoria === "residuo"){
            residuos += element +"-";
        }
    });

    res.status(200).send(residuos);
};

module.exports = {
    deleteR,
    getGarbageID,
    getGarbage,
    getGarbageNR,
    saveGarbage,
    saveFilen,
    nlp
};