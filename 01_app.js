const express = require('express');
const fs = require("fs");
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

var util = require("util");
var app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'));
app.set("view engine", "ejs");

let db

MongoClient.connect('mongodb://127.0.0.1:27017', (err, database) => {
	if (err) return console.log(err);
	db = database.db('carnet_adresse');
	app.listen(8081, () => {});
})

app.get('/', (req, res) => {
	res.render('accueil.ejs');
})

app.get('/adresse', (req, res) => {
	var cursor = db.collection('adresse').find().toArray(function(err, resultat){
	if (err) return console.log(err);
	res.render('adresse.ejs', {adresse: resultat});
	});
})

/*app.post('/ajouter', (req, res) => {
	db.collection('adresse').save(req.body, (err, result) => {
	if (err) return console.log(err);
	console.log('sauvegarder dans la BD');
	res.redirect('/');
	});
})*/

app.post('/modifier', (req, res) => {
	req.body._id = ObjectID(req.body._id);
	db.collection('adresse').save(req.body, (err, result) => { if (err) return console.log(err) console.log('sauvegarder dans la BD') res.redirect('/list') })
}

app.get('/delete/:id', (req, res) => {
	var id = req.params.id;
	db.collection('adresse').findOneAndDelete({"_id": ObjectID(req.params.id)}, (err, resultat) => {
		if (err) return console.log(err);
		res.redirect('/adresse');
	})
})

