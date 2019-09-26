var express = require('express');
var multer = require('multer');
var path = require('path');

var app = express();
var server = require('http').createServer(app);
app.set('port', process.env.PORT || 3001);


/* email module */

var nodemailer = require('nodemailer');

transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jaisingh.iws@gmail.com',
      pass: 'iws123456'
    }
});



/* database coonnection */
require('./db');
Constant=require('./config');



/* Routes start */


/* Admin  start */

var users = require('./routers/users');
var categories = require('./routers/categories');
var orders = require('./routers/orders');
var brands = require('./routers/brands');


/* Admin  end */


/* Retailers start */

var retailers = require('./routers/retailers');
var products = require('./routers/products');
var zipcode = require('./routers/zipcodes');
var offers = require('./routers/offers');
var image = require('./routers/productimage');
var dashboard = require('./routers/dashboard');
var settings = require('./routers/settings');
var gallery = require('./routers/gallery');

/* Retailers end */

/* Cart start */

var cart = require('./routers/cart');

/* Cart Ends */

app.use(express.static(path.join(__dirname, 'uploads')));

/* Routes end  */

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




//create a cors middleware
app.use(function(req, res, next) {
//set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var router = express.Router();

/* home page */

router.get('/', function(req, res) {
    res.json({ message: 'welcome to bodyscanapp' });
});

//route to handle users 

app.use('/', router);
app.use('/users',users);
app.use('/category',categories);
app.use('/orders',orders);
app.use('/brands',brands);

app.use('/retailers', retailers);
app.use('/products', products);
app.use('/zipcodes', zipcode);
app.use('/offers', offers);
app.use('/image', image);
app.use('/dashboard', dashboard);
app.use('/settings', settings);
app.use('/gallery', gallery);

app.use('/cart', cart);


server.listen(app.get('port'));