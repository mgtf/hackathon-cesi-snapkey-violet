const fs = require('fs')
 
let personne = {
   "prenom" : "Marie",
   "age" : 45,
   "passion" : "loisirs créatifs, histoire",
   "taille" : 172
}
let donnees = JSON.stringify(personne)
 
fs.writeFile('test.json', donnees, function(erreur) {
    if (erreur) {
        console.log(erreur)}
})
