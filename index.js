const http = require("node:http");
const fs = require("node:fs");
const url = require("node:url");
const replaceTemplate = require("./modules/replaceTemplate");

  // ===================================================================

const templateOverView = fs.readFileSync(`${__dirname}/templates/overview.html`,"utf-8");
const templateCard = fs.readFileSync(`${__dirname}/templates/card.html`,"utf-8");
const templateProduct = fs.readFileSync(`${__dirname}/templates/product.html`,"utf-8");
const data = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const datObj = JSON.parse(data);

  // ===================================================================

const server = http.createServer((req, res) => {

  const { pathname, query } = url.parse(req.url, true);
  // overview page
  if (pathname === "/" || pathname === "/overview") {

    const cardsHtml = datObj.map((el) => replaceTemplate(templateCard, el)).join("");
    const outPut = templateOverView.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);

    res.writeHead(200, { "Content-type": "text/html" });
    res.end(outPut);
    
    // product page
  } else if (pathname === "/product") {

    const product= datObj[query.id]
    const outPut=  replaceTemplate(templateProduct, product)

    res.writeHead(200, { "Content-type": "text/html" });
    res.end(outPut);

    // API
  } else if (pathname === "/api") {

    fs.readFile(`${__dirname}/data.json`, "utf-8", (err, data) => {
      res.writeHead(200, { "Content-type": "application/json" });
      res.end(data);
    });
    //Not Found
  } else {

    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello world",
    });
    res.end("<h1>PAGE NOT FOUND</h1>");
  }

});

  // ===================================================================

server.listen(8000, "127.0.0.1", () => {
  console.log("listen on port 8000");
});
