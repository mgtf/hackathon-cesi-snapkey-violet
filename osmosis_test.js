var osmosis = require('osmosis');
const fs = require('fs');

var result;
var test = 'test';
var res;

function getSurfaceContent() {
  // Return a promise as execution of request is time-dependent
  return new Promise((resolve, reject) => {
    let response = [];

    osmosis
        // Tell Osmosis to load pointdevente.fr
        .get('https://www.pointdevente.fr/fr/cession-de-bail-et-fonds-de-commerce/paris/rivoli/p_47109')
        .find('.block-info')

        // Set creates our final object of data we will get calling .data
        // the secondary values for these are select lookups. We are saying find meta tag with this property and return its content
        .set({
          label: '.label-info',
          valeur: '.content-info'
        })
        // Store a copy of the above object in our response variable
        .data(res => response.push(res))
        // If we encounter an error we will reject the promise
        .error(err => reject(err))
        // Resolve the promise with our response object
        .done(() => resolve(response));
  });
}

getSurfaceContent().then(res => {
  var surface, loyer, msquare_an;
  var jsonData =
      {
        "index" : "",
        "type_de_bien" : "",
        "code_postal" : "",
        "prix_m2_an": "",
        "surface": ""
      };
  // var jsonData = [];
  //
  // jsonData.push(jsonFormat);
  // jsonData[i].index = i+1;

  res.pop();

  res.forEach((item, i) => {
    if (item.label === 'Totale') {
      surface = parseInt(item.valeur);
    }

    if (item.label.indexOf('Loyer') == 0) {
      item.valeur = item.valeur.replace(" ", "");
      loyer = parseInt(item.valeur);
    }
  });

  msquare_an = loyer*12/surface;
  jsonData.prix_m2_an = msquare_an.toFixed(2) + "€ / m² / an";
  jsonData.index = 1;
  jsonData.type_de_bien = "Comemrce";
  jsonData.code_postal = "75001";
  jsonData.surface = surface;

  console.log(msquare_an);
  console.log(jsonData);
  result = res;

  let donnees = JSON.stringify(jsonData);
  fs.writeFile('test.json', donnees, function(erreur) {
    if (erreur) {
      console.log(erreur);
    }
  })


});
