const http = require('http');
const url = require('url');
const fs = require('fs');
// Functions ###################################################
function replaceTemp(cardTemp, el) {
  let output = cardTemp.replace(/{%NAME%}/g, el.Name);
  output = output.replace(/{%PRICE%}/g, el.Price + '/-');
  output = output.replace(/{%CONDITION%}/g, el.Condition);
  output = output.replace(/{%DESCRIPTION%}/g, el.Description);
  output = output.replace(/{%DISCOUNT%}/g, el.Discount + '%');
  output = output.replace(/{%IMAGE%}/g, el.Image);
  output = output.replace(/{%CATEGORY%}/g, el.Category);
  output = output.replace(/{%ID%}/g, el.id);
  return output;
}

function replaceCat(cardTemp, el, cat) {
  if (cat == el.Category) {
    output = replaceTemp(cardTemp, el);
    return output;
  }
}
// Reading files ################################################
const landingPage = fs.readFileSync('./views/LandingPage.html', 'utf-8');
const cardTemp = fs.readFileSync('./views/Card.html', 'utf-8');
const contactUs = fs.readFileSync('./views/ContactUs.html', 'utf-8');
const about = fs.readFileSync('./views/About.html', 'utf-8');
const categories = fs.readFileSync('./views/Categories.html', 'utf-8');
const pcard = fs.readFileSync('./views/productcard.html', 'utf-8');
const details1 = fs.readFileSync('./views/Details.html', 'utf-8');
const product1 = fs.readFileSync('./views/Products.html', 'utf-8');
const data = fs.readFileSync('./static/data.json');
const discountdata = fs.readFileSync('./static/discount.json');

const Pdata = JSON.parse(data);
const Ddata = JSON.parse(discountdata);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  if (pathname == '/') {
    //Creating cards
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cards = Ddata.map((el) => replaceTemp(cardTemp, el)).join('');
    const homePage = landingPage.replace(/{%CARDS%}/g, cards);
    res.end(homePage);
  } else if (pathname == '/contactus') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    res.end(contactUs);
  } else if (pathname == '/about') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    res.end(about);
  } else if (pathname == '/categories') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    res.end(categories);
  } else if (pathname == '/new') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const pcards = Pdata.map((el) => replaceCat(pcard, el, 'new')).join('');
    const homePage = product1.replace(/{%CARDS%}/g, pcards);
    res.end(homePage);
  } else if (pathname == '/old') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const pcards = Pdata.map((el) => replaceCat(pcard, el, 'old')).join('');
    const homePage = product1.replace(/{%CARDS%}/g, pcards);
    res.end(homePage);
  } else if (pathname == '/combo') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const pcards = Pdata.map((el) => replaceCat(pcard, el, 'combo')).join('');
    const homePage = product1.replace(/{%CARDS%}/g, pcards);
    res.end(homePage);
  } else if (pathname == '/accessories') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const pcards = Pdata.map((el) => replaceCat(pcard, el, 'accessories')).join('');
    const homePage = product1.replace(/{%CARDS%}/g, pcards);
    res.end(homePage);
  } else if (pathname == '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    console.log(url.parse(req.url, true));
    const product = Pdata[query.id];
    const output = replaceTemp(details1, product);
    res.end(output);
  } else if (pathname == '/discount') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    console.log(url.parse(req.url, true));
    const product = Ddata[query.id];
    const output = replaceTemp(details1, product);
    res.end(output);
  }
  if (req.url.indexOf('.css') != -1) {
    //req.url has the pathname, check if it conatins '.css'

    fs.readFile(__dirname + '/public/styles/styles.css', function (err, data) {
      if (err) console.log(err);
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.write(data);
      res.end();
    });
  }
});
const { PORT = 3000, LOCAL_ADDRESS = '0.0.0.0' } = process.env;
server.listen(PORT, LOCAL_ADDRESS, () => {
  const address = server.address();
  console.log('server hearing at an', address);
});
