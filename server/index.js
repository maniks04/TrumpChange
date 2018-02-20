const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const helpers = require('../helpers/backend-helpers');
const config = require('../config.js');
const cors = require('cors');
const stripe = require('stripe')(config.STRIPE_SECRET_KEY);

app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.json());

const app = express();

app.get('/fetchtweets', (req, res) => {
  const { user } = req.query.user;
  helpers.getTweets(user, (tweets) => {
    res.send(tweets);
  });
});

app.post('/createAccount', function(req, res) { // receives user account info - {username, password, email, zip code, max donation count}
 // this will call in db functions to save user to db.
});

app.post('/login', function(req, res) { // receives login information from front end
 // calls db functions to authenticate credentials
});

app.post('/customerToken', function(req, res) { // this will receive customer token
 // here need to use helper functions(from stripe) to create a new customer and create new subscription
 var token = req.body;
 console.log('token:', token);
 stripe.customers.create({
     source: token.id, // the id from the token object sent from front end
   email: ''
 }, function(err, customer) { // returns a customer object if successful
    if (err) {
        console.log('error in create function')
        res.send('error');
    } else {
         //var id = customer.id;
         //var email = customer.email;
        console.log('customer.id:', customer.id);
        console.log('customer.email:', customer.email);
      console.log(customer)
         stripe.subscriptions.create({ // creates a new subscription
             customer: customer.id,
             items: [
              {
                plan: 'Trump Change',
                quantity: 1
              }
             ],
         }, function(err, subscription) { // returns a subscription object
             if (err) {
               console.log('error creating subscription');
               res.send('error')
             } else {
                 console.log('saved subscription:', subscription);
               // here save the subscription to the db - use customer id and email so it can be found in db and added to user file
               res.send('success saving subscription');
             }
         });
    }
 })
});

app.post('/updateCounter', function(req, res) { // receives a post from front end to update the user's max count
 // uses db function to update that user's max count
});

app.listen(process.env.PORT || 3000, () => {
  console.log('listening on port 3000!');
});