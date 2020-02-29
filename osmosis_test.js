var osmosis = require('osmosis');

function getSurfaceContent() {
 // Return a promise as execution of request is time-dependent
 return new Promise((resolve, reject) => {
   let response = [];


   osmosis
     // Tell Osmosis to load pointdevente.fr
     .get('https://www.pointdevente.fr/fr/cession-de-bail-et-fonds-de-commerce/paris/halles-beaubourg/p_51267')
     .find('.block-info')

     // Set creates our final object of data we will get calling .data
     // the secondary values for these are select lookups. We are saying find meta tag with this property and return its content
     .set({
         element: '.label-info',
         value: '.content-info'
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
  var tmp_elem, tmp_value;
  let out = [];

  res.pop();
  res.forEach((item, i) => {
    tmp_elem = item.element;
    tmp_value = item.value;

    out[tmp_elem] = tmp_value;
  });

  console.log(out);
});
