const http = require("node:http");
const fs = require("node:fs");
const url = require("node:url");

const replaceTeplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};

const templateOverView = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const datObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  // ===================================================================
  const pathName = url.parse(req.url, true).pathname;
  // overview page
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = datObj
      .map((el) => replaceTeplate(templateCard, el))
      .join("");
    const outPut = templateOverView.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
    res.end(outPut);
    // product page
  } else if (pathName === "/product") {
    res.end("this is PRODUCT");
    // api page
  } else if (pathName === "/api") {
    fs.readFile(`${__dirname}/data.json`, "utf-8", (err, data) => {
      res.writeHead(200, { "Content-type": "application/json" });
      res.end(data);
    });
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello world",
    });
    res.end("<h1>PAGE NOT FOUND</h1>");
  }
  // ===================================================================
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listen on port 8000");
});
