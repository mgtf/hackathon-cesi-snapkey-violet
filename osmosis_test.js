var osmosis = require('osmosis');
const fs = require('fs');

var result;
var txt = './content.json';
var res;


function getSurfacePriceContent() {
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

getSurfacePriceContent().then(res => {
  var surface, loyer, msquare_an;
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
  console.log(res);
  console.log(msquare_an);
  result = res;


  // fs.writeFile('test.json', data, function(erreur) {
  //   if (erreur) {
  //     console.log(erreur);
  //   }
  // })

  var data = JSON.parse(txt);
  data.push(res)
  txt = JSON.stringify(data);

  console.log(res, data, txt);
});
