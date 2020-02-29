var osmosis = require('osmosis');

function getSurfaceContent() {
 // Return a promise as execution of request is time-dependent
 return new Promise((resolve, reject) => {
   let response = [];

   osmosis
     // Tell Osmosis to load steemit.com
     .get('https://www.pointdevente.fr/fr/cession-de-bail-et-fonds-de-commerce/paris/halles-beaubourg/p_51267')
     // We want to get the metatags in head, so provide the head element as a value to find
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
  res.pop();
  console.log(res);
});
