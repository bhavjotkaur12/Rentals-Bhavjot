const express = require('express')
const exphbs = require("express-handlebars");




const app = express()


app.engine(".hbs", exphbs.engine({
    extname: ".hbs",
    helpers: {
        json: (context) => { return JSON.stringify(context) }
    }
  }));
  app.set("view engine", ".hbs");
 
app.use('/public', express.static('public'));


app.use(express.urlencoded({ extended: false }));


const items = [
  { id: 'item1', name: 'Red Scarlet X - EF Mount Camera ', available: true, imageUrl: "https://ontariocamera.com/cms/uploads/20180725160338_scarletx.jpg" },
  { id: 'item2', name: 'Beats Studio Wireless Headphones', available: false, imageUrl: "https://snpi.dell.com/snp/images/products/large/en-ca~AC009306/AC009306.JPG" },
  { id: 'item3', name: 'Lenovo Touchscreen Laptop', available: true, imageUrl: "https://p4-ofp.static.pub/ShareResource/na/subseries/gallery/lenovo-yoga-7i-gen7-16inch-01.png" },
  { id: 'item4', name: 'Amazon smart speaker with Alexa', available: false, imageUrl: "https://www.thesource.ca/medias/20200925150927-108091083-A.jpg-mediaConversion-640-x-480-mediaConversion-400-x-300-0?context=bWFzdGVyfGltYWdlc3w3MTMxMXxpbWFnZS9qcGVnfGltYWdlcy9oYTgvaGUyLzkyOTk4NTMxODA5NTguanBnfDY1NGVkN2VkODhlNjcxYzUzODdiNDBkNDc5Y2IwMDg4Y2FhY2MxZDBkYjZlMjdlMmM3NWJlOWZkODQ1ZDFjZDg" },
  { id: 'item5', name: 'Marshal Killburn || portable speaker', available: true, imageUrl: "https://www.londondrugs.com/on/demandware.static/-/Sites-londondrugs-master/default/dwa30abde9/products/L1542336/large/L1542336.JPG" },
  { id: 'item6', name: 'Nespresso Coffee Machine', available: true, imageUrl: "https://nestle-nespresso.com/sites/site.prod.nestle-nespresso.com/files/styles/crop_freeform/public/machine_pro.jpg?itok=B4IeqsJA" }
];


app.get('/', (req, res) => {
  res.render('index', { layout:false, items });
});


app.post('/search', (req, res) => {
  const keyword = req.body.keyword.toLowerCase();
  const results = items.filter(item => item.name.toLowerCase().includes(keyword));
  if (results.length === 0) {
    res.render('error', { layout:false, message: 'No items found matching the search criteria.' });
  } else {
    res.render('index', { layout:false, items: results });
  }
});


app.post('/rent', (req, res) => {
  const itemId = req.body.itemId;
  const item = items.find(item => item.id === itemId);
  if (item.available) {
    item.available = false;
    res.render('index', { layout:false, items });
  } else {
    res.render('error', { layout:false, message: 'This item is already rented.' });
  }
});


app.post('/return', (req, res) => {
    const rentedItems = items.filter(item => !item.available);
 
    if (rentedItems.length === 0) {
      res.render('error', {layout:false, message: 'You do not have any rented items.' });
    } else {
      rentedItems.forEach(item => item.available = true);
      res.render('index', {layout:false, items });
    }
  });


app.post('/update', (req, res) => {
  const criteria = req.body.criteria;
  let results;
  if (criteria === 'available') {
    results = items.filter(item => item.available);
  } else {
    results = items.filter(item => !item.available);
  }
  if (results.length === 0) {
    res.render('error', {layout:false, message: 'You do not have any rented items.' });
  } else {
    res.render('index', {layout:false, items: results });
  }
});


app.get('*', (req, res) => {
  res.render('error', {layout:false, message: 'Page not found.'})  
});




const HTTP_PORT = process.env.PORT || 8080
const onHttpStart = () => {
    console.log("The web server has started...")
    console.log(`Server is listening on port ${HTTP_PORT}`)
    console.log("Press CTRL+C to stop the server.")
 }
 
 
 app.listen(HTTP_PORT, onHttpStart)
