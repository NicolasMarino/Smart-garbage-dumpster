var express = require('express');
var path = require('path');

var mongoose = require('mongoose');
var indexRouter = require('./routes/index');


var app = express();

app.set('port', process.env.PORT || 3000);
app.use('/api/residuo', require('./routes/garbage.routes.js'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.use('/', indexRouter);

//conexion bd
mongoose.connect('mongodb+srv://nico:toor@sgd-ftwrh.mongodb.net/reciclaje', { useNewUrlParser: true }, function (err, res) {
    if (err) {
        return console.log(`Error al conectarse a la bd: ${err}`);
    }
    console.log('Conexion a la bd establecida');
});


app.listen(app.get('port'),() =>{
  console.log('Server on port', "http://localhost:"+app.get('port'));
});