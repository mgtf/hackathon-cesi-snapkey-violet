var request = require("request");

request({
  uri: "https://www.pointdevente.fr/produit.list?search=1&order_by=validated_at&order_by_date=created_on.DESC&order_dir=desc&offset=0&limit=50&layout=1&location=&search_type=1&recherche%5Bsubtransaction%5D=&recherche%5Bsubtransaction%5D=&recherche%5Btransaction%5D=&recherche%5Blocalisation%5D%5B0%5D%5Bid%5D=26707",
}, function(error, response, body) {
  console.log(body);
});
