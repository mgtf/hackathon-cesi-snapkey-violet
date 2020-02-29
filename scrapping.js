var osmosis = require('osmosis');
const fs = require('fs');

var result;
var jsonData = [];

function getSurfaceContent() {
    // Return a promise as execution of request is time-dependent
    return new Promise((resolve, reject) => {
        let response = [];

        osmosis
            // Tell Osmosis to load pointdevente.fr
            .get('https://www.pointdevente.fr/produit.list?search=1&order_by=validated_at&order_by_date=created_on.DESC&order_dir=desc&offset=0&limit=50&layout=1&location=&search_type=1&recherche%5Bsubtransaction%5D=&recherche%5Bsubtransaction%5D=&recherche%5Btransaction%5D=&recherche%5Bsurface_total_min%5D=&recherche%5Bsurface_total_max%5D=&recherche%5Brent_monthly_display_min%5D=&recherche%5Brent_monthly_display_max%5D=&recherche%5Bprice_selling_min%5D=&recherche%5Bprice_selling_max%5D=&recherche%5Bactivity_possible%5D=')
            .find('.content-card')

            // Set creates our final object of data we will get calling .data
            // the secondary values for these are select lookups. We are saying find meta tag with this property and return its content
            .set({
                discrictTitle: '.title',
                postalCode: '.code',
                infoCard: '.info-card'
                // label: '.label-info',
                // valeur: '.content-info'
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

    res.forEach((item, i) => {
        jsonData.push(        {
            "index" : "",
            "type_de_bien" : "",
            "code_postal" : "",
            "prix_m2_an": "",
            "quartier": "",
            "valeur_au_prix": ""
        });

        for(var discrict = 1; discrict <= 20; discrict++){
            if(item.postalCode.includes(discrict)){
                jsonData[i].code_postal = 75000 + discrict;
            }
        }

        item.infoCard = item.infoCard.split('\n');
        var priceDetails = item.infoCard[0];
        jsonData[i].valeur_au_prix = priceDetails;

        var priceDetailsSplit = priceDetails.split(":");

        if(priceDetailsSplit[0] === 'Loyer ' || priceDetailsSplit[0] === 'Prix ')
        {
            var price = priceDetailsSplit[1].split("€");
            jsonData[i].prix_m2_an = (parseInt(price[0].trim().replace(" ", "")) / 12).toFixed(2) + " € / m² / an";
        }

        if(item.discrictTitle != null)
            jsonData[i].quartier = item.discrictTitle;
        else
            jsonData[i].quartier = "Non renseigné";

        jsonData[i].type_de_bien = 'Commerce';
        jsonData[i].index = i;
    });

    console.log(jsonData);
    result = res;

    let donnees = JSON.stringify(jsonData);
    fs.writeFile('test.json', donnees, function(erreur) {
        if (erreur) {
            console.log(erreur);
        }
    })


});