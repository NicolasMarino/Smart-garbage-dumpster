window.SpeechRecognition =
  window.webkitSpeechRecognition || window.SpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "es-UY";

var btn = document.getElementById("btn1");
var texto = document.createElement("p");
var container = document.getElementById("textbox");

document.body.onkeyup = function(e) {
  if (e.keyCode == 32) {
    btn.disabled = true;
    dictate();
    setTimeout(function() {
      btn.disabled = false;
      container.value = "";
    }, 10000);
  }
};

async function get_mic_data() {
  var query = texto.innerText;

  // Creación de la petición HTTP
  var reqGetDBData = new XMLHttpRequest();
  reqGetDBData.open(
    "GET",
    `/api/residuo/nom/${query}`,
    false
  );
  reqGetDBData.send(null);

  console.table(reqGetDBData.responseText);

  var request = reqGetDBData.responseText;

  var req = new XMLHttpRequest();
  var tipo_amarillo = "amarillo";
  var tipo_azul = "azul";
  var tipo_gris = "gris";
  var tipo_todo = "todo";

  if (request.includes(tipo_gris)) {
    var req = new XMLHttpRequest();

    req.open("GET", `/api/residuo/archivo/1`, false);
    req.send(null);
  } else if (request.includes(tipo_azul)) {
    req.open("GET", `/api/residuo/archivo/2`, false);
    req.send(null);

  } else if (request.includes(tipo_amarillo)) {
    req.open("GET", `/api/residuo/archivo/3`, false);
    req.send(null);
  } else if (request.includes(tipo_todo)) {
    req.open("GET", `/api/residuo/archivo/5`, false);
    req.send(null);
  } else {
    req.open("GET", `/api/residuo/archivo/4`, false);
    req.send(null);
  }

  return console.log(query);
}

const dictate = () => {
  recognition.start();
  recognition.onresult = event => {
    const speechToText = event.results[0][0].transcript;
    texto.textContent = speechToText;
    get_mic_data();
    container.value = texto.innerHTML;
  };
};
