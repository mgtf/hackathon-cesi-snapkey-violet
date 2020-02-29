// author : Kvntn
// license : MIT
// git : http://github.io/Kvntn

var osmosis = require('osmosis');
const fs = require('fs');
const spawn = require("child_process").spawn;
const process = spawn("python", ["json_csv.py"]);


//var content = require('./content.json');
var txt = './content.json';

var data = [];
var res;
let response = [];
var link = 'https://www.pointdevente.fr/fr/cession-de-bail-et-fonds-de-commerce/paris/rivoli/p_47109';

function getSurfacePriceContent() {
 // Return a promise as execution of request is time-dependent
  return new Promise((resolve, reject) => {
   osmosis
     // Tell Osmosis to load pointdevente.fr
     .get(link)
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

function getArea() {
 // Return a promise as execution of request is time-dependent
  return new Promise((resolve, reject) => {
   osmosis
     .find('.block-info')
     .set({
         code_postal: '75001'
     })

     .data(res => response.push(res))
     .error(err => reject(err))
     .done(() => resolve(response));
 });
}

function json_to_csv(data) {
  return new Promise((resolve, reject) =>{
      process.stdout.on("data", data =>{
          resolve(data.toString()); // <------------ by default converts to utf-8
      })
      process.stderr.on("data", reject)
  })
  .catch((err) => {
      console.log("error here: " + err)
  });
}

getSurfacePriceContent().then(res => {
  return new Promise((resolve, reject) => {
    var surface, loyer, msquare_an, tmp_elem, tmp_value;
    let out = [];
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

    res.forEach((item, i) => {
      tmp_elem = res[i].label;
      tmp_value = item.valeur;
      res[tmp_elem] = tmp_value;
    });
    // res = out;

    msquare_an = loyer*12/surface;
    res.push({
      m2_by_yr: parseFloat(msquare_an.toFixed(2))
    })


    fs.appendFileSync(txt, JSON.stringify(res), (err) => {
    	if (err) reject(err);
      else resolve(res);
    });
  })
  .then((res) => {
      console.log("results here: " + JSON.stringify(res))
      json_to_csv(res);
  })
  .catch((err) => {
      console.log("error here: " + err)
  });

  module.exports = res;
});
