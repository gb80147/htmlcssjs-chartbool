function getSales() {                                       //funzione che prende i dati dal server

  $.ajax({

    url: "http://157.230.17.132:4004/sales",
    method: "GET",                                          //(GET)= legge i dati
    success: function (data) {

      var resLine = getDataForLineChart(data);               //organizzo i dati con la funzione "getDataForLineChart"
      createLineChart(resLine);                              //chiamo la funzione inserendogli i dati

      var resPie = getDataForPieChart (data);                //organizzo i dati con la funzione "getDataForPieChart"
      createPieChart(resPie);                                //chiamo la funzione inserendogli i dati
    },
    error: function (data) {

      console.log("error", data);
    }
  });
}

function getDataForLineChart(data) {

  var months = {                                            //creo un'oggetto con tutti i mesi a parametro zero
    "January": 0,
    "February": 0,
    "March": 0,
    "April": 0,
    "May": 0,
    "June":0,
    "July": 0,
    "August": 0,
    "September": 0,
    "October": 0,
    "November": 0,
    "December": 0,
  };

  for (var i = 0; i < data.length; i++){

    var item = data[i];
    var dataMoment = moment(item.date,"DD-MM-YYYY");        //prendo la stringa data dell'API e la converto in una vera data con moment
    var monthName = dataMoment.format("MMMM");              //estraggo il mese

    months[monthName] += item.amount;                       //aggiunge "amount" al valore iniziale ad ogni mese trovato
  }

  return months;
}

function createLineChart(data){

  var labels = Object.keys(data);                           //prendo la chiave dell'oggetto(es. January)
  var values = Object.values(data);                         //prendo la valore dell'oggetto(es. 0)


  var lineChart = $("#lineChart");
  var chart = new Chart(lineChart, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
          label: 'Vendite totali per mese',
          backgroundColor: 'rgb(91, 106, 130)',
          borderColor: 'rgb(91, 106, 130)',
          data: values,
      }]
    },
  })
  chart.canvas.parentNode.style.height = '700px';
  chart.canvas.parentNode.style.width = '700px';
};

function getDataForPieChart (data){

  var salesman = {};                                        //creo oggetto vuoto

  for (var i = 0; i < data.length; i++){

    var item = data[i];

    if(!salesman[item.salesman]){                           //se non esiste nell'oggetto..

      salesman[item.salesman] = 0;                          //crealo uguale a zero
    }

    salesman[item.salesman] += item.amount;                 //aggiunge "amount" al valore iniziale ad ogni salesman trovato
  };


  return salesman;

};

function createPieChart(data){

  var salesman = Object.keys(data);
  var sales = Object.values(data);

  var pieChart = $("#pieChart");
  var chart = new Chart(pieChart, {


    type: 'pie',
    data: {
      labels: salesman,
      datasets: [{
        label: "Vendite per venditore",
        backgroundColor: [
          'rgb(255, 212, 0)',
          'rgb(255, 0, 0)',
          'rgb(39, 147, 5)',
          'rgb(0, 140, 255)',
        ],
        data: sales,
      }]
    },
    options: {
      title: {
      display: true,
      text: 'Vendite per venditore'
      }
    }
  })
  chart.canvas.parentNode.style.width = '800px';
}

function init() {

  getSales()
}

$(document).ready(init);
