const express = require("express");
const router = express.Router();
const garbage = require("../model/garbage");

router.get("/", (req, res) => {
  garbage.find({}, (err, residuos) => {
    if (err)
      return res.status(500).send({
        message: `error al realizar la peticion : ${err}`
      });
    if (!garbage)
      return res.status(404).send({
        message: `No existen productos`
      });
    res.status(200).send({
      residuos
    });
  });
});

router.get("/archivo/:num", (req, res) => {
  var SerialPort = require("serialport");

  var arduinoSerialPort = new SerialPort("COM6", {
    baudRate: 9600,
    // defaults for Arduino serial communication
    dataBits: 8,
    parity: "none",
    stopBits: 1,
    flowControl: false
  });

  var buf = Buffer.from(req.params.num);
  var bufferCuatro = Buffer.from("4");
  arduinoSerialPort.on("open", function() {
    console.log("Serial Port is opened.");
    setTimeout(function() {
      arduinoSerialPort.write(buf, function(err) {
        if (err) {
          return console.log("Error on write: ", err.message);
        }
        console.log("message written");
      });
    }, 2000);
    setTimeout(function() {
      arduinoSerialPort.write(bufferCuatro, function(err) {
        if (err) {
          return console.log("Error on write: ", err.message);
        }
        console.log("message written");
      });
      setTimeout(function() {
        arduinoSerialPort.close();
      }, 1000);
    }, 6000);
  });

  arduinoSerialPort.on("err", function(err) {
    console.log(err.message);
  });
  arduinoSerialPort.on("close", function() {
    console.log("CLOSE");
    //open(); // reopen
  });
  // arduinoSerialPort.write(req.params.num);
  res.send("lesto");
});

router.get("/nom/:nom_residuo", (req, res) => {
  var name = req.params.nom_residuo;
  garbage.findOne(
    {
      nombre_residuo: name
    },
    (err, name) => {
      if (err) {
        return res.status(500).send({
          message: `error al realizar la peticion : ${err}`
        });
      }
      res.json(name);
    }
  );
});

module.exports = router;
